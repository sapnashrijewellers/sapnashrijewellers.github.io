# -------------------------------
# Stage 1 — Build stage
# -------------------------------
FROM node:22-bookworm AS builder
WORKDIR /app

# Install dependencies only once (cache-friendly)
COPY package*.json ./
RUN npm install
RUN npm install -g gh-pages
RUN npm install react-icons

# Copy the rest of the application
COPY . .

# -------------------------------
# Stage 2 — Runtime image
# -------------------------------
FROM node:22-slim

# Install only minimal runtime dependencies
RUN apt-get update && apt-get install -y \
    bash \
    curl \
    git \
    cron \
    ca-certificates \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Set timezone to IST
ENV TZ=Asia/Kolkata
RUN ln -sf /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo "$TZ" > /etc/timezone && \
    dpkg-reconfigure -f noninteractive tzdata

# Create working directory
WORKDIR /app

# Copy from build stage — only what’s needed
COPY --from=builder /app /app

# Copy crontab
COPY crontab.txt /etc/cron.d/generator-cron

# Apply permissions
RUN chmod 0644 /etc/cron.d/generator-cron && \
    chmod +x /app/ShellScripts/*.sh

# Run entrypoint
ENTRYPOINT ["/app/ShellScripts/entrypoint.sh"]
