import {
  SERIES,
  seriesColor,
  seriesGradient,
  seriesDash,
  gradientStops,
  legendSwatchStyle,
} from './chartSeries';

describe('chart series tokens', () => {
  test('colors are unique (no silent swap)', () => {
    const colors = Object.values(SERIES).map((s) => s.color);
    expect(new Set(colors).size).toBe(colors.length);
  });

  test('each series has a stable color and non-color identifier', () => {
    expect(seriesColor('newClients')).toBe('#6A1B9A');
    expect(seriesColor('clientRenewals')).toBe('#F8B4C4');
    expect(seriesDash('clientRenewals')).toBe('6 3');
    expect(seriesDash('newClients')).toBeUndefined();
  });

  test('gradient helper returns matching defs reference', () => {
    expect(seriesGradient('newClients')).toBe('url(#series-newClients)');
    expect(seriesGradient('clientRenewals')).toBe('url(#series-clientRenewals)');
  });

  test('renewal plot and legend colors stay pale', () => {
    expect(gradientStops('clientRenewals')).toEqual(['rgba(248, 180, 196, 1)', 'rgba(248, 180, 196, 1)']);
    expect(legendSwatchStyle('clientRenewals').background).toContain('rgba(248, 180, 196, 1)');
  });

  test('unknown series falls back safely', () => {
    expect(seriesColor('nope')).toBe('#6B7280');
    expect(seriesGradient('nope')).toBe('url(#undefined)');
  });
});