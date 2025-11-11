# Tokemoji Market Dashboard - Quick Start Guide

## What Was Built

A complete live market dashboard system for Tokemoji emotion tokens with:
- Real-time price tracking (3-second updates via Moralis)
- Automatic data aggregation (1-minute, hourly, daily candles)
- Market analytics (rankings, comparisons, dominance metrics)
- Config-driven token management (add new tokens without code changes)

## Current Status

✅ Database schema created in Supabase
✅ Backend services built (poller & aggregator)
✅ API endpoints ready (Supabase Edge Functions)
✅ Frontend integration complete
✅ Build verified and working

## Next Steps

### 1. Add Your Token Mint Addresses

Edit `tokens-config.json` and replace placeholder addresses with real Solana mint addresses from your Pump.fun tokens:

```json
{
  "symbol": "GREED",
  "mint_address": "YOUR_ACTUAL_MINT_ADDRESS_HERE"
}
```

### 2. Initialize Tokens in Database

```bash
npm run init-tokens
```

This will sync your configuration to the Supabase database.

### 3. Deploy Supabase Edge Functions

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref zhiebsuyfexsxtpekakn

# Deploy API endpoints
supabase functions deploy get-tokens
supabase functions deploy get-token-chart
supabase functions deploy get-market-summary
```

### 4. Start Backend Services

Open two terminal windows:

**Terminal 1 - Price Poller:**
```bash
npm run poller
```

**Terminal 2 - Data Aggregator:**
```bash
npm run aggregator
```

### 5. View the Dashboard

The dashboard is already built into your existing site at the "Tokemoji Market" section.

To run the dev server:
```bash
npm start
```

Visit `http://localhost:3000` and scroll to the Tokemoji Market section.

## What You'll See

- **Token Rankings**: Live list sorted by market cap, gainers, or losers
- **Market Dominance**: Which emotion token is leading
- **Emotion Gauges**: Visual comparisons (Greed vs Fear, Good vs Evil, Love vs Hate)
- **Top Performers**: Highest gainers and biggest losers
- **Live Updates**: Prices refresh automatically every 5 seconds

## Important Notes

### API Rate Limits

Moralis Free Tier = 2,400 requests/day. With 3-second polling on 2 tokens:
- ~40 requests/minute
- ~2,400 requests/hour
- **You'll hit the limit in 1 hour**

**Solution**: Upgrade to Moralis paid plan OR increase `POLLING_INTERVAL_MS` in `.env`

For example, 30-second polling:
```bash
POLLING_INTERVAL_MS=30000
```

This reduces to ~4 requests/minute = sustainable on free tier.

### Data Retention

- Raw 3-second ticks: 60 minutes
- 1-minute aggregates: 7 days
- Hourly aggregates: 90 days
- Daily aggregates: Forever

Cleanup runs automatically every 15 minutes.

### Adding More Tokens

1. Add to `tokens-config.json`
2. Run `npm run init-tokens`
3. Services automatically start tracking (no restart needed)
4. Frontend shows new token on next refresh

## Troubleshooting

**"No active tokens found"**
→ Run `npm run init-tokens` and make sure mint addresses are real (not placeholders)

**"Moralis API error 429"**
→ Rate limit hit. Increase `POLLING_INTERVAL_MS` in `.env` or upgrade Moralis plan

**Dashboard shows "Connection Error"**
→ Deploy Edge Functions with `supabase functions deploy`

**Prices not updating**
→ Check that poller service is running (`npm run poller`)

## File Structure

```
project/
├── backend/
│   ├── services/
│   │   ├── tokemoji-poller.js       # Fetches prices every 3s
│   │   └── tokemoji-aggregator.js   # Creates candles
│   ├── utils/
│   │   ├── moralis-client.js        # Moralis API wrapper
│   │   └── supabase-client.js       # Supabase connection
│   └── init-tokens.js               # Sync config to database
├── supabase/
│   └── functions/
│       ├── get-tokens/              # API: List all tokens
│       ├── get-token-chart/         # API: Chart data
│       └── get-market-summary/      # API: Market overview
├── src/
│   └── assets/
│       └── js/
│           └── tokemoji-live-data.js  # Frontend module
├── tokens-config.json               # Token configuration
├── .env                             # Environment variables
└── README-TOKEMOJI.md               # Full documentation
```

## Support

See `README-TOKEMOJI.md` for detailed documentation on architecture, deployment, monitoring, and troubleshooting.

## Ready to Go Live?

Once you have:
1. ✅ Real token mint addresses in config
2. ✅ Tokens initialized in database (`npm run init-tokens`)
3. ✅ Edge Functions deployed
4. ✅ Poller and aggregator running
5. ✅ Adjusted polling interval for API limits

Your live Tokemoji Market Dashboard will be operational!
