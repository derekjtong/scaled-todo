#!/bin/bash

echo "Starting backend setup" >>/var/log/startup-script.log

# Set FLASK_ENV based on the argument passed to the script
if [ "$1" == "production" ]; then
    export FLASK_ENV=production
    export PROJECT_ID_NUM="$2"
else
    source config.sh
    export FLASK_ENV=development
    export PROJECT_ID_NUM=$PROJECT_ID_NUM
fi
echo "FLASK_ENV set to $FLASK_ENV" >>/var/log/startup-script.log

# Not needed since we have set up a service account
# gcloud auth login
# export GOOGLE_APPLICATION_CREDENTIALS=/home/<USERNAME>/application_default_credentials.json

cd ./backend

apt-get update -y
apt-get install -y python3-pip

pip3 install --upgrade -r requirements.txt

# Use unicorn for production
if [ "$FLASK_ENV" == "production" ]; then
    gunicorn -w 4 -b 0.0.0.0:5001 server:app --certfile cert.pem --keyfile key.pem
else
    python3 server.py
fi
