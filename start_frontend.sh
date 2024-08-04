#!/bin/bash

apt-get update -y
apt-get upgrade -y
apt-get install -y wget
apt-get install -y python3-pip
pip3 install --upgrade flask

cd ./frontend
python3 server.py
