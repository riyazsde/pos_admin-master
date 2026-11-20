import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  formatLoginTimestamp,
  isValidTimeZone,
  parseLoginTimestamp,
} from './loginHistoryDateTime.js';

describe('login history timestamps', () => {
  it('parses timestamps with UTC and explicit offsets as the same instant', () => {
    assert.equal(
      parseLoginTimestamp('2026-11-16T12:00:00Z')?.toISOString(),
      '2026-11-16T12:00:00.000Z'
    );
    assert.equal(
      parseLoginTimestamp('2026-11-16T17:30:00+05:30')?.toISOString(),
      '2026-11-16T12:00:00.000Z'
    );
  });

  it('rejects timestamps without timezone provenance and invalid calendar dates', () => {
    assert.equal(parseLoginTimestamp('2026-11-16T12:00:00'), null);
    assert.equal(parseLoginTimestamp('2026-02-30T12:00:00Z'), null);
  });

  it('formats the instant in the selected timezone and retains the UTC instant', () => {
    const formatted = formatLoginTimestamp(
      '2026-11-16T12:00:00Z',
      'Asia/Kolkata'
    );

    assert.deepEqual(formatted, {
      dateTime: '2026-11-16T12:00:00.000Z',
      text: '16 Nov 2026, 05:30:00 pm',
    });
    assert.equal(isValidTimeZone('Not/A_Timezone'), false);
  });
});
