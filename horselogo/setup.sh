#!/bin/bash
# ============================================================
# HorseLogo.de — First-Time VPS Setup Script
# Run once on a fresh Ubuntu 24.04 VPS.
# Usage: bash setup.sh
# ============================================================

set -euo pipefail

DOMAIN="horselogo.de"
APP_DIR="/var/www/horselogo"
NGINX_CONF="/etc/nginx/sites-available/$DOMAIN"

echo "🐴 HorseLogo.de — Initial Setup"

# ── 1. System dependencies ───────────────────────────────────
apt-get update
apt-get install -y nginx certbot python3-certbot-nginx nodejs npm git curl

# Install Node.js 22 LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs

# Install PM2 globally
npm install -g pm2

echo "✓ System deps installed (Node $(node -v), PM2 $(pm2 -v))"

# ── 2. Directory structure ───────────────────────────────────
mkdir -p "$APP_DIR"
mkdir -p /var/log/pm2

echo "✓ Directories created"

# ── 3. Nginx configuration ───────────────────────────────────
cp nginx/horselogo.de.conf "$NGINX_CONF"
ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/
nginx -t

echo "✓ Nginx configured"

# ── 4. SSL Certificate (Let's Encrypt) ──────────────────────
# Using INWX dns-01 challenge for wildcard cert
# Manual step — run certbot after pointing DNS to this VPS:
#   certbot certonly --dns-inwx -d horselogo.de -d *.horselogo.de
echo ""
echo "⚠  SSL: Run the following after DNS is pointed to this VPS:"
echo "   certbot certonly --dns-inwx -d horselogo.de -d *.horselogo.de"
echo "   sudo systemctl reload nginx"
echo ""

# ── 5. Copy .env ─────────────────────────────────────────────
if [ ! -f "$APP_DIR/backend/.env" ]; then
  cp "$APP_DIR/backend/.env.example" "$APP_DIR/backend/.env"
  echo "⚠  Edit $APP_DIR/backend/.env with your API keys!"
fi

# ── 6. Supabase Storage Bucket ───────────────────────────────
echo ""
echo "⚠  Supabase setup: Create a bucket named 'logos' in your Supabase dashboard:"
echo "   Dashboard → Storage → New Bucket → 'logos' → Public: false"
echo "   Then run supabase/schema.sql in the SQL editor."
echo ""

# ── 7. Start PM2 ─────────────────────────────────────────────
cd "$APP_DIR"
pm2 start pm2/ecosystem.config.cjs
pm2 save
pm2 startup

echo "✓ PM2 started and enabled on boot"
echo ""
echo "✅ Setup complete! Next steps:"
echo "   1. Edit $APP_DIR/backend/.env"
echo "   2. Run deploy.sh to build and deploy"
echo "   3. Set up SSL with certbot"
echo "   4. Run Supabase schema.sql"
