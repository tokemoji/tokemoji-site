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

    const results = [];

    for (const address of mintAddresses) {
      const cachedData = this.cache.get(address);

      if (cachedData && Date.now() - cachedData.timestamp < this.cacheTimeout) {
        results.push(cachedData.data);
        continue;
      }

      try {
        const data = await this.fetchSingleToken(address);
        results.push(data);

        this.cache.set(address, {
          data,
          timestamp: Date.now()
        });

        setTimeout(() => this.cache.delete(address), this.cacheTimeout);

        await this.sleep(200);

      } catch (error) {
        console.error(`[Moralis] Error fetching ${address}:`, error.message);
        results.push({
          mintAddress: address,
          priceUsd: null,
          liquidityUsd: null,
          volume24h: null,
          error: error.message
        });
      }
    }

    return results;
  }

  async fetchSingleToken(mintAddress, attempt = 1) {
    try {
      const url = `${MORALIS_BASE_URL}/token/mainnet/${mintAddress}/price`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-API-Key': this.apiKey
        }
      });

      if (!response.ok) {
        if (response.status === 429) {
          console.error('[Moralis] Rate limit hit, waiting before retry...');
          await this.sleep(5000);

          if (attempt < this.maxRetries) {
            return this.fetchSingleToken(mintAddress, attempt + 1);
          }
          throw new Error('Rate limit exceeded after retries');
        }

        const errorText = await response.text();
        throw new Error(`Moralis API error ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      return this.normalizeResponse(data, mintAddress);

    } catch (error) {
      if (attempt < this.maxRetries) {
        await this.sleep(this.retryDelay * attempt);
        return this.fetchSingleToken(mintAddress, attempt + 1);
      }

      throw error;
    }
  }

  normalizeResponse(data, mintAddress) {
    if (!data) {
      return {
        mintAddress,
        priceUsd: null,
        liquidityUsd: null,
        volume24h: null,
        error: 'No data available'
      };
    }

    return {
      mintAddress,
      priceUsd: data.usdPrice || null,
      liquidityUsd: data.nativePrice?.value || null,
      volume24h: null,
      timestamp: new Date().toISOString()
    };
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  clearCache() {
    this.cache.clear();
  }
}

export default new MoralisClient();
