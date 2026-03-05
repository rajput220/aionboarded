#!/bin/bash
# ===========================================
# AI Onboarded — SSL Certificate Setup
# ===========================================
# Run this ONCE on the VPS to obtain the initial Let's Encrypt certificate.
# After this, the certbot container handles automatic renewal.
#
# Usage: ./init-ssl.sh [your-email@example.com]
# Example: ./init-ssl.sh admin@aionboarded.ai

set -e

COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.production"
DOMAIN="aionboarded.ai"
EMAIL="${1:-}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[SSL]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# Check prerequisites
[ -f "$ENV_FILE" ] || error "$ENV_FILE not found."
command -v docker >/dev/null 2>&1 || error "Docker is not installed"
command -v docker compose >/dev/null 2>&1 || error "Docker Compose is not installed"

if [ -z "$EMAIL" ]; then
    error "Please provide your email: ./init-ssl.sh your-email@example.com"
fi

# Step 1: Create a temporary nginx config that only serves HTTP (for initial cert provisioning)
log "Creating temporary nginx config for certificate provisioning..."
cat > /tmp/nginx-certbot-init.conf << 'EOF'
server {
    listen 80;
    server_name aionboarded.ai www.aionboarded.ai;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 200 'Waiting for SSL certificate...';
        add_header Content-Type text/plain;
    }
}
EOF

# Step 2: Start nginx with the temporary config (HTTP-only, no SSL references)
log "Starting nginx with temporary HTTP-only config..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" stop nginx 2>/dev/null || true
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" run -d \
    --name nginx-certbot-init \
    -p 80:80 \
    -v /tmp/nginx-certbot-init.conf:/etc/nginx/conf.d/default.conf:ro \
    -v "$(docker volume inspect $(docker compose -f $COMPOSE_FILE ps -q 2>/dev/null | head -1)_certbot-webroot --format '{{.Name}}' 2>/dev/null || echo 'aionboarded_certbot-webroot'):/var/www/certbot:ro" \
    nginx nginx:alpine 2>/dev/null || true

# Simpler approach: use docker run directly
docker stop nginx-certbot-init 2>/dev/null || true
docker rm nginx-certbot-init 2>/dev/null || true

# Ensure volumes exist
docker volume create aionboarded_certbot-webroot 2>/dev/null || true
docker volume create aionboarded_certbot-certs 2>/dev/null || true

log "Starting temporary nginx for ACME challenge..."
docker run -d \
    --name nginx-certbot-init \
    -p 80:80 \
    -v /tmp/nginx-certbot-init.conf:/etc/nginx/conf.d/default.conf:ro \
    -v aionboarded_certbot-webroot:/var/www/certbot \
    nginx:alpine

sleep 3

# Step 3: Obtain the certificate
log "Requesting certificate for $DOMAIN..."
docker run --rm \
    -v aionboarded_certbot-webroot:/var/www/certbot \
    -v aionboarded_certbot-certs:/etc/letsencrypt \
    certbot/certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN" \
    -d "www.$DOMAIN"

# Step 4: Clean up temporary nginx
log "Cleaning up temporary nginx..."
docker stop nginx-certbot-init 2>/dev/null || true
docker rm nginx-certbot-init 2>/dev/null || true
rm -f /tmp/nginx-certbot-init.conf

# Step 5: Now start the stack with the real nginx config (which references the certs)
log "Starting full stack with SSL..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d

sleep 5

# Verify
log ""
log "============================================"
log " SSL Certificate installed!"
log " Testing HTTPS..."
if curl -sI "https://$DOMAIN" | head -1 | grep -q "200\|301\|302"; then
    log " ✅ HTTPS is working!"
else
    warn " HTTPS test inconclusive. Check: docker compose -f $COMPOSE_FILE logs nginx"
fi
log ""
log " Site: https://$DOMAIN"
log " Admin: https://$DOMAIN/admin"
log " Certificate auto-renews via the certbot container."
log "============================================"
