#!/bin/bash

echo "Starting backend setup" >> /var/log/startup-script.log

# Set FLASK_ENV based on the argument passed to the script
if [ "$1" == "production" ]; then
  export FLASK_ENV=production
else
  export FLASK_ENV=development
fi
echo "FLASK_ENV set to $FLASK_ENV" >> /var/log/startup-script.log

apt-get update -y
apt-get upgrade -y
apt-get install -y wget
apt-get install -y python3-pip
pip3 install --upgrade flask gunicorn

cd ./backend
# Start the Flask app using Gunicorn for production
if [ "$FLASK_ENV" == "production" ]; then
    gunicorn -w 4 -b 0.0.0.0:5001 server:app
else
    python3 server.py
fi