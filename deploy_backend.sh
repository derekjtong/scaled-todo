#!/bin/bash

source config.sh

# clean __pycache__ directories
find . -name "__pycache__" -type d -exec rm -r {} +

gcloud config set project $PROJECT_ID

# Parameter "nd" to quickly redeploy without deleting existing resources
if [[ "$1" == "nd" ]]; then
    echo "Force quitting server..."
    REMOTE_SCRIPT="
    PIDS=\$(pgrep gunicorn);
    if [ -z \"\$PIDS\" ]; then
        echo 'No gunicorn processes are running.';
    else
        echo 'Killing the following gunicorn processes: \$PIDS';
        sudo kill -9 \$PIDS;
        echo 'gunicorn processes killed.';
        # Verifying the processes are killed
        NEW_PIDS=\$(pgrep gunicorn);
        if [ -z \"\$NEW_PIDS\" ]; then
            echo 'Verified: No gunicorn processes are running.';
        else
            echo 'Error: Some gunicorn processes are still running: \$NEW_PIDS';
        fi
    fi
    "
    sleep 3
    gcloud compute ssh $INSTANCE_NAME --zone $ZONE --command "$REMOTE_SCRIPT"
else
    echo "Deleting existing resources..."
    gcloud compute instances delete $INSTANCE_NAME --zone=$ZONE --quiet
    gcloud compute firewall-rules delete rule-allow-tcp-5001 --quiet
    echo "Deleted existing resources."
fi

echo "[BACKEND] Creating service account..."
gcloud iam service-accounts create $BACKEND_SECRET_SA_NAME \
    --description="Access Secret Manager and Cloud SQL Client" \
    --display-name="Backend Service Account" \
    --quiet

echo "[BACKEND] Granting roles to the service account..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$BACKEND_SECRET_SA_EMAIL" \
    --role="roles/secretmanager.secretAccessor" \
    --quiet

echo "[BACKEND] Adding policy binding for service account user..."
gcloud iam service-accounts add-iam-policy-binding $BACKEND_SECRET_SA_EMAIL \
    --member="user:$(gcloud config get-value account)" \
    --role=roles/iam.serviceAccountUser \
    --quiet

echo "[BACKEND] Granting Cloud SQL Client role to the service account..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$BACKEND_SECRET_SA_EMAIL" \
    --role="roles/cloudsql.client" \
    --quiet

echo "[BACKEND] Starting compute instance..."
gcloud compute instances create $INSTANCE_NAME \
    --zone=$ZONE \
    --machine-type=$MACHINE_TYPE \
    --image-family=$IMAGE_FAMILY \
    --image-project=$IMAGE_PROJECT \
    --tags=$TAGS \
    --service-account=$BACKEND_SECRET_SA_EMAIL \
    --scopes=https://www.googleapis.com/auth/cloud-platform

echo "[BACKEND] Adding firewall rules..."
gcloud compute firewall-rules create rule-allow-tcp-5001 \
    --source-ranges 0.0.0.0/0 \
    --target-tags http-server \
    --allow tcp:5001

gcloud compute firewall-rules create allow-http \
    --description="Allow HTTP traffic on port 80" \
    --direction=INGRESS \
    --priority=1000 \
    --network=default \
    --action=ALLOW \
    --rules=tcp:80 \
    --source-ranges=0.0.0.0/0 \
    --target-tags=http-server

gcloud compute firewall-rules create allow-https \
    --description="Allow HTTPS traffic on port 443" \
    --direction=INGRESS \
    --priority=1000 \
    --network=default \
    --action=ALLOW \
    --rules=tcp:443 \
    --source-ranges=0.0.0.0/0 \
    --target-tags=https-server

# Wait for instance to be ready
echo "Waiting for instance to be ready..."
while ! gcloud compute ssh $INSTANCE_NAME --zone=$ZONE --command="echo 'Instance is up'" &>/dev/null; do
    sleep 1
done

# Check if existing certificates are still valid
CERT_VALID=true
if gcloud compute ssh $INSTANCE_NAME --zone=$ZONE --command="openssl x509 -checkend 86400 -noout -in ~/backend/cert.pem" &>/dev/null; then
    echo "Certificate is still valid for at least 24 hours."
else
    echo "Certificate is expired or not found, generating a new one..."
    CERT_VALID=false
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout backend/key.pem -out backend/cert.pem -subj "/CN=localhost"
fi

echo "Copying files to $INSTANCE_NAME..."

# Ensure the remote backend directory exists
gcloud compute ssh $INSTANCE_NAME --zone=$ZONE --command="mkdir -p ~/backend"

# Create a temporary folder to hold files to be copied, excluding cert.pem, key.pem, and __pycache__
TEMP_DIR=$(mktemp -d)
cp -r ./backend/* $TEMP_DIR >/dev/null 2>&1
rm -f $TEMP_DIR/cert.pem
rm -f $TEMP_DIR/key.pem
rm -rf $TEMP_DIR/__pycache__

# Copy everything from the temporary folder to the remote instance
gcloud compute scp --recurse $TEMP_DIR/* $INSTANCE_NAME:~/backend/ --zone=$ZONE --quiet

# Clean up the temporary folder
rm -rf $TEMP_DIR

# Copy start_backend separately
gcloud compute scp ./start_backend.sh $INSTANCE_NAME:~/ --zone=$ZONE --quiet

if [[ "$CERT_VALID" == "false" ]]; then
    gcloud compute scp ./backend/cert.pem $INSTANCE_NAME:~/backend/cert.pem --zone=$ZONE --quiet
    gcloud compute scp ./backend/key.pem $INSTANCE_NAME:~/backend/key.pem --zone=$ZONE --quiet
fi

echo "Files copied successfully to $INSTANCE_NAME."

echo "[BACKEND] Starting backend..."
gcloud compute ssh $INSTANCE_NAME \
    --zone=$ZONE \
    --command "sudo ./start_backend.sh production $PROJECT_ID_NUM"
