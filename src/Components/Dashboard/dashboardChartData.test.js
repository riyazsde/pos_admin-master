import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  getDashboardChartData,
  getDashboardChartMax,
  getDashboardTooltipEntries,
} from './dashboardChartData.js';

describe('dashboard chart data', () => {
  it('uses the same nonzero values for plotted series and tooltip entries', () => {
    const [row] = getDashboardChartData(
      [{ day: '16', newClients: 12, existingClientsRenewal: 7 }],
      'day'
    );

    assert.deepEqual(row, {
      period: '16',
      newClients: 12,
      renewals: 7,
    });
    assert.deepEqual(getDashboardTooltipEntries(row), [
      { dataKey: 'newClients', value: row.newClients },
      { dataKey: 'renewals', value: row.renewals },
    ]);
    assert.equal(getDashboardChartMax([row]), 12);
  });

  it('normalizes numeric API strings and safely handles missing or invalid values', () => {
    assert.deepEqual(
      getDashboardChartData(
        [
          { month: 'Nov', newClients: '14', existingClientsRenewal: '3' },
          { month: 'Dec', newClients: null, existingClientsRenewal: 'invalid' },
        ],
        'month'
      ),
      [
        { period: 'Nov', newClients: 14, renewals: 3 },
        { period: 'Dec', newClients: 0, renewals: 0 },
      ]
    );
    assert.deepEqual(getDashboardChartData(null, 'day'), []);
  });

  it('keeps nonzero plotted values and tooltip values identical', () => {
    const chartData = getDashboardChartData(
      [
        { day: '1', newClients: 8, existingClientsRenewal: 0 },
        { day: '2', newClients: 0, existingClientsRenewal: 5 },
      ],
      'day'
    );

    assert.equal(getDashboardChartMax(chartData), 8);
    assert.deepEqual(getDashboardTooltipEntries(chartData[0]), [
      { dataKey: 'newClients', value: 8 },
      { dataKey: 'renewals', value: 0 },
    ]);
    assert.deepEqual(getDashboardTooltipEntries(chartData[1]), [
      { dataKey: 'newClients', value: 0 },
      { dataKey: 'renewals', value: 5 },
    ]);
  });

  it('clamps negatives and handles renewal field aliases and empty categories', () => {
    assert.deepEqual(
      getDashboardChartData(
        [
          { day: '1', newClients: -4, existingClientsRenewal: -2 },
          { day: '2', newClients: '', existingClientsRenewals: '9' },
          { day: '3', newClients: null, renewals: 6 },
          { day: '' },
        ],
        'day'
      ),
      [
        { period: '1', newClients: 0, renewals: 0 },
        { period: '2', newClients: 0, renewals: 9 },
        { period: '3', newClients: 0, renewals: 6 },
        { period: '', newClients: 0, renewals: 0 },
      ]
    );
  });
});
