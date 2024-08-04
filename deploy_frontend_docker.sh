#!/bin/bash

source config.sh

# Confirm the backend is running
echo "Checking if backend is running..."
until gcloud compute ssh $INSTANCE_NAME --zone=$ZONE --command="curl -s http://localhost:5001/health-check" &>/dev/null; do
    echo "Backend not yet running, waiting..."
    sleep 5
done
echo "Backend is running."

export TODO_API_IP=$(gcloud compute instances describe $INSTANCE_NAME --zone=$ZONE --format='get(networkInterfaces[0].accessConfigs[0].natIP)')

echo "[FRONTEND] Creating Docker image..."
cd frontend

# Build image based on ip address of backend
docker build -t gcr.io/$PROJECT_ID/$GCR_IMAGE_NAME --build-arg api_ip=$TODO_API_IP .

# Push to Google Container Registry
docker push gcr.io/$PROJECT_ID/$GCR_IMAGE_NAME:latest

echo "[FRONTEND] Deploying to Cloud Run..."
gcloud run deploy $CLOUD_RUN_SERVICE_NAME --image gcr.io/$PROJECT_ID/$GCR_IMAGE_NAME:latest --platform managed --region $REGION --allow-unauthenticated
