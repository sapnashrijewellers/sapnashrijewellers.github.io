#!/bin/bash
set -e

PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

echo "[$(date)] Starting sending notification..."

# Setup working directory
WORKDIR="/app"


# Go to app folder and run your script
cd /app
echo "Running sendNotification.js..."
node ./NodeScripts/sendNotification.js

echo "[$(date)] Task completed."
