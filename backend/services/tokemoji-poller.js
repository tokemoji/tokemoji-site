import moralisClient from '../utils/moralis-client.js';
import supabase from '../utils/supabase-client.js';

const POLLING_INTERVAL = parseInt(process.env.POLLING_INTERVAL_MS || '3000');
const PRICE_CHANGE_THRESHOLD = parseFloat(process.env.PRICE_CHANGE_THRESHOLD || '0.001');

class TokemojiPoller {
  constructor() {
    this.isRunning = false;
    this.lastPrices = new Map();
    this.tokens = [];
    this.pollCount = 0;
    this.successCount = 0;
    this.errorCount = 0;
  }

  async start() {
    console.log('[Poller] Starting Tokemoji price poller...');
    console.log(`[Poller] Polling interval: ${POLLING_INTERVAL}ms (${POLLING_INTERVAL / 1000}s)`);
    console.log(`[Poller] Price change threshold: ${PRICE_CHANGE_THRESHOLD * 100}%`);

    await this.loadTokens();

    if (this.tokens.length === 0) {
      console.error('[Poller] No active tokens found. Please run init-tokens.js first.');
      process.exit(1);
    }

    this.isRunning = true;

    await this.poll();

    this.intervalId = setInterval(() => {
      this.poll();
    }, POLLING_INTERVAL);

    process.on('SIGINT', () => this.stop());
    process.on('SIGTERM', () => this.stop());

    console.log('[Poller] ✓ Poller started successfully');
  }

  async loadTokens() {
    try {
      const { data, error } = await supabase
        .from('tokens')
        .select('id, symbol, mint_address, total_supply')
        .eq('is_active', true)
        .order('display_order');

      if (error) {
        throw error;
      }

      this.tokens = data || [];
      console.log(`[Poller] Loaded ${this.tokens.length} active tokens`);

      this.tokens.forEach(token => {
        console.log(`  - ${token.symbol} (${token.mint_address})`);
      });

    } catch (error) {
      console.error('[Poller] Error loading tokens:', error);
      throw error;
    }
  }

  async poll() {
    if (!this.isRunning) {
      return;
    }

    this.pollCount++;
    const startTime = Date.now();

    try {
      const mintAddresses = this.tokens.map(t => t.mint_address);

      console.log(`\n[Poller] Poll #${this.pollCount} - Fetching prices for ${mintAddresses.length} tokens...`);

      const priceData = await moralisClient.fetchMultipleTokenPrices(mintAddresses);

      const writes = [];

      for (let i = 0; i < priceData.length; i++) {
        const price = priceData[i];
        const token = this.tokens[i];

        if (!price || price.error || !price.priceUsd) {
          console.warn(`[Poller] No price data for ${token.symbol}:`, price?.error || 'Unknown error');
          continue;
        }

        const currentPrice = parseFloat(price.priceUsd);
        const lastPrice = this.lastPrices.get(token.id);

        const shouldWrite = !lastPrice || this.hasPriceChanged(lastPrice, currentPrice);

        if (shouldWrite) {
          writes.push({
            token_id: token.id,
            price_usd: currentPrice,
            liquidity_usd: price.liquidityUsd,
            volume_24h: price.volume24h,
            timestamp: new Date().toISOString()
          });

          const changePercent = lastPrice
            ? ((currentPrice - lastPrice) / lastPrice * 100).toFixed(2)
            : 'N/A';

          console.log(`  ✓ ${token.symbol}: $${currentPrice.toFixed(10)} ${lastPrice ? `(${changePercent > 0 ? '+' : ''}${changePercent}%)` : '(new)'}`);

          this.lastPrices.set(token.id, currentPrice);
        } else {
          console.log(`  - ${token.symbol}: $${currentPrice.toFixed(10)} (no change)`);
        }
      }

      if (writes.length > 0) {
        const { error } = await supabase
          .from('price_ticks')
          .insert(writes);

        if (error) {
          throw error;
        }

        console.log(`[Poller] ✓ Wrote ${writes.length} price tick(s) to database`);
      } else {
        console.log('[Poller] No price changes detected, skipping database write');
      }

      this.successCount++;
      const duration = Date.now() - startTime;
      console.log(`[Poller] Poll completed in ${duration}ms (Success: ${this.successCount}, Errors: ${this.errorCount})`);

    } catch (error) {
      this.errorCount++;
      console.error('[Poller] Poll error:', error.message);

      if (this.errorCount >= 5) {
        console.error('[Poller] Too many consecutive errors. Reloading tokens...');
        await this.loadTokens();
        this.errorCount = 0;
      }
    }
  }

  hasPriceChanged(oldPrice, newPrice) {
    if (!oldPrice || !newPrice) {
      return true;
    }

    const change = Math.abs((newPrice - oldPrice) / oldPrice);
    return change >= PRICE_CHANGE_THRESHOLD;
  }

  async stop() {
    console.log('\n[Poller] Stopping poller...');
    this.isRunning = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    console.log('[Poller] ✓ Poller stopped');
    console.log(`[Poller] Final stats: ${this.successCount} successful polls, ${this.errorCount} errors`);
    process.exit(0);
  }

  getHealth() {
    return {
      isRunning: this.isRunning,
      pollCount: this.pollCount,
      successCount: this.successCount,
      errorCount: this.errorCount,
      activeTokens: this.tokens.length,
      lastPollTime: new Date().toISOString()
    };
  }
}

const poller = new TokemojiPoller();
poller.start().catch(error => {
  console.error('[Poller] Fatal error:', error);
  process.exit(1);
});

export default poller;
