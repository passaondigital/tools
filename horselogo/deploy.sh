#!/bin/bash
# ============================================================
# HorseLogo.de — Deployment Script
# Run on the VPS as the deploy user.
# Usage: bash deploy.sh
# ============================================================

set -euo pipefail

REPO_DIR="/var/www/horselogo"
FRONTEND_DIR="$REPO_DIR/frontend"
BACKEND_DIR="$REPO_DIR/backend"

echo "🐴 HorseLogo.de — Deploying..."

# ── 1. Pull latest code ──────────────────────────────────────
cd "$REPO_DIR"
git pull origin main
echo "✓ Code updated"

# ── 2. Install dependencies ──────────────────────────────────
cd "$FRONTEND_DIR"
npm ci --production=false
echo "✓ Frontend deps installed"

cd "$BACKEND_DIR"
npm ci
echo "✓ Backend deps installed"

# ── 3. Build frontend ────────────────────────────────────────
cd "$FRONTEND_DIR"
npm run build
echo "✓ Frontend built → dist/"

# ── 4. Restart backend ───────────────────────────────────────
cd "$REPO_DIR"
pm2 reload pm2/ecosystem.config.cjs --update-env
echo "✓ Backend restarted via PM2"

# ── 5. Reload Nginx ──────────────────────────────────────────
sudo nginx -t && sudo systemctl reload nginx
echo "✓ Nginx reloaded"

echo ""
echo "✅ Deployment complete — https://horselogo.de"
