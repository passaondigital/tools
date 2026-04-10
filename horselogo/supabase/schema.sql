-- ============================================================
-- HorseLogo.de — Supabase Database Schema
-- Run this in your Supabase SQL editor to set up the schema.
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Logos ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS logos (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  business_name    TEXT NOT NULL,
  tagline          TEXT,
  industry         TEXT,
  motif            TEXT NOT NULL,
  style            TEXT NOT NULL,
  palette          TEXT NOT NULL,
  color_primary    TEXT,
  color_secondary  TEXT,
  selected_variant INT,
  preview_urls     JSONB,        -- Array of watermarked preview image URLs
  raw_urls         JSONB,        -- Temporary OpenAI URLs (expire ~1h)
  final_urls       JSONB,        -- Final processed URLs (null until paid)
  zip_url          TEXT,         -- Signed ZIP download URL (null until paid)
  status           TEXT NOT NULL DEFAULT 'preview',
                                 -- preview | paid | downloaded
  stripe_session_id  TEXT,
  stripe_payment_id  TEXT,
  customer_email     TEXT,
  ip_address         TEXT
);

-- Index for Stripe session lookups
CREATE INDEX IF NOT EXISTS logos_stripe_session_idx ON logos(stripe_session_id);
CREATE INDEX IF NOT EXISTS logos_status_idx ON logos(status);

-- ── Orders ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS orders (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  logo_id            UUID REFERENCES logos(id) ON DELETE SET NULL,
  stripe_session_id  TEXT UNIQUE,
  stripe_payment_id  TEXT,
  amount_cents       INT NOT NULL DEFAULT 999,
  currency           TEXT NOT NULL DEFAULT 'eur',
  status             TEXT NOT NULL DEFAULT 'pending',
                                    -- pending | paid | refunded
  customer_email     TEXT,
  zip_url            TEXT,
  download_count     INT NOT NULL DEFAULT 0,
  max_downloads      INT NOT NULL DEFAULT 10
);

-- Indexes
CREATE INDEX IF NOT EXISTS orders_stripe_session_idx ON orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS orders_logo_id_idx ON orders(logo_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);

-- ── Row Level Security ─────────────────────────────────────
-- Service role (backend) bypasses RLS.
-- Public access is denied — all reads/writes go through the backend.

ALTER TABLE logos  ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- No public policies — only the service role key can access these tables.

-- ── Supabase Storage Buckets ────────────────────────────────
-- Run these in the Supabase dashboard under Storage → New Bucket,
-- or via the REST API. The 'logos' bucket stores all logo files.

-- Bucket: logos
--   - Private (not publicly accessible by default)
--   - The backend uses the service key to upload/read
--   - Preview images are stored as public files
--   - ZIP downloads use signed URLs (7-day expiry)

-- ── Useful Queries ─────────────────────────────────────────

-- Revenue overview
-- SELECT
--   COUNT(*) AS total_orders,
--   SUM(amount_cents) / 100.0 AS total_revenue_eur,
--   DATE_TRUNC('day', created_at) AS day
-- FROM orders
-- WHERE status = 'paid'
-- GROUP BY day
-- ORDER BY day DESC;

-- Recent logos
-- SELECT id, business_name, industry, status, created_at
-- FROM logos
-- ORDER BY created_at DESC
-- LIMIT 20;
