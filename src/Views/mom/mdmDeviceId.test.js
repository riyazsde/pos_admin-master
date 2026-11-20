import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getNumericMdmDeviceId } from './mdmDeviceId.js';

describe('MDM device command identifiers', () => {
  it('returns the numeric MyDevices_id', () => {
    assert.equal(getNumericMdmDeviceId({ MyDevices_id: 12 }), 12);
    assert.equal(getNumericMdmDeviceId({ MyDevices_id: '12' }), 12);
  });

  it('rejects display labels and invalid identifiers', () => {
    assert.equal(getNumericMdmDeviceId({ MyDevices_id: 'DEV-012' }), null);
    assert.equal(getNumericMdmDeviceId({ MyDevices_id: '12.5' }), null);
    assert.equal(getNumericMdmDeviceId({}), null);
  });
});
