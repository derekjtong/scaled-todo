#!/bin/bash

source config.sh

echo "Deleting existing resources..."
gcloud container clusters delete $KUBERNETES_CLUSTER_NAME --zone=$ZONE --quiet
echo "Deleted existing resources."

# Confirm the backend is running
echo "Checking if backend is running..."
until gcloud compute ssh $INSTANCE_NAME --zone=$ZONE --command="curl -k https://localhost:5001/health-check" &>/dev/null; do
    echo "Backend not yet running, waiting..."
    sleep 5
done
echo "Backend is running."

export TODO_API_IP=$(gcloud compute instances describe $INSTANCE_NAME --zone=$ZONE --format='get(networkInterfaces[0].accessConfigs[0].natIP)')

echo "[FRONTEND] Creating Docker image..."
cd frontend

# Build image based on ip address of backend
docker build -t derekjtong/scaled-todo --build-arg api_ip=$TODO_API_IP .

# Push to Docker Hub
docker push derekjtong/scaled-todo:latest

echo "[FRONTEND] Creating container cluster..."
gcloud container clusters create $KUBERNETES_CLUSTER_NAME --zone=$ZONE
gcloud container clusters get-credentials $KUBERNETES_CLUSTER_NAME --zone=$ZONE

echo "[FRONTEND] Deploying to GKE..."
kubectl create deployment $KUBERENTES_DEPLOYMENT_NAME --image=derekjtong/scaled-todo --port=3000
kubectl expose deployment $KUBERENTES_DEPLOYMENT_NAME --type="LoadBalancer"

watch kubectl get service $KUBERENTES_DEPLOYMENT_NAME
