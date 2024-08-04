# Variables for creating the VM
PROJECT_ID="cisc5550-431018"
ZONE="us-east4-a"
REGION="us-east4"

# Backend - GCP Compute Engine
INSTANCE_NAME="hagu-0"
MACHINE_TYPE="e2-medium"
IMAGE_FAMILY="ubuntu-2004-lts"
IMAGE_PROJECT="ubuntu-os-cloud"
BOOT_DISK_SIZE="200GB"
TAGS="http-server"

# Backend - GCP Secret Manager Service Account
BACKEND_SECRET_SA_NAME="backend-secret-access-sa"
BACKEND_SECRET_SA_EMAIL="$BACKEND_SECRET_SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"

# Docker
DOCKER_HUB_IMAGE_NAME="derekjtong/scaled-todo"
GCR_IMAGE_NAME="scaled-todo" # name on Google Container Registry

# Frontend - GCP Cloud Run
CLOUD_RUN_SERVICE_NAME="scaled-todo"

# Frontend - GKE
KUBERNETES_CLUSTER_NAME="cisc5550-cluster"
KUBERENTES_DEPLOYMENT_NAME="todolist-app-frontend"
