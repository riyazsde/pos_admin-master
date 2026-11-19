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
});
