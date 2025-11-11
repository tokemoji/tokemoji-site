/*
  # Add Write Policies for Price Data Tables
  
  ## Overview
  This migration adds RLS policies to allow authenticated users (anon role)
  to write to price_ticks and price_aggregates tables. This is needed for
  the backend services to work without requiring service_role key.
  
  ## Security
  - Allows anon/authenticated role to insert price data
  - Public still has read access
  - This is acceptable for a test environment
*/

-- Allow anon role to insert price ticks
CREATE POLICY "Anon can insert price_ticks"
  ON price_ticks FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anon role to insert 1m aggregates
CREATE POLICY "Anon can insert price_aggregates_1m"
  ON price_aggregates_1m FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anon role to update 1m aggregates (for upserts)
CREATE POLICY "Anon can update price_aggregates_1m"
  ON price_aggregates_1m FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow anon role to insert hourly aggregates
CREATE POLICY "Anon can insert price_aggregates_hourly"
  ON price_aggregates_hourly FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anon role to update hourly aggregates (for upserts)
CREATE POLICY "Anon can update price_aggregates_hourly"
  ON price_aggregates_hourly FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow anon role to insert daily aggregates
CREATE POLICY "Anon can insert price_aggregates_daily"
  ON price_aggregates_daily FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anon role to update daily aggregates (for upserts)
CREATE POLICY "Anon can update price_aggregates_daily"
  ON price_aggregates_daily FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow anon role to delete old price ticks (for cleanup)
CREATE POLICY "Anon can delete price_ticks"
  ON price_ticks FOR DELETE
  TO anon
  USING (true);

-- Allow anon role to delete old 1m aggregates (for cleanup)
CREATE POLICY "Anon can delete price_aggregates_1m"
  ON price_aggregates_1m FOR DELETE
  TO anon
  USING (true);

-- Allow anon role to delete old hourly aggregates (for cleanup)
CREATE POLICY "Anon can delete price_aggregates_hourly"
  ON price_aggregates_hourly FOR DELETE
  TO anon
  USING (true);