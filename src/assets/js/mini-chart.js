class MiniChart {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.width = options.width || 120;
    this.height = options.height || 40;
    this.padding = options.padding || 2;
    this.gradientColor = options.gradientColor || '#2196F3';
    this.lineColor = options.lineColor || '#1976D2';
  }

  render(dataPoints) {
    if (!this.container || !dataPoints || dataPoints.length === 0) {
      return;
    }

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', this.width);
    svg.setAttribute('height', this.height);
    svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);
    svg.style.display = 'block';

    const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', gradientId);
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '0%');
    gradient.setAttribute('y2', '100%');

    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('style', `stop-color:${this.gradientColor};stop-opacity:0.3`);

    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('style', `stop-color:${this.gradientColor};stop-opacity:0.05`);

    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.appendChild(defs);

    const prices = dataPoints.map(d => d.price || d.close || 0);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1;

    const chartWidth = this.width - (this.padding * 2);
    const chartHeight = this.height - (this.padding * 2);
    const stepX = chartWidth / (prices.length - 1 || 1);

    const points = prices.map((price, i) => {
      const x = this.padding + (i * stepX);
      const y = this.padding + (chartHeight - ((price - minPrice) / priceRange * chartHeight));
      return { x, y };
    });

    let pathData = `M ${this.padding} ${this.height - this.padding}`;

    pathData += ` L ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      pathData += ` L ${points[i].x} ${points[i].y}`;
    }

    pathData += ` L ${this.width - this.padding} ${this.height - this.padding}`;
    pathData += ` Z`;

    const areaPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    areaPath.setAttribute('d', pathData);
    areaPath.setAttribute('fill', `url(#${gradientId})`);
    svg.appendChild(areaPath);

    let lineData = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      lineData += ` L ${points[i].x} ${points[i].y}`;
    }

    const linePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    linePath.setAttribute('d', lineData);
    linePath.setAttribute('stroke', this.lineColor);
    linePath.setAttribute('stroke-width', '1.5');
    linePath.setAttribute('fill', 'none');
    linePath.classList.add('chart-line');
    areaPath.classList.add('chart-area');
    svg.appendChild(linePath);

    this.container.innerHTML = '';
    this.container.classList.add('mini-chart-animate');
    this.container.appendChild(svg);

    requestAnimationFrame(function() {
      var len = linePath.getTotalLength();
      linePath.style.strokeDasharray = len;
      linePath.style.strokeDashoffset = len;
      linePath.style.setProperty('--chart-length', len);
      linePath.style.animation = 'chartDraw 1.2s ease-out forwards';
    });
  }

  static renderInline(dataPoints, width = 100, height = 30) {
    const container = document.createElement('div');
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
    container.style.display = 'inline-block';

    const chart = new MiniChart(null, { width, height });
    chart.container = container;
    chart.render(dataPoints);

    return container;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MiniChart;
}
