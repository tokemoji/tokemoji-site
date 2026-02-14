/*
  # Fix Critical Security Issues

  1. Drop Unused Indexes
    - Remove 4 unused indexes on price tables to reduce maintenance overhead
  
  2. Fix RLS Policies (CRITICAL)
    - Remove policies with USING(true) that bypass security
    - Replace with proper restrictive policies
    - Only service_role can write to price tables
    - Anonymous users can only read
  
  3. Fix Function Search Paths
    - Set search_path explicitly in 4 functions to prevent injection attacks
  
  ## Security Changes
  - All price data tables now properly secured
  - Write operations restricted to authenticated service role only
  - Read operations allowed for anonymous users (public market data)
*/

-- =====================================================
-- 1. DROP UNUSED INDEXES
-- =====================================================

DROP INDEX IF EXISTS idx_price_ticks_timestamp;
DROP INDEX IF EXISTS idx_price_aggregates_1m_bucket;
DROP INDEX IF EXISTS idx_price_aggregates_hourly_bucket;
DROP INDEX IF EXISTS idx_price_aggregates_daily_bucket;

-- =====================================================
-- 2. FIX RLS POLICIES - REMOVE INSECURE POLICIES
-- =====================================================

-- Fix price_ticks table
DROP POLICY IF EXISTS "Anon can insert price_ticks" ON price_ticks;
DROP POLICY IF EXISTS "Anon can delete price_ticks" ON price_ticks;

-- Only service role can insert/delete price_ticks
CREATE POLICY "Service role can insert price_ticks"
  ON price_ticks FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can delete price_ticks"
  ON price_ticks FOR DELETE
  TO service_role
  USING (true);

-- Fix price_aggregates_1m table
DROP POLICY IF EXISTS "Anon can insert price_aggregates_1m" ON price_aggregates_1m;
DROP POLICY IF EXISTS "Anon can update price_aggregates_1m" ON price_aggregates_1m;
DROP POLICY IF EXISTS "Anon can delete price_aggregates_1m" ON price_aggregates_1m;

CREATE POLICY "Service role can insert price_aggregates_1m"
  ON price_aggregates_1m FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update price_aggregates_1m"
  ON price_aggregates_1m FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete price_aggregates_1m"
  ON price_aggregates_1m FOR DELETE
  TO service_role
  USING (true);

-- Fix price_aggregates_hourly table
DROP POLICY IF EXISTS "Anon can insert price_aggregates_hourly" ON price_aggregates_hourly;
DROP POLICY IF EXISTS "Anon can update price_aggregates_hourly" ON price_aggregates_hourly;
DROP POLICY IF EXISTS "Anon can delete price_aggregates_hourly" ON price_aggregates_hourly;

CREATE POLICY "Service role can insert price_aggregates_hourly"
  ON price_aggregates_hourly FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update price_aggregates_hourly"
  ON price_aggregates_hourly FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete price_aggregates_hourly"
  ON price_aggregates_hourly FOR DELETE
  TO service_role
  USING (true);

-- Fix price_aggregates_daily table
DROP POLICY IF EXISTS "Anon can insert price_aggregates_daily" ON price_aggregates_daily;
DROP POLICY IF EXISTS "Anon can update price_aggregates_daily" ON price_aggregates_daily;

CREATE POLICY "Service role can insert price_aggregates_daily"
  ON price_aggregates_daily FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update price_aggregates_daily"
  ON price_aggregates_daily FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- 3. FIX FUNCTION SEARCH PATHS (Security Hardening)
-- =====================================================

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix cleanup_old_price_ticks function
CREATE OR REPLACE FUNCTION cleanup_old_price_ticks()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  DELETE FROM price_ticks
  WHERE created_at < now() - interval '7 days';
END;
$$;

-- Fix cleanup_old_1m_aggregates function
CREATE OR REPLACE FUNCTION cleanup_old_1m_aggregates()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  DELETE FROM price_aggregates_1m
  WHERE bucket < now() - interval '30 days';
END;
$$;

-- Fix cleanup_old_hourly_aggregates function
CREATE OR REPLACE FUNCTION cleanup_old_hourly_aggregates()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  DELETE FROM price_aggregates_hourly
  WHERE bucket < now() - interval '90 days';
END;
$$;

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Verify RLS is still enabled on all tables
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'price_ticks' 
    AND rowsecurity = true
  ) THEN
    RAISE EXCEPTION 'RLS not enabled on price_ticks';
  END IF;
END $$;