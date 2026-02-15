/*
  # Replace dead pump.fun token mint addresses

  1. Modified Tables
    - `tokens`
      - Updated `mint_address` for GREED to DXqVrNxf8xTwXjTs6PvQrGfaMP6PRXYvtsX21wdPpump
      - Updated `mint_address` for FEAR to 4J9hAjPcQKv8fHPYbXzBwfifXSVfftueVfqs5o53pump
      - Updated `mint_address` for HATE to Bymdy3wnEeLjnzVu14Fvx8p2mtJ7iEN8G6Gm1zkwpump
      - Updated `mint_address` for EVIL to 8wenEPaJw5TW4JRSYHwnmAaYc9Gr9Leh8d7pV4sQpump
      - Updated `mint_address` for HAPPY to 6TQkjP9e4XGYwb3dzgMf7ojuBG99YSxKSKNqNGYVpump
      - Updated `mint_address` for LOL to NV2RYH954cTJ3ckFUpvfqaQXU4ARqqDH3562nFSpump
      - Updated `mint_address` for OMG to DD4jtnKdyPakShSx1JRwHu7Sk1UouM6Yn9vwtQJGpump
      - Updated `mint_address` for MAD to 6s9Q8odvxfTciGqNGDSof6gc3sX4ravwvJxKzw8Gpump

  2. Data Cleanup
    - Deletes stale price_ticks for the 8 replaced tokens
    - Deletes stale price_aggregates_1m for the 8 replaced tokens
    - Deletes stale price_aggregates_hourly for the 8 replaced tokens
    - Deletes stale price_aggregates_daily for the 8 replaced tokens

  3. Notes
    - LOVE, GOOD, SAD, and LIKE tokens are unchanged (still active)
    - Old pump.fun tokens were dead and no longer trading
    - New addresses point to live Solana pump.fun tokens
*/

-- Delete stale price data for the 8 tokens being replaced
DELETE FROM price_ticks WHERE token_id IN (
  SELECT id FROM tokens WHERE symbol IN ('GREED', 'FEAR', 'HATE', 'EVIL', 'HAPPY', 'LOL', 'OMG', 'MAD')
);

DELETE FROM price_aggregates_1m WHERE token_id IN (
  SELECT id FROM tokens WHERE symbol IN ('GREED', 'FEAR', 'HATE', 'EVIL', 'HAPPY', 'LOL', 'OMG', 'MAD')
);

DELETE FROM price_aggregates_hourly WHERE token_id IN (
  SELECT id FROM tokens WHERE symbol IN ('GREED', 'FEAR', 'HATE', 'EVIL', 'HAPPY', 'LOL', 'OMG', 'MAD')
);

DELETE FROM price_aggregates_daily WHERE token_id IN (
  SELECT id FROM tokens WHERE symbol IN ('GREED', 'FEAR', 'HATE', 'EVIL', 'HAPPY', 'LOL', 'OMG', 'MAD')
);

-- Update mint addresses
UPDATE tokens SET mint_address = 'DXqVrNxf8xTwXjTs6PvQrGfaMP6PRXYvtsX21wdPpump' WHERE symbol = 'GREED';
UPDATE tokens SET mint_address = '4J9hAjPcQKv8fHPYbXzBwfifXSVfftueVfqs5o53pump' WHERE symbol = 'FEAR';
UPDATE tokens SET mint_address = 'Bymdy3wnEeLjnzVu14Fvx8p2mtJ7iEN8G6Gm1zkwpump' WHERE symbol = 'HATE';
UPDATE tokens SET mint_address = '8wenEPaJw5TW4JRSYHwnmAaYc9Gr9Leh8d7pV4sQpump' WHERE symbol = 'EVIL';
UPDATE tokens SET mint_address = '6TQkjP9e4XGYwb3dzgMf7ojuBG99YSxKSKNqNGYVpump' WHERE symbol = 'HAPPY';
UPDATE tokens SET mint_address = 'NV2RYH954cTJ3ckFUpvfqaQXU4ARqqDH3562nFSpump' WHERE symbol = 'LOL';
UPDATE tokens SET mint_address = 'DD4jtnKdyPakShSx1JRwHu7Sk1UouM6Yn9vwtQJGpump' WHERE symbol = 'OMG';
UPDATE tokens SET mint_address = '6s9Q8odvxfTciGqNGDSof6gc3sX4ravwvJxKzw8Gpump' WHERE symbol = 'MAD';
