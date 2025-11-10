#!/bin/bash
set -e

# --- Setup Git identity ---
git config --global user.name "Auto Data Bot"
git config --global user.email "autobot@sapnashrijewellers.com"

# --- Clone repo if missing ---
if [ ! -d "/app/repo/.git" ]; then
  echo "Cloning repository..."
  rm -rf /app/repo
  git clone https://$GITHUB_USER:$GITHUB_TOKEN@github.com/sapnashrijewellers/static.git /app/repo
else
  echo "Repository already exists, pulling latest changes..."
  cd /app/repo
  git pull origin main || true
fi

# --- Ensure we're inside repo before starting cron ---
cd /app/repo

# --- Run task immediately once before starting cron ---
echo "Running immediate data generation..."
bash /app/ShellScripts/update-rates.sh || echo "Initial rate update failed, continuing..."
bash /app/ShellScripts/products.sh || echo "Initial data.json failed, continuing..."
bash /app/ShellScripts/publish.sh || echo "Initial site publish failed, continuing..."

# --- Install crontab dynamically ---
echo "Installing cron schedule..."
crontab /etc/cron.d/generator-cron

# --- Show the cron table for debugging ---
echo "Cron jobs installed:"
crontab -l

# --- Start cron in foreground (with log level 2) ---
echo "Starting cron..."

cron -f