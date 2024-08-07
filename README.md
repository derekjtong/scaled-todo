# Scaled Todo

Simple todo app build on random bits of pieces from Google Cloud Platform

## How to use
### Database Setup
Required for local as well
1. Create Cloud SQL database
2. Set Google Secret Manager to database variables

### Local Environment
1. `./start_backend.sh`
2. `./start_frontend.sh`

### Deploy
1. Install gcloud and authenticate
2. Adjust `config.sh` to your information
3. Run `chmod +x <file_name>` as needed for the script files below
4. Run `deploy_backend.sh`
5. Run frontend using Docker
   * Run `./deploy_frontend_docker.sh`
   * If redeploying, use `./deploy_frontend_docker.sh nd`
   * Look for service url, like this:
```
Service URL: https://scaled-todo-7rc2xctjiq-uk.a.run.app
```
8. Run frontned using Kubernetes
   * Run `./deploy_frontend_kubernetes.sh`
   * Look for `EXTERNAL-IP` like this:
```
NAME                    TYPE           CLUSTER-IP       EXTERNAL-IP     PORT(S)          AGE
todolist-app-frontend   LoadBalancer   34.118.236.174   34.48.144.164   5000:32549/TCP   15m
```
   * Connect on `EXTERNAL-IP:3000`

     
## Tech Stack
Selected items:
* Backend
  * Flask
  * gunicorn
  * Cloud SQL Python connector
  * Google Secret Manager
  * Flask-JWT-Extended
  * bcrypt
* Frontend
  * Nodejs
  * Nextjs
  * Typescript
  * Tailwind CSS
  * shadcn/ui
* Deployment
  * Cloud SQL
  * Compute Engine
  * Artifact Registry
  * Cloud Run
  * Docker Hub
  * Google Kubernetes Engine

## Infra
More detailed breakdown

* Secrets: Google Secret Manager
* Dev Database: Cloud SQL - MySQL
* Prod Database: Cloud SQL - MySQL
* Prod Backend: Compute Engine
* Prod Frontend: Artifact Registry & Cloud Run
* Prod Frontend: Docker Hub & Google Kubernetes Engine
