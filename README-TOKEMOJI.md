# Tokemoji Market Dashboard

Real-time price tracking and market analytics dashboard for Tokemoji emotion tokens launched on Pump.fun.

## Overview

This system provides:
- Live price tracking (3-second updates via Moralis API)
- Historical data with 1-minute, hourly, and daily aggregates
- Market rankings (Top Gainers, Losers, Market Cap leaders)
- Emotion comparisons (Greed vs Fear, Good vs Evil, Love vs Hate)
- Config-driven token management (add new tokens without code changes)

## Architecture

### Database (Supabase)
- `tokens`: Token metadata and configuration
- `price_ticks`: Raw 3-second price data (60-minute retention)
- `price_aggregates_1m`: 1-minute candles (7-day retention)
- `price_aggregates_hourly`: Hourly candles (90-day retention)
- `price_aggregates_daily`: Daily candles (indefinite retention)

### Backend Services
- `tokemoji-poller.js`: Fetches prices from Moralis every 3 seconds
- `tokemoji-aggregator.js`: Rolls up raw data into time-based aggregates
- `init-tokens.js`: Syncs token configuration to database

### API Endpoints (Supabase Edge Functions)
- `/functions/v1/get-tokens`: Get all tokens with current prices and 24h stats
- `/functions/v1/get-token-chart?token_id=X&range=24h`: Get chart data for specific time range
- `/functions/v1/get-market-summary`: Get market overview, dominance, comparisons

### Frontend
- `tokemoji-live-data.js`: Real-time dashboard updates every 5 seconds
- Automatic sorting (Market Cap, Gainers, Losers)
- Live gauge widgets for emotion comparisons

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

The `.env` file is already configured with:
- Supabase URL and keys
- Moralis API key
- Polling intervals

For production, add your Supabase service role key:
```bash
SUPABASE_SERVICE_KEY=your-service-role-key-here
```

Get it from: Supabase Dashboard > Settings > API > service_role key

### 3. Database Setup

The database schema is already created via migration. To verify:

```bash
# Check Supabase dashboard: Database > Tables
# You should see: tokens, price_ticks, price_aggregates_1m, price_aggregates_hourly, price_aggregates_daily
```

### 4. Configure Your Tokens

Edit `tokens-config.json` and replace placeholder mint addresses with real ones:

```json
{
  "tokens": [
    {
      "symbol": "GREED",
      "name": "Greed Token",
      "emoji_type": "GREED",
      "mint_address": "YOUR_ACTUAL_SOLANA_MINT_ADDRESS",
      "icon_path": "assets/img/emojis/greed.webm",
      "display_color": "#ffc107",
      "display_order": 1
    }
  ]
}
```

### 5. Initialize Tokens in Database

```bash
npm run init-tokens
```

This will:
- Read `tokens-config.json`
- Create/update tokens in Supabase
- Skip any tokens with placeholder addresses
- Display current database state

### 6. Deploy Supabase Edge Functions

Deploy the API endpoints:

```bash
# Install Supabase CLI if not already installed
# npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref zhiebsuyfexsxtpekakn

# Deploy functions
supabase functions deploy get-tokens
supabase functions deploy get-token-chart
supabase functions deploy get-market-summary
```

### 7. Start Backend Services

Open 2 terminal windows:

**Terminal 1 - Price Poller:**
```bash
npm run poller
```

This fetches live prices from Moralis every 3 seconds.

**Terminal 2 - Aggregator:**
```bash
npm run aggregator
```

This creates 1-minute, hourly, and daily candles from raw price data.

### 8. Build and Start Frontend

```bash
npm run build
npm start
```

The site will be available at `http://localhost:3000`

Navigate to the "Tokemoji Market" section to see live data.

## Adding New Tokens

To add a new Tokemoji token:

1. Get the Solana mint address from Pump.fun
2. Add emoji animation to `src/assets/img/emojis/` (WebM format)
3. Add token to `tokens-config.json`:
   ```json
   {
     "symbol": "CHILL",
     "name": "Chill Token",
     "emoji_type": "CHILL",
     "mint_address": "ABC123...",
     "icon_path": "assets/img/emojis/chill.webm",
     "display_color": "#4ecdc4",
     "display_order": 13
   }
   ```
4. Run `npm run init-tokens` to sync to database
5. The poller will automatically start tracking the new token within 3 seconds
6. Frontend will show it on next refresh (5 seconds)

No code changes or service restarts needed!

## Monitoring & Maintenance

### Check Service Health

**Poller Status:**
```bash
# Watch poller output for:
# - Successful price fetches
# - Number of tokens being tracked
# - API response times
```

**Aggregator Status:**
```bash
# Watch aggregator output for:
# - Successful aggregate creation
# - Data cleanup operations
# - Any error messages
```

### Database Cleanup

Cleanup runs automatically every 15 minutes:
- Deletes `price_ticks` older than 60 minutes
- Deletes `price_aggregates_1m` older than 7 days
- Deletes `price_aggregates_hourly` older than 90 days

### Common Issues

**"No active tokens found"**
- Run `npm run init-tokens` to populate database
- Check that tokens in `tokens-config.json` have real mint addresses

**"Moralis API error 429"**
- Rate limit hit. Poller will retry automatically
- Consider increasing `POLLING_INTERVAL_MS` in `.env`

**"Connection Error" in dashboard**
- Check that Edge Functions are deployed
- Verify Supabase URL in `.env` is correct
- Check browser console for CORS errors

**Stale prices**
- Ensure poller service is running
- Check Moralis API key is valid
- Verify token mint addresses are correct

## Production Deployment

For production:

1. **Backend Services**: Deploy poller and aggregator to a VPS or cloud service
   - Use PM2 for process management: `pm2 start npm --name "tokemoji-poller" -- run poller`
   - Set up monitoring and auto-restart

2. **Environment Variables**: Use production values
   - Set `SUPABASE_SERVICE_KEY` for write access
   - Consider using a separate Supabase project for production

3. **Scaling**: If adding many tokens (20+):
   - Increase Moralis API rate limits
   - Consider sharding tokens across multiple poller instances
   - Add Redis for API response caching

4. **Monitoring**: Set up alerts for:
   - Poller failures (5+ consecutive errors)
   - Stale data (no updates for 30+ seconds)
   - API rate limit exhaustion

## API Rate Limits

**Moralis Free Tier:**
- 2,400 requests/day
- ~1.66 requests/minute
- With 3-second polling and 2 tokens: 40 requests/minute
- **Action needed**: Upgrade to paid plan or reduce polling frequency

**Supabase Free Tier:**
- 500MB database storage
- 2GB bandwidth
- Should be sufficient for 10-20 tokens

## Data Retention & Storage

**Storage estimates (per token):**
- Raw ticks (60 min): ~1,200 rows × 50 bytes = ~60KB
- 1-minute aggregates (7 days): ~10,080 rows × 100 bytes = ~1MB
- Hourly aggregates (90 days): ~2,160 rows × 100 bytes = ~216KB
- Daily aggregates (forever): ~365 rows/year × 100 bytes = ~36KB/year

**Total for 10 tokens:** ~15MB + 3.6KB/year (sustainable long-term)

## Support

For issues or questions:
- Check browser console for JavaScript errors
- Review poller/aggregator logs for backend errors
- Verify all environment variables are set correctly
- Ensure Supabase Edge Functions are deployed

## Architecture Diagram

```
┌─────────────────┐
│  Moralis API    │
│  (Price Data)   │
└────────┬────────┘
         │ 3s interval
         ↓
┌─────────────────┐      ┌──────────────────┐
│ tokemoji-poller │ ───→ │ Supabase DB      │
│  (Node.js)      │      │ - price_ticks    │
└─────────────────┘      │ - tokens         │
                         └──────────┬───────┘
                                    │
                         ┌──────────↓───────┐
                         │ tokemoji-        │
                         │ aggregator       │
                         │ (Node.js)        │
                         └──────────┬───────┘
                                    │
                         ┌──────────↓───────┐
                         │ Supabase DB      │
                         │ - aggregates_1m  │
                         │ - aggregates_h   │
                         │ - aggregates_d   │
                         └──────────┬───────┘
                                    │
                         ┌──────────↓───────┐
                         │ Edge Functions   │
                         │ (API Endpoints)  │
                         └──────────┬───────┘
                                    │ 5s refresh
                         ┌──────────↓───────┐
                         │ Frontend         │
                         │ (tokemoji-live-  │
                         │  data.js)        │
                         └──────────────────┘
```

## License

Part of the Tokemoji project.
