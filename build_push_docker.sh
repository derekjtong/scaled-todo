#!/bin/bash

# Load environment variables from config file
source config.sh

export TODO_API_IP=$(gcloud compute instances describe $INSTANCE_NAME --zone=$ZONE --format='get(networkInterfaces[0].accessConfigs[0].natIP)')

echo "[FRONTEND] Creating Docker image locally..."
cd frontend
docker build -t $DOCKER_HUB_IMAGE_NAME --build-arg api_ip=${TODO_API_IP} .

echo "[FRONTEND] Testing Docker image locally..."
docker run -d -p 5000:5000 --name scaled-todo $DOCKER_HUB_IMAGE_NAME

# Optionally, you can add some tests here to verify the running container
# For example, check if the app responds to a health check endpoint
echo "Checking if the frontend is running locally..."
until curl -s http://localhost:5000/health-check &> /dev/null; do
    echo "Frontend not yet running, waiting..."
    sleep 5
done
echo "Frontend is running locally."

# Stop and remove the local Docker container after testing
docker stop scaled-todo
docker rm scaled-todo

echo "[FRONTEND] Pushing Docker image to the registry..."
docker push $DOCKER_HUB_IMAGE_NAME
