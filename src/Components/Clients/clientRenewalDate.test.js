import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  BUSINESS_TIME_ZONE,
  getClientDaysUntilRenewal,
  getClientRenewalDate,
  getClientTimeZone,
  getDaysLeft,
  toZonedDateKey,
} from './clientRenewalDate.js';

describe('client renewal countdowns', () => {
  const now = new Date('2026-11-15T22:30:00.000Z');

  it('calculates overdue and 20-days-remaining dates in the business timezone', () => {
    assert.equal(toZonedDateKey(now, BUSINESS_TIME_ZONE), '2026-11-16');
    assert.equal(getDaysLeft('2026-11-15', BUSINESS_TIME_ZONE, now), -1);
    assert.equal(getDaysLeft('2026-12-06', BUSINESS_TIME_ZONE, now), 20);
  });

  it('treats date-only values as calendar dates, not UTC instants', () => {
    const pacificNow = new Date('2026-11-16T12:00:00.000Z');
    assert.equal(getDaysLeft('2026-11-16', 'Pacific/Honolulu', pacificNow), 0);
  });

  it('uses the client timezone when calculating the renewal calendar day', () => {
    const dubaiCafe = { Time_Zone: 'Africa/Cairo' };
    const now = new Date('2026-07-01T21:30:00.000Z');

    assert.equal(getClientTimeZone(dubaiCafe), 'Africa/Cairo');
    assert.equal(
      getClientDaysUntilRenewal(
        { ...dubaiCafe, RenewalDate: '2026-07-02' },
        now
      ),
      0
    );
    assert.equal(getDaysLeft('2026-07-02', BUSINESS_TIME_ZONE, now), 1);
  });

  it('uses the days remaining calculated in the API response when available', () => {
    assert.equal(
      getClientDaysUntilRenewal(
        { DaysUntilRenewal: 20, RenewalDate: '2026-11-15' },
        now
      ),
      20
    );
  });

  it('uses the business timezone when the client timezone is missing or invalid', () => {
    assert.equal(getClientTimeZone({}), BUSINESS_TIME_ZONE);
    assert.equal(
      getClientTimeZone({ Time_Zone: 'Not/A_Timezone' }),
      BUSINESS_TIME_ZONE
    );
  });

  it('uses the business calendar day for timestamps around midnight', () => {
    const sameBusinessDay = new Date('2026-11-15T23:30:00.000Z');
    assert.equal(
      getDaysLeft('2026-11-16T00:15:00.000Z', BUSINESS_TIME_ZONE, sameBusinessDay),
      0
    );
  });

  it('returns null for missing or invalid dates', () => {
    assert.equal(getDaysLeft(null, BUSINESS_TIME_ZONE, now), null);
    assert.equal(getDaysLeft('2026-02-30', BUSINESS_TIME_ZONE, now), null);
  });

  it('returns the same values when recalculated with the same timestamp', () => {
    const firstPass = [
      getDaysLeft('2026-11-15', BUSINESS_TIME_ZONE, now),
      getDaysLeft('2026-12-06', BUSINESS_TIME_ZONE, now),
    ];
    const afterFilterCycle = [
      getDaysLeft('2026-11-15', BUSINESS_TIME_ZONE, now),
      getDaysLeft('2026-12-06', BUSINESS_TIME_ZONE, now),
    ];
    assert.deepEqual(afterFilterCycle, firstPass);
  });

  it('preserves eight row results across an open-close filter cycle', () => {
    const clients = [
      { RenewalDate: '2026-11-15' },
      { AccountSubscriptionDetails: { RenewalDate: '2026-12-06' } },
      { RenewalDate: null },
      { RenewalDate: '2026-11-16' },
      { RenewalDate: '2026-11-17' },
      { RenewalDate: '2026-11-30' },
      { RenewalDate: '2026-12-01' },
      { RenewalDate: '2027-01-01' },
    ];

    const calculate = () =>
      clients.map((client) => getClientDaysUntilRenewal(client, now));

    assert.deepEqual(calculate(), [-1, 20, null, 0, 1, 14, 15, 46]);
    assert.deepEqual(calculate(), [-1, 20, null, 0, 1, 14, 15, 46]);
  });

  it('reads renewal dates from the API SubscriptionDetails shape', () => {
    assert.equal(
      getClientRenewalDate({
        RenewalDate: null,
        SubscriptionDetails: { RenewalDate: '2026-12-06T15:59:31.481Z' },
      }),
      '2026-12-06T15:59:31.481Z'
    );
  });
});
