FROM node:22-slim

# Install cron and git
RUN apt-get update && apt-get install -y \
bash curl git cron && rm -rf /var/lib/apt/lists/*

# Set timezone to IST
RUN ln -sf /usr/share/zoneinfo/Asia/Kolkata /etc/localtime && \
    echo "Asia/Kolkata" > /etc/timezone && \
    dpkg-reconfigure -f noninteractive tzdata
    
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
    chmod +x /app/ShellScripts/entrypoint.sh && \
    chmod +x /app/ShellScripts/update-rates.sh && \
    chmod +x /app/ShellScripts/send-rate-notification.sh && \
    chmod +x /app/ShellScripts/products.sh

ENTRYPOINT ["/app/ShellScripts/entrypoint.sh"]