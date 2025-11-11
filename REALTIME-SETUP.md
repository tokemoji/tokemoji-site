# Real-Time Price Updates Setup

## How It Works

The Tokemoji site now displays live price data that updates automatically:

1. **Backend Poller** - Runs every 30 seconds to fetch latest prices from Moralis API
2. **Database** - Stores price ticks in `price_ticks` table
3. **Frontend** - Auto-refreshes token list when new prices arrive

## Starting the Price Poller

The poller needs to run continuously to fetch and update prices:

```bash
# Start the poller (runs every 30 seconds)
npm run poller
```

The poller will:
- Fetch prices for all 12 emotion tokens every 30 seconds
- Write new price ticks to the database
- Log price changes to console
- Keep running until you stop it (Ctrl+C)

## Frontend Behavior

The frontend has two modes:

### With Supabase Realtime (Recommended)
If `supabase.js` is loaded, the frontend subscribes to database changes and updates instantly when new prices arrive.

### Without Realtime (Fallback)
If Supabase client isn't available, the frontend polls the API every 30 seconds.

## Price Change Flash Effects

When prices update, rows flash:
- **Green flash** - Price went up
- **Red flash** - Price went down
- Flash lasts 1 second

## Database Tables

- `tokens` - List of all emotion tokens
- `price_ticks` - Raw price data (updated every 30s by poller)
- `price_aggregates_1m` - 1-minute candlesticks (updated by aggregator)
- `price_aggregates_hourly` - Hourly candlesticks (updated by aggregator)
- `price_aggregates_daily` - Daily candlesticks (updated by aggregator)

## Running the Aggregator (Optional)

The aggregator creates time-series data for charts:

```bash
# Start the aggregator (processes price ticks into candles)
npm run aggregator
```

## Monitoring

Watch the poller console output to see:
- Which tokens are being updated
- Price changes in real-time
- Any errors or issues

Example output:
```
[Poller] Poll #1 - Fetching prices for 12 tokens...
  ✓ LOVE: $0.0042000000 (+12.5%)
  ✓ GREED: $0.0067000000 (+31.2%)
  ✓ FEAR: $0.0023000000 (-12.7%)
[Poller] ✓ Wrote 3 price tick(s) to database
[Poller] Poll completed in 245ms
```
