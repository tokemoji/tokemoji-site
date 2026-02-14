/*
  # Update LOVE, GOOD, SAD token mint addresses

  1. Modified Tables
    - `tokens`
      - Updated `mint_address` for LOVE token to ESto2cvLsywSvZeyqaQSu5rTkk6PNudPRDjDqcPo47Gc
      - Updated `mint_address` for GOOD token to EzRooYJ3yDsS5paSQdb8eW66mMdK3u6yFH8Bvoi4pump
      - Updated `mint_address` for SAD token to BVrR1uUneY7UWJMggsHA1EUX8bftcMj3XEiGBt5Kpump

  2. Notes
    - These three tokens previously had placeholder/test addresses
    - New addresses point to actual Solana tokens for live price tracking
*/

UPDATE tokens SET mint_address = 'ESto2cvLsywSvZeyqaQSu5rTkk6PNudPRDjDqcPo47Gc' WHERE symbol = 'LOVE';
UPDATE tokens SET mint_address = 'EzRooYJ3yDsS5paSQdb8eW66mMdK3u6yFH8Bvoi4pump' WHERE symbol = 'GOOD';
UPDATE tokens SET mint_address = 'BVrR1uUneY7UWJMggsHA1EUX8bftcMj3XEiGBt5Kpump' WHERE symbol = 'SAD';