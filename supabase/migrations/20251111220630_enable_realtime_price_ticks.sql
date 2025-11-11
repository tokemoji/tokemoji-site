/*
  # Enable Realtime for Price Ticks

  1. Changes
    - Enable Realtime replication for price_ticks table
    - This allows frontend to subscribe to INSERT events on price_ticks

  2. Security
    - Existing RLS policies still apply
    - Only authenticated users can receive realtime updates
*/

-- Enable Realtime for price_ticks table
ALTER PUBLICATION supabase_realtime ADD TABLE price_ticks;
