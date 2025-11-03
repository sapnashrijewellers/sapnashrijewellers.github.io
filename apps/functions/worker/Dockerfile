FROM node:22-slim

# Install cron and git
RUN apt-get update && apt-get install -y \
bash curl git cron && rm -rf /var/lib/apt/lists/*

# Create working directory
WORKDIR /app

# Copy files
COPY package*.json ./
RUN npm install --omit=dev || true   # optional if you use dependencies
COPY . .

# # Copy crontab
COPY crontab.txt /etc/cron.d/generator-cron

# Apply cron permissions
RUN chmod 0644 /etc/cron.d/generator-cron && \
    chmod +x /app/entrypoint.sh && \
    chmod +x /app/run-5-min-task.sh && \
    chmod +x /app/send-rate-notification.sh

ENTRYPOINT ["/app/entrypoint.sh"]