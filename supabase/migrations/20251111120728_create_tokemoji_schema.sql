/*
  # Tokemoji Market Dashboard - Database Schema

  ## Overview
  This migration creates the complete database schema for the Tokemoji Market Dashboard,
  enabling real-time price tracking, historical data aggregation, and market analytics
  for emotion-based tokens launched on Pump.fun.

  ## Tables Created

  ### 1. tokens
  Stores metadata for all Tokemoji tokens (GREED, FEAR, LOVE, GOOD, EVIL, etc.)
  - `id`: Unique identifier
  - `symbol`: Token ticker (e.g., "GREED", "FEAR")
  - `name`: Full token name
  - `emoji_type`: Emotion classification
  - `mint_address`: Solana token mint address (unique)
  - `decimals`: Token decimal places (default 9)
  - `total_supply`: Total token supply (default 1 billion)
  - `launch_date`: When token was launched
  - `is_active`: Whether to track this token
  - `display_color`: Hex color for UI
  - `display_order`: Sort order in UI
  - `icon_path`: Path to emoji animation

  ### 2. price_ticks
  Raw time-series price data collected every 3 seconds
  - Stores current price, liquidity, and volume
  - Retention: 60 minutes only (auto-deleted)
  - Indexed for fast queries by token and timestamp

  ### 3. price_aggregates_1m
  One-minute OHLC candles aggregated from price_ticks
  - Retention: 7 days
  - Used for 1-hour and 24-hour charts

  ### 4. price_aggregates_hourly
  Hourly OHLC candles aggregated from 1-minute data
  - Retention: 90 days
  - Used for 7-day and 30-day charts

  ### 5. price_aggregates_daily
  Daily OHLC candles for long-term analysis
  - Retention: Indefinite
  - Used for "all-time" charts

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Public read access for price data (no authentication required)
  - Service role only for writes

  ## Indexes
  - Optimized for time-series queries
  - Fast lookups by token_id and timestamp
  - Efficient sorting and filtering

  ## Notes
  - All prices stored in USD as numeric type for precision
  - Timestamps use 'timestamptz' for timezone awareness
  - Foreign keys ensure referential integrity
*/

-- Create tokens table
CREATE TABLE IF NOT EXISTS tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text UNIQUE NOT NULL,
  name text NOT NULL,
  emoji_type text NOT NULL,
  mint_address text UNIQUE NOT NULL,
  decimals integer DEFAULT 9 NOT NULL,
  total_supply bigint DEFAULT 1000000000 NOT NULL,
  launch_date timestamptz DEFAULT now(),
  is_active boolean DEFAULT true NOT NULL,
  display_color text,
  display_order integer,
  icon_path text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create price_ticks table for raw 3-second data
CREATE TABLE IF NOT EXISTS price_ticks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id uuid NOT NULL REFERENCES tokens(id) ON DELETE CASCADE,
  timestamp timestamptz DEFAULT now() NOT NULL,
  price_usd numeric(20, 10) NOT NULL,
  liquidity_usd numeric(20, 2),
  volume_24h numeric(20, 2),
  source text DEFAULT 'moralis' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create price_aggregates_1m table
CREATE TABLE IF NOT EXISTS price_aggregates_1m (
  token_id uuid NOT NULL REFERENCES tokens(id) ON DELETE CASCADE,
  bucket_start timestamptz NOT NULL,
  open numeric(20, 10) NOT NULL,
  high numeric(20, 10) NOT NULL,
  low numeric(20, 10) NOT NULL,
  close numeric(20, 10) NOT NULL,
  volume numeric(20, 2),
  tick_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY (token_id, bucket_start)
);

-- Create price_aggregates_hourly table
CREATE TABLE IF NOT EXISTS price_aggregates_hourly (
  token_id uuid NOT NULL REFERENCES tokens(id) ON DELETE CASCADE,
  bucket_start timestamptz NOT NULL,
  open numeric(20, 10) NOT NULL,
  high numeric(20, 10) NOT NULL,
  low numeric(20, 10) NOT NULL,
  close numeric(20, 10) NOT NULL,
  volume numeric(20, 2),
  tick_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY (token_id, bucket_start)
);

-- Create price_aggregates_daily table
CREATE TABLE IF NOT EXISTS price_aggregates_daily (
  token_id uuid NOT NULL REFERENCES tokens(id) ON DELETE CASCADE,
  bucket_start timestamptz NOT NULL,
  open numeric(20, 10) NOT NULL,
  high numeric(20, 10) NOT NULL,
  low numeric(20, 10) NOT NULL,
  close numeric(20, 10) NOT NULL,
  volume numeric(20, 2),
  tick_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY (token_id, bucket_start)
);

-- Create indexes for fast time-series queries
CREATE INDEX IF NOT EXISTS idx_price_ticks_token_timestamp 
  ON price_ticks(token_id, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_price_ticks_timestamp 
  ON price_ticks(timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_price_aggregates_1m_bucket 
  ON price_aggregates_1m(bucket_start DESC);

CREATE INDEX IF NOT EXISTS idx_price_aggregates_hourly_bucket 
  ON price_aggregates_hourly(bucket_start DESC);

CREATE INDEX IF NOT EXISTS idx_price_aggregates_daily_bucket 
  ON price_aggregates_daily(bucket_start DESC);

CREATE INDEX IF NOT EXISTS idx_tokens_active 
  ON tokens(is_active, display_order);

-- Enable Row Level Security
ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_ticks ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_aggregates_1m ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_aggregates_hourly ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_aggregates_daily ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Public read access for tokens"
  ON tokens FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public read access for price_ticks"
  ON price_ticks FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public read access for price_aggregates_1m"
  ON price_aggregates_1m FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public read access for price_aggregates_hourly"
  ON price_aggregates_hourly FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public read access for price_aggregates_daily"
  ON price_aggregates_daily FOR SELECT
  TO public
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for tokens table
DROP TRIGGER IF EXISTS update_tokens_updated_at ON tokens;
CREATE TRIGGER update_tokens_updated_at
  BEFORE UPDATE ON tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to clean up old price_ticks (older than 60 minutes)
CREATE OR REPLACE FUNCTION cleanup_old_price_ticks()
RETURNS void AS $$
BEGIN
  DELETE FROM price_ticks
  WHERE timestamp < (now() - interval '60 minutes');
END;
$$ LANGUAGE plpgsql;

-- Create function to clean up old 1m aggregates (older than 7 days)
CREATE OR REPLACE FUNCTION cleanup_old_1m_aggregates()
RETURNS void AS $$
BEGIN
  DELETE FROM price_aggregates_1m
  WHERE bucket_start < (now() - interval '7 days');
END;
$$ LANGUAGE plpgsql;

-- Create function to clean up old hourly aggregates (older than 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_hourly_aggregates()
RETURNS void AS $$
BEGIN
  DELETE FROM price_aggregates_hourly
  WHERE bucket_start < (now() - interval '90 days');
END;
$$ LANGUAGE plpgsql;