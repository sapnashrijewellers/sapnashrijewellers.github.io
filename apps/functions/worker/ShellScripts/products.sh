#!/bin/bash
set -e

PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

echo "[$(date)] Starting scheduled data generation..."

# Setup working directory
WORKDIR="/app/repo"

# Clone the repo if missing
if [ ! -d "$WORKDIR/.git" ]; then
  echo "Repository not found. Cloning..."
  rm -rf "$WORKDIR"
  git clone https://$GITHUB_USER:$GITHUB_TOKEN@github.com/sapnashrijewellers/static.git "$WORKDIR"
else
  echo "Repository exists. Pulling latest changes..."
  cd "$WORKDIR"
  git pull origin main
fi

# Go to app folder and run your script
cd /app
echo "Running products.js..."
node ./NodeScripts/products.js

# Copy generated file into repo
cp /app/data.json "$WORKDIR/data.json"

# Commit and push if changes exist
cd "$WORKDIR"
git add data.json

if git diff --cached --quiet; then
  echo "[$(date)] No changes in data.json. Skipping commit."
else
  git commit -m "Auto update data.json on $(date)"
  git push origin main
  echo "[$(date)] Data updated and pushed to GitHub."
fi

echo "[$(date)] Task completed."
