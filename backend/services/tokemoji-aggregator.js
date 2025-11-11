import supabase from '../utils/supabase-client.js';

class TokemojiAggregator {
  constructor() {
    this.isRunning = false;
  }

  async start() {
    console.log('[Aggregator] Starting Tokemoji data aggregator...');
    this.isRunning = true;

    await this.runAllJobs();

    this.oneMinuteInterval = setInterval(() => this.aggregate1Minute(), 60000);
    this.hourlyInterval = setInterval(() => this.aggregateHourly(), 3600000);
    this.dailyInterval = setInterval(() => this.aggregateDaily(), 86400000);
    this.cleanupInterval = setInterval(() => this.cleanup(), 900000);

    process.on('SIGINT', () => this.stop());
    process.on('SIGTERM', () => this.stop());

    console.log('[Aggregator] ✓ Aggregator started successfully');
    console.log('[Aggregator] Schedule:');
    console.log('  - 1-minute aggregation: every minute');
    console.log('  - Hourly aggregation: every hour');
    console.log('  - Daily aggregation: every 24 hours');
    console.log('  - Cleanup: every 15 minutes');
  }

  async runAllJobs() {
    console.log('[Aggregator] Running all aggregation jobs...');
    await this.aggregate1Minute();
    await this.aggregateHourly();
    await this.cleanup();
  }

  async aggregate1Minute() {
    try {
      console.log('\n[Aggregator] Running 1-minute aggregation...');

      const { data: tokens, error: tokensError } = await supabase
        .from('tokens')
        .select('id, symbol')
        .eq('is_active', true);

      if (tokensError) throw tokensError;

      const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();
      let aggregatesCreated = 0;

      for (const token of tokens) {
        const { data: ticks, error: ticksError } = await supabase
          .from('price_ticks')
          .select('price_usd, volume_24h, timestamp')
          .eq('token_id', token.id)
          .gte('timestamp', oneMinuteAgo)
          .order('timestamp', { ascending: true });

        if (ticksError) {
          console.error(`[Aggregator] Error fetching ticks for ${token.symbol}:`, ticksError);
          continue;
        }

        if (!ticks || ticks.length === 0) {
          continue;
        }

        const open = parseFloat(ticks[0].price_usd);
        const close = parseFloat(ticks[ticks.length - 1].price_usd);
        const high = Math.max(...ticks.map(t => parseFloat(t.price_usd)));
        const low = Math.min(...ticks.map(t => parseFloat(t.price_usd)));
        const volume = ticks.reduce((sum, t) => sum + (parseFloat(t.volume_24h) || 0), 0);

        const bucketStart = new Date(Math.floor(Date.now() / 60000) * 60000 - 60000).toISOString();

        const { error: upsertError } = await supabase
          .from('price_aggregates_1m')
          .upsert({
            token_id: token.id,
            bucket_start: bucketStart,
            open,
            high,
            low,
            close,
            volume,
            tick_count: ticks.length
          }, {
            onConflict: 'token_id,bucket_start'
          });

        if (upsertError) {
          console.error(`[Aggregator] Error upserting 1m aggregate for ${token.symbol}:`, upsertError);
        } else {
          aggregatesCreated++;
          console.log(`  ✓ ${token.symbol}: O:${open.toFixed(10)} H:${high.toFixed(10)} L:${low.toFixed(10)} C:${close.toFixed(10)} (${ticks.length} ticks)`);
        }
      }

      console.log(`[Aggregator] ✓ Created ${aggregatesCreated} 1-minute aggregates`);

    } catch (error) {
      console.error('[Aggregator] 1-minute aggregation error:', error);
    }
  }

  async aggregateHourly() {
    try {
      console.log('\n[Aggregator] Running hourly aggregation...');

      const { data: tokens, error: tokensError } = await supabase
        .from('tokens')
        .select('id, symbol')
        .eq('is_active', true);

      if (tokensError) throw tokensError;

      const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
      let aggregatesCreated = 0;

      for (const token of tokens) {
        const { data: minuteCandles, error: candlesError } = await supabase
          .from('price_aggregates_1m')
          .select('open, high, low, close, volume')
          .eq('token_id', token.id)
          .gte('bucket_start', oneHourAgo)
          .order('bucket_start', { ascending: true });

        if (candlesError) {
          console.error(`[Aggregator] Error fetching 1m candles for ${token.symbol}:`, candlesError);
          continue;
        }

        if (!minuteCandles || minuteCandles.length === 0) {
          continue;
        }

        const open = parseFloat(minuteCandles[0].open);
        const close = parseFloat(minuteCandles[minuteCandles.length - 1].close);
        const high = Math.max(...minuteCandles.map(c => parseFloat(c.high)));
        const low = Math.min(...minuteCandles.map(c => parseFloat(c.low)));
        const volume = minuteCandles.reduce((sum, c) => sum + (parseFloat(c.volume) || 0), 0);

        const bucketStart = new Date(Math.floor(Date.now() / 3600000) * 3600000 - 3600000).toISOString();

        const { error: upsertError } = await supabase
          .from('price_aggregates_hourly')
          .upsert({
            token_id: token.id,
            bucket_start: bucketStart,
            open,
            high,
            low,
            close,
            volume,
            tick_count: minuteCandles.length
          }, {
            onConflict: 'token_id,bucket_start'
          });

        if (upsertError) {
          console.error(`[Aggregator] Error upserting hourly aggregate for ${token.symbol}:`, upsertError);
        } else {
          aggregatesCreated++;
          console.log(`  ✓ ${token.symbol}: O:${open.toFixed(10)} H:${high.toFixed(10)} L:${low.toFixed(10)} C:${close.toFixed(10)} (${minuteCandles.length} 1m candles)`);
        }
      }

      console.log(`[Aggregator] ✓ Created ${aggregatesCreated} hourly aggregates`);

    } catch (error) {
      console.error('[Aggregator] Hourly aggregation error:', error);
    }
  }

  async aggregateDaily() {
    try {
      console.log('\n[Aggregator] Running daily aggregation...');

      const { data: tokens, error: tokensError } = await supabase
        .from('tokens')
        .select('id, symbol')
        .eq('is_active', true);

      if (tokensError) throw tokensError;

      const oneDayAgo = new Date(Date.now() - 86400000).toISOString();
      let aggregatesCreated = 0;

      for (const token of tokens) {
        const { data: hourlyCandles, error: candlesError } = await supabase
          .from('price_aggregates_hourly')
          .select('open, high, low, close, volume')
          .eq('token_id', token.id)
          .gte('bucket_start', oneDayAgo)
          .order('bucket_start', { ascending: true });

        if (candlesError) {
          console.error(`[Aggregator] Error fetching hourly candles for ${token.symbol}:`, candlesError);
          continue;
        }

        if (!hourlyCandles || hourlyCandles.length === 0) {
          continue;
        }

        const open = parseFloat(hourlyCandles[0].open);
        const close = parseFloat(hourlyCandles[hourlyCandles.length - 1].close);
        const high = Math.max(...hourlyCandles.map(c => parseFloat(c.high)));
        const low = Math.min(...hourlyCandles.map(c => parseFloat(c.low)));
        const volume = hourlyCandles.reduce((sum, c) => sum + (parseFloat(c.volume) || 0), 0);

        const bucketStart = new Date(Math.floor(Date.now() / 86400000) * 86400000 - 86400000).toISOString();

        const { error: upsertError } = await supabase
          .from('price_aggregates_daily')
          .upsert({
            token_id: token.id,
            bucket_start: bucketStart,
            open,
            high,
            low,
            close,
            volume,
            tick_count: hourlyCandles.length
          }, {
            onConflict: 'token_id,bucket_start'
          });

        if (upsertError) {
          console.error(`[Aggregator] Error upserting daily aggregate for ${token.symbol}:`, upsertError);
        } else {
          aggregatesCreated++;
          console.log(`  ✓ ${token.symbol}: O:${open.toFixed(10)} H:${high.toFixed(10)} L:${low.toFixed(10)} C:${close.toFixed(10)} (${hourlyCandles.length} hourly candles)`);
        }
      }

      console.log(`[Aggregator] ✓ Created ${aggregatesCreated} daily aggregates`);

    } catch (error) {
      console.error('[Aggregator] Daily aggregation error:', error);
    }
  }

  async cleanup() {
    try {
      console.log('\n[Aggregator] Running cleanup...');

      const { error: ticksError } = await supabase
        .rpc('cleanup_old_price_ticks');

      if (ticksError) {
        console.error('[Aggregator] Error cleaning up price_ticks:', ticksError);
      } else {
        console.log('[Aggregator] ✓ Cleaned up old price_ticks (>60 minutes)');
      }

      const { error: m1Error } = await supabase
        .rpc('cleanup_old_1m_aggregates');

      if (m1Error) {
        console.error('[Aggregator] Error cleaning up 1m aggregates:', m1Error);
      } else {
        console.log('[Aggregator] ✓ Cleaned up old 1m aggregates (>7 days)');
      }

      const { error: hourlyError } = await supabase
        .rpc('cleanup_old_hourly_aggregates');

      if (hourlyError) {
        console.error('[Aggregator] Error cleaning up hourly aggregates:', hourlyError);
      } else {
        console.log('[Aggregator] ✓ Cleaned up old hourly aggregates (>90 days)');
      }

    } catch (error) {
      console.error('[Aggregator] Cleanup error:', error);
    }
  }

  stop() {
    console.log('\n[Aggregator] Stopping aggregator...');
    this.isRunning = false;

    if (this.oneMinuteInterval) clearInterval(this.oneMinuteInterval);
    if (this.hourlyInterval) clearInterval(this.hourlyInterval);
    if (this.dailyInterval) clearInterval(this.dailyInterval);
    if (this.cleanupInterval) clearInterval(this.cleanupInterval);

    console.log('[Aggregator] ✓ Aggregator stopped');
    process.exit(0);
  }
}

const aggregator = new TokemojiAggregator();
aggregator.start().catch(error => {
  console.error('[Aggregator] Fatal error:', error);
  process.exit(1);
});

export default aggregator;
