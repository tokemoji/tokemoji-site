const SUPABASE_URL = 'https://zhiebsuyfexsxtpekakn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoaWVic3V5ZmV4c3h0cGVrYWtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NDgzNDIsImV4cCI6MjA3ODQyNDM0Mn0.gH8ihMvsHeOhQ2zO42TLA62-ePq6n53AfYao2l4vk5g';
const API_BASE = `${SUPABASE_URL}/functions/v1`;
const REFRESH_INTERVAL = 5000;

class TokemojiLiveData {
  constructor() {
    this.tokens = [];
    this.summary = null;
    this.currentSort = 'marketcap';
    this.isLoading = false;
    this.lastUpdate = null;
    this.refreshInterval = null;
  }

  async init() {
    console.log('[Tokemoji] Initializing live data module...');

    await this.fetchAllData();

    this.renderTokenList();
    this.updateDashboardWidgets();

    this.startAutoRefresh();

    this.setupEventListeners();

    console.log('[Tokemoji] Live data module initialized successfully');
  }

  async fetchAllData() {
    try {
      this.isLoading = true;

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY
      };

      const [tokensRes, summaryRes] = await Promise.all([
        fetch(`${API_BASE}/get-tokens`, { headers }),
        fetch(`${API_BASE}/get-market-summary`, { headers })
      ]);

      if (!tokensRes.ok || !summaryRes.ok) {
        const tokensError = tokensRes.ok ? null : await tokensRes.text();
        const summaryError = summaryRes.ok ? null : await summaryRes.text();
        console.error('[Tokemoji] API Error Details:', {
          tokensStatus: tokensRes.status,
          tokensError,
          summaryStatus: summaryRes.status,
          summaryError
        });
        throw new Error(`API returned error status: Tokens ${tokensRes.status}, Summary ${summaryRes.status}`);
      }

      this.tokens = await tokensRes.json();
      this.summary = await summaryRes.json();
      this.lastUpdate = new Date();

      console.log('[Tokemoji] Data updated successfully:', {
        tokens: this.tokens.length,
        totalMarketCap: this.summary?.total_market_cap
      });

    } catch (error) {
      console.error('[Tokemoji] Error fetching data:', error);
      this.showError(error.message);
    } finally {
      this.isLoading = false;
    }
  }

  renderTokenList() {
    const container = document.getElementById('token-list');
    if (!container) return;

    const sortedTokens = this.getSortedTokens();

    container.innerHTML = sortedTokens.map((token, index) => {
      const priceFormatted = token.price_usd
        ? `$${this.formatPrice(token.price_usd)}`
        : 'N/A';

      const marketCapFormatted = token.market_cap
        ? `$${this.formatMarketCap(token.market_cap)}`
        : 'N/A';

      const change24h = token.change_24h || 0;
      const changeClass = change24h >= 0 ? 'text-success' : 'text-danger';
      const changeIcon = change24h >= 0 ? '↑' : '↓';
      const changeFormatted = `${changeIcon} ${Math.abs(change24h).toFixed(2)}%`;

      const videoSrc = token.icon_path || 'assets/img/emojis/happy.webm';
      const bgColor = token.display_color || '#ffc107';

      return `
        <div class="token-item mb-3 p-3 border border-2 border-dark rounded-4 bg-white shadow-sharp"
             data-token-id="${token.id}"
             data-change="${change24h}"
             data-market-cap="${token.market_cap || 0}">
          <div class="row align-items-center">
            <div class="col-2 col-md-1">
              <div class="token-rank fw-bold text-muted">#${index + 1}</div>
            </div>
            <div class="col-3 col-md-2">
              <div class="token-emoji" style="width: 50px; height: 50px; background: ${bgColor}20; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <video autoplay loop muted playsinline style="width: 40px; height: 40px;">
                  <source src="${videoSrc}" type="video/webm">
                </video>
              </div>
            </div>
            <div class="col-7 col-md-3">
              <div class="token-symbol fw-bold">${token.symbol}</div>
              <div class="token-name small text-muted">${token.name}</div>
            </div>
            <div class="col-6 col-md-2 text-end">
              <div class="token-price fw-bold">${priceFormatted}</div>
            </div>
            <div class="col-6 col-md-2 text-end">
              <div class="token-market-cap">${marketCapFormatted}</div>
            </div>
            <div class="col-12 col-md-2 text-end">
              <div class="token-change ${changeClass} fw-bold">${changeFormatted}</div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  getSortedTokens() {
    const sorted = [...this.tokens];

    switch (this.currentSort) {
      case 'gainers':
        return sorted.sort((a, b) => (b.change_24h || 0) - (a.change_24h || 0));
      case 'losers':
        return sorted.sort((a, b) => (a.change_24h || 0) - (b.change_24h || 0));
      case 'marketcap':
      default:
        return sorted.sort((a, b) => (b.market_cap || 0) - (a.market_cap || 0));
    }
  }

  updateDashboardWidgets() {
    if (!this.summary) return;

    this.updateDominanceWidget();
    this.updateGauges();
    this.updateTopGainersLosers();
  }

  updateDominanceWidget() {
    const dominant = this.summary.dominant_token;

    const gifElement = document.getElementById('dominance-gif');
    if (gifElement && dominant.icon_path) {
      gifElement.src = dominant.icon_path;
    }

    const tickerElement = document.getElementById('dominance-ticker');
    if (tickerElement) {
      tickerElement.textContent = dominant.symbol;
    }

    const percentageElement = document.getElementById('dominance-percentage');
    if (percentageElement) {
      percentageElement.textContent = `${dominant.dominance_percentage.toFixed(1)}%`;
    }

    const barElement = document.getElementById('dominance-bar');
    if (barElement) {
      barElement.style.width = `${dominant.dominance_percentage}%`;
    }
  }

  updateGauges() {
    const comparisons = this.summary.comparisons;

    if (comparisons.greed_vs_fear) {
      this.updateGauge(
        'greed-fear',
        comparisons.greed_vs_fear.greed_percentage,
        comparisons.greed_vs_fear.greed_percentage >= 50 ? 'GREED' : 'FEAR'
      );
    }

    if (comparisons.good_vs_evil) {
      this.updateGauge(
        'good-evil',
        comparisons.good_vs_evil.good_percentage,
        comparisons.good_vs_evil.good_percentage >= 50 ? 'GOOD' : 'EVIL'
      );
    }

    if (comparisons.love_vs_hate) {
      this.updateGauge(
        'love-hate',
        comparisons.love_vs_hate.love_percentage,
        comparisons.love_vs_hate.love_percentage >= 50 ? 'LOVE' : 'HATE'
      );
    }
  }

  updateGauge(gaugeName, percentage, winner) {
    const gaugeElement = document.getElementById(`${gaugeName}-gauge`);
    if (gaugeElement) {
      const circumference = 157.1;
      const offset = circumference * (1 - percentage / 100);
      gaugeElement.setAttribute('stroke-dashoffset', offset);
    }

    const resultElement = document.getElementById(`${gaugeName}-result`);
    if (resultElement) {
      const tickerElement = resultElement.querySelector('.gauge-ticker');
      const percentageElement = resultElement.querySelector('.gauge-percentage');

      if (tickerElement) tickerElement.textContent = winner;
      if (percentageElement) percentageElement.textContent = `${percentage.toFixed(0)}%`;
    }
  }

  updateTopGainersLosers() {
    const topGainers = this.summary.top_gainers;
    const topLosers = this.summary.top_losers;

    if (topGainers && topGainers.length > 0) {
      const gainer = topGainers[0];

      const gifElement = document.getElementById('top-gainer-gif-center');
      if (gifElement) gifElement.src = gainer.icon_path;

      const tickerElement = document.getElementById('top-gainer-ticker');
      if (tickerElement) tickerElement.textContent = gainer.symbol;

      const changeElement = document.getElementById('top-gainer-change');
      if (changeElement) changeElement.textContent = `+${gainer.change_24h.toFixed(2)}%`;
    }

    if (topLosers && topLosers.length > 0) {
      const loser = topLosers[0];

      const gifElement = document.getElementById('top-loser-gif-center');
      if (gifElement) gifElement.src = loser.icon_path;

      const tickerElement = document.getElementById('top-loser-ticker');
      if (tickerElement) tickerElement.textContent = loser.symbol;

      const changeElement = document.getElementById('top-loser-change');
      if (changeElement) changeElement.textContent = `${loser.change_24h.toFixed(2)}%`;
    }
  }

  setupEventListeners() {
    const sortButtons = document.querySelectorAll('.sort-btn');
    sortButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const sortType = e.target.getAttribute('data-sort');

        sortButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        this.currentSort = sortType;
        this.renderTokenList();
      });
    });
  }

  startAutoRefresh() {
    this.refreshInterval = setInterval(async () => {
      if (!this.isLoading) {
        await this.fetchAllData();
        this.renderTokenList();
        this.updateDashboardWidgets();
      }
    }, REFRESH_INTERVAL);

    console.log(`[Tokemoji] Auto-refresh started (${REFRESH_INTERVAL / 1000}s interval)`);
  }

  stopAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      console.log('[Tokemoji] Auto-refresh stopped');
    }
  }

  formatPrice(price) {
    if (price >= 1) {
      return price.toFixed(4);
    } else if (price >= 0.0001) {
      return price.toFixed(6);
    } else {
      return price.toFixed(10);
    }
  }

  formatMarketCap(marketCap) {
    if (marketCap >= 1000000000) {
      return `${(marketCap / 1000000000).toFixed(2)}B`;
    } else if (marketCap >= 1000000) {
      return `${(marketCap / 1000000).toFixed(2)}M`;
    } else if (marketCap >= 1000) {
      return `${(marketCap / 1000).toFixed(2)}K`;
    } else {
      return marketCap.toFixed(2);
    }
  }

  showError(details = '') {
    const container = document.getElementById('token-list');
    if (container) {
      container.innerHTML = `
        <div class="alert alert-danger">
          <strong>Connection Error:</strong> Unable to fetch live data. Retrying...
          ${details ? `<br><small>${details}</small>` : ''}
        </div>
      `;
    }
  }
}

if (typeof window !== 'undefined') {
  window.TokemojiLiveData = TokemojiLiveData;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const liveData = new TokemojiLiveData();
      liveData.init();
    });
  } else {
    const liveData = new TokemojiLiveData();
    liveData.init();
  }
}
