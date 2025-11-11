/*
  # Add Service Role Insert Policy for Tokens Table
  
  ## Overview
  This migration adds an RLS policy to allow the service role to insert and update tokens
  in the tokens table. This is needed for the init-tokens.js script to work properly.
  
  ## Security
  - Allows service role to insert and update tokens
  - Public still has read-only access
  - All write operations are restricted to service role
*/

-- Create policy for service role to insert tokens
CREATE POLICY "Service role can insert tokens"
  ON tokens FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Create policy for service role to update tokens
CREATE POLICY "Service role can update tokens"
  ON tokens FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create policy for service role to delete tokens (if needed)
CREATE POLICY "Service role can delete tokens"
  ON tokens FOR DELETE
  TO service_role
  USING (true);