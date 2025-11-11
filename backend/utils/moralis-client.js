import fetch from 'node-fetch';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, '..', '..', '.env') });

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;
const MORALIS_BASE_URL = 'https://solana-gateway.moralis.io';

class MoralisClient {
  constructor() {
    if (!MORALIS_API_KEY) {
      throw new Error('MORALIS_API_KEY environment variable is required');
    }
    this.apiKey = MORALIS_API_KEY;
    this.cache = new Map();
    this.cacheTimeout = 2000;
    this.maxRetries = 3;
    this.retryDelay = 1000;
  }

  async fetchMultipleTokenPrices(mintAddresses) {
    if (!mintAddresses || mintAddresses.length === 0) {
      return [];
    }

    const cacheKey = mintAddresses.sort().join(',');
    const cachedData = this.cache.get(cacheKey);

    if (cachedData && Date.now() - cachedData.timestamp < this.cacheTimeout) {
      console.log('[Moralis] Using cached data for', mintAddresses.length, 'tokens');
      return cachedData.data;
    }

    const batches = this.createBatches(mintAddresses, 25);
    const results = [];

    for (const batch of batches) {
      const batchResult = await this.fetchBatch(batch);
      results.push(...batchResult);
    }

    this.cache.set(cacheKey, {
      data: results,
      timestamp: Date.now()
    });

    setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);

    return results;
  }

  createBatches(array, size) {
    const batches = [];
    for (let i = 0; i < array.length; i += size) {
      batches.push(array.slice(i, i + size));
    }
    return batches;
  }

  async fetchBatch(mintAddresses, attempt = 1) {
    try {
      const url = `${MORALIS_BASE_URL}/token/mainnet/price`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey
        },
        body: JSON.stringify({
          tokens: mintAddresses.map(address => ({
            token_address: address
          }))
        })
      });

      if (!response.ok) {
        if (response.status === 429) {
          console.error('[Moralis] Rate limit hit, waiting before retry...');
          await this.sleep(5000);

          if (attempt < this.maxRetries) {
            return this.fetchBatch(mintAddresses, attempt + 1);
          }
          throw new Error('Rate limit exceeded after retries');
        }

        const errorText = await response.text();
        throw new Error(`Moralis API error ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      return this.normalizeResponse(data, mintAddresses);

    } catch (error) {
      console.error(`[Moralis] Fetch error (attempt ${attempt}/${this.maxRetries}):`, error.message);

      if (attempt < this.maxRetries) {
        await this.sleep(this.retryDelay * attempt);
        return this.fetchBatch(mintAddresses, attempt + 1);
      }

      throw error;
    }
  }

  normalizeResponse(data, mintAddresses) {
    if (!data || !Array.isArray(data)) {
      console.warn('[Moralis] Invalid response format, returning empty array');
      return mintAddresses.map(address => ({
        mintAddress: address,
        priceUsd: null,
        error: 'Invalid response format'
      }));
    }

    return data.map((item, index) => {
      const mintAddress = mintAddresses[index];

      if (!item || item.error) {
        return {
          mintAddress,
          priceUsd: null,
          liquidityUsd: null,
          volume24h: null,
          error: item?.error || 'No data available'
        };
      }

      return {
        mintAddress,
        priceUsd: item.usdPrice || item.price || null,
        liquidityUsd: item.liquidity || null,
        volume24h: item.volume24h || item['24hrVolume'] || null,
        timestamp: new Date().toISOString()
      };
    });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  clearCache() {
    this.cache.clear();
  }
}

export default new MoralisClient();
