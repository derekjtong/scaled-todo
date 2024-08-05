# Scaled Todo

Simple todo app build on random bits of pieces from Google Cloud Platform

## Tech Stack
Selected items:
* Backend
  * Flask
  * gunicorn
  * Cloud SQL Python connector
  * Google Secret Manager
* Frontend
  * Nodejs
  * Nextjs
  * Typescript
  * Tailwind CSS
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
