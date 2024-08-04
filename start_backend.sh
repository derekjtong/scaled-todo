#!/bin/bash

echo "Starting backend setup" >> /var/log/startup-script.log

apt-get update -y
apt-get upgrade -y
apt-get install -y wget
apt-get install -y python3-pip
pip3 install --upgrade flask

cd ./backend
python3 server.py

echo "Backend setup complete" >> /var/log/startup-script.log