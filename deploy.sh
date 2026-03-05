#!/bin/bash
# ===========================================
# AI Onboarded — Production Deployment Script
# ===========================================
# Usage: ./deploy.sh [first-run|update]

set -e

COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.production"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() { echo -e "${GREEN}[DEPLOY]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# Check prerequisites
check_prereqs() {
    command -v docker >/dev/null 2>&1 || error "Docker is not installed"
    command -v docker compose >/dev/null 2>&1 || error "Docker Compose is not installed"
    [ -f "$ENV_FILE" ] || error "$ENV_FILE not found. Copy .env.production.example and fill in real values."
}

# First-time deployment
first_run() {
    log "Starting first-time deployment..."
    check_prereqs

    log "Building and starting all services..."
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --build

    log "Waiting for services to be healthy..."
    sleep 10

    log "Checking service status..."
    docker compose -f "$COMPOSE_FILE" ps

    log ""
    log "============================================"
    log " Deployment complete!"
    log " App: http://$(curl -s ifconfig.me)"
    log " Admin: http://$(curl -s ifconfig.me)/admin"
    log "============================================"
}

# Update deployment (pull latest code and rebuild)
update() {
    log "Updating deployment..."
    check_prereqs

    log "Pulling latest code..."
    git pull origin main

    log "Rebuilding and restarting app (zero-downtime)..."
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --build app

    log "Restarting nginx to pick up changes..."
    docker compose -f "$COMPOSE_FILE" restart nginx certbot

    log "Checking service status..."
    docker compose -f "$COMPOSE_FILE" ps

    log ""
    log "============================================"
    log " Update complete!"
    log "============================================"
}

# Show logs
logs() {
    docker compose -f "$COMPOSE_FILE" logs -f --tail=100
}

# Renew SSL certificates
ssl_renew() {
    log "Renewing SSL certificates..."
    docker compose -f "$COMPOSE_FILE" run --rm certbot renew
    log "Reloading nginx to pick up new certificates..."
    docker compose -f "$COMPOSE_FILE" exec nginx nginx -s reload
    log "SSL renewal complete!"
}

# Main
case "${1:-first-run}" in
    first-run)
        first_run
        ;;
    update)
        update
        ;;
    ssl-renew)
        ssl_renew
        ;;
    logs)
        logs
        ;;
    *)
        echo "Usage: $0 [first-run|update|ssl-renew|logs]"
        exit 1
        ;;
esac
