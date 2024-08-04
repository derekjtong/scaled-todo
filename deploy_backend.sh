#!/bin/bash

source config.sh

gcloud config set project $PROJECT_ID

echo "Deleting existing resources..."
gcloud compute instances delete $INSTANCE_NAME --zone=$ZONE --quiet
gcloud compute firewall-rules delete rule-allow-tcp-5001 --quiet
echo "Deleted existing resources."

echo "[BACKEND] Starting compute instance..."
gcloud compute instances create $INSTANCE_NAME \
    --zone=$ZONE \
    --machine-type=$MACHINE_TYPE \
    --image-family=$IMAGE_FAMILY \
    --image-project=$IMAGE_PROJECT \
    --tags=$TAGS \

echo "[BACKEND] Adding firewall rules..."
gcloud compute firewall-rules create rule-allow-tcp-5001 --source-ranges 0.0.0.0/0 --target-tags http-server --allow tcp:5001

# Wait for instance ot be ready
echo "Waiting for instance to be ready..."
while ! gcloud compute ssh $INSTANCE_NAME --zone=$ZONE --command="echo 'Instance is up'" &> /dev/null; do
    sleep 1
done

echo "Copying files to $INSTANCE_NAME..."
gcloud compute scp --recurse ./backend $INSTANCE_NAME:~/ --zone=$ZONE --quiet
gcloud compute scp ./start_backend.sh $INSTANCE_NAME:~/ --zone=$ZONE --quiet
echo "Files copied successfully to $INSTANCE_NAME."

echo "[BACKEND] Starting backend..."
gcloud compute ssh $INSTANCE_NAME --zone=$ZONE --command "sudo ./start_backend.sh production"