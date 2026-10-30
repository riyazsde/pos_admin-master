// src/Theme/chartSeries.js
// Single source of truth for chart series identity.
// A series id maps to a stable color + non-color identifier.
// Never derive a series color from its array index or widget.

export const SERIES = {
  newClients: {
    id: 'newClients',
    labelKey: 'dashboard.newClients',
    color: '#6A1B9A',            // dark purple — matches CurrentMonthActivity today
    colorEnd: '#D32F2F',         // existing brand gradient end
    gradientId: 'series-newClients',
    strokeDasharray: undefined,  // solid
    legendFaded: false,          // legend shows the strong swatch
  },
  clientRenewals: {
    id: 'clientRenewals',
    labelKey: 'dashboard.clientRenewals',
    color: '#6A1B9A',            // same hue family, but rendered faded
    colorEnd: '#D32F2F',
    gradientId: 'series-clientRenewals',
    strokeDasharray: '6 3',      // dashed — non-color identifier
    legendFaded: true,           // legend shows the faded swatch
    fadeOpacity: 0.45,
  },
};

export const seriesColor    = (key) => SERIES[key]?.color ?? '#6B7280';
export const seriesColorEnd = (key) => SERIES[key]?.colorEnd ?? '#6B7280';
export const seriesGradient = (key) => `url(#${SERIES[key]?.gradientId})`;
export const seriesDash     = (key) => SERIES[key]?.strokeDasharray;
export const seriesLegend   = (key) => SERIES[key];

// Linear gradient stop colors — solid for newClients, faded for renewals.
export function gradientStops(key) {
  const s = SERIES[key];
  if (!s) return ['#6B7280', '#6B7280'];
  const o = s.fadeOpacity ?? 1;
  const toRgba = (hex, a) => {
    const v = hex.replace('#', '');
    const n = parseInt(v, 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
  };
  return [toRgba(s.color, o), toRgba(s.colorEnd, o)];
}

// CSS background for a legend swatch (same values as the gradient defs).
export function legendSwatchStyle(key) {
  const [from, to] = gradientStops(key);
  return { background: `linear-gradient(180deg, ${from} 0%, ${to} 100%)` };
}