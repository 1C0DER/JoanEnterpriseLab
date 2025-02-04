#!/bin/bash

echo "Starting project setup..."

#Go to the  directory
cd /home/salary_web/

#Clone to the repository if not cloned
if [ ! -d "JoanEnterpriseLab" ]; then
	git clone https://github.com/1C0DER/JoanEnterpriseLab.git
	else
	echo "Repo already exists. Skipping clone."
	fi

# Go to the project folder
cd JoanEnterpriseLab/HTML/Basics

#Pull the latest changes
git pull origin main

# Install necessary dependencies
npm install

# Start the server
node index.js &

echo "Project setup complete. SErver is running at http://localhost:8000/"
