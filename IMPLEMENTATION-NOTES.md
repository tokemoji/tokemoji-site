# Tokemoji Live Data Implementation Notes

## Overview
This document describes the implementation of live data integration for the Tokemoji dashboard, replacing mockup/hardcoded values with real-time API data.

## What Was Implemented

### 1. Enhanced Frontend Live Data Module (`src/assets/js/tokemoji-live-data.js`)

**Improvements Made:**
- Enhanced `updateDominanceWidget()` to properly update video source elements
- Improved `updateTopGainersLosers()` to populate all three carousel GIFs (left, center, right) for both gainers and losers
- Updated display logic to use `emoji_type` for better visual consistency
- All widgets now properly load video sources and refresh on data updates

**Key Features:**
- Fetches data from Supabase Edge Functions every 5 seconds
- Automatically updates all dashboard widgets with live data
- Handles sorting (Market Cap, Gainers, Losers)
- Graceful error handling with retry logic
- Smooth data refresh without visual glitches

### 2. Updated HTML Templates (`src/pages/index.html`)

**Changes Made:**
- Replaced all hardcoded mockup values with loading placeholders
- Widgets now display "Loading..." or "--%" until API data arrives
- All initial values set to 0% or empty states

**Affected Widgets:**
- **Dominance Card**: Shows dominant token with emoji, name, percentage, and progress bar
- **Greed vs Fear Gauge**: Displays real-time comparison between GREED and FEAR tokens
- **Good vs Evil Gauge**: Shows market cap comparison between GOOD and EVIL tokens
- **Love vs Hate Gauge**: Displays LOVE vs MAD/HATE token comparison
- **Top Gainers Widget**: Shows top 3 gaining tokens with animated emojis
- **Top Losers Widget**: Shows top 3 losing tokens with animated emojis
- **Token Rankings List**: Sortable list of all tokens with prices and 24h changes

### 3. Token Configuration (`tokens-config.json`)

**Current State:**
- Contains 12 emotion tokens with test mint addresses
- Each token has proper emoji type, display color, and icon path
- `test_token_name` field references the actual tokens being tracked (e.g., VERSE, BAYC, MOODENG)
- Ready for production mint addresses when Tokemoji tokens launch

**Important Note:**
The `test_token_name` field is used temporarily to track real tokens for testing. When you deploy with production Tokemoji mint addresses, remove this field from the config to clean up the display names.

## Architecture & Data Flow

```
Moralis API (Pump.fun prices)
        ↓
Backend Poller (tokemoji-poller.js)
        ↓
Supabase Database (price_ticks, aggregates)
        ↓
Backend Aggregator (tokemoji-aggregator.js)
        ↓
Supabase Edge Functions (get-tokens, get-market-summary)
        ↓
Frontend JS (tokemoji-live-data.js)
        ↓
Dashboard Widgets (HTML)
```

## Backend Services

### 1. Price Poller (`backend/services/tokemoji-poller.js`)
- Fetches real-time prices from Moralis API every 30 seconds
- Only writes to database when price changes exceed threshold (0.1%)
- Tracks 12 emotion tokens configured in `tokens-config.json`

### 2. Data Aggregator (`backend/services/tokemoji-aggregator.js`)
- Creates 1-minute candles from raw price ticks
- Generates hourly candles from 1-minute data
- Builds daily candles from hourly data
- Automatic cleanup of old data to maintain performance

### 3. Edge Functions
- **get-tokens**: Returns all tokens with current prices, market caps, and 24h changes
- **get-market-summary**: Calculates market dominance, top gainers/losers, and emotion comparisons

## How to Use Production Mint Addresses

When your Tokemoji tokens launch on Pump.fun:

1. Update `tokens-config.json` with production mint addresses
2. Remove `test_token_name` fields from all token objects
3. Run `npm run init-tokens` to update the database
4. Restart the poller: `npm run poller`
5. Restart the aggregator: `npm run aggregator`

Example updated token entry:
```json
{
  "symbol": "GREED",
  "name": "Greed Token",
  "emoji_type": "GREED",
  "mint_address": "YOUR_PRODUCTION_MINT_ADDRESS_HERE",
  "icon_path": "assets/img/emojis/greed.webm",
  "display_color": "#ffc107",
  "display_order": 1
}
```

## Testing

To verify the implementation works:

1. **Check Widget Population:**
   - Open the site in a browser
   - All widgets should change from "Loading..." to real data within 5 seconds
   - Emoji animations should display correctly

2. **Test Sorting:**
   - Click "M CAP", "LOSERS", "GAINERS" buttons
   - Token list should reorder immediately

3. **Verify Auto-Refresh:**
   - Watch console logs for "[Tokemoji] Data updated successfully"
   - Widgets should update every 5 seconds without page flicker

4. **Check All Widgets:**
   - Dominance card shows dominant token
   - All 3 gauges display proper comparisons
   - Top gainers carousel shows 3 tokens
   - Top losers carousel shows 3 tokens
   - Token list displays all 12 tokens with prices

## Known Considerations

1. **API Rate Limits:** Moralis API has rate limits - adjust `POLLING_INTERVAL_MS` in `.env` if needed
2. **Data Delay:** There's a ~5-30 second delay from Moralis data to dashboard display
3. **Price Accuracy:** Prices are from Pump.fun DEX and may differ from other sources
4. **Empty States:** If no price data exists, widgets show N/A or 0 values

## Next Steps

1. Deploy with production Tokemoji mint addresses
2. Monitor backend services for errors
3. Adjust refresh intervals based on user experience
4. Add historical price charts using the aggregate data
5. Implement WebSocket for real-time updates (optional)

## Support Commands

```bash
# Build frontend
npm run build

# Initialize tokens in database
npm run init-tokens

# Start price poller (background)
npm run poller

# Start data aggregator (background)
npm run aggregator

# Start development server
npm start
```

## Files Modified

- `src/assets/js/tokemoji-live-data.js` - Enhanced widget update logic
- `src/pages/index.html` - Replaced mockup values with loading placeholders
- `tokens-config.json` - Added comment for production deployment
- `dist/*` - Rebuilt with all changes

---

**Last Updated:** 2025-11-11
**Implementation Status:** ✅ Complete and tested
