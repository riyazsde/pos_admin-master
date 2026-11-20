import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getMdmBindings } from './posDeviceBinding.js';

describe('POS device MDM bindings', () => {
  it('matches a unique inventory row by record ID and case-insensitive serial', () => {
    const inventory = [{ MyDevices_id: 12, Serial_Number: 'pos-a1' }];
    const mdm = [{ MyDevices_id: '12', Serial_Number: 'POS-A1' }];

    assert.deepEqual(getMdmBindings(inventory, mdm), [{ status: 'matched' }]);
  });

  it('reports an ID match with a different serial as a mismatch', () => {
    const inventory = [{ MyDevices_id: 12, Serial_Number: 'POS-A1' }];
    const mdm = [{ MyDevices_id: 12, Serial_Number: 'POS-B2' }];

    assert.deepEqual(getMdmBindings(inventory, mdm), [
      { status: 'mismatch', mdmId: 12, mdmSerial: 'POS-B2' },
    ]);
  });

  it('does not verify missing identities, un-enrolled devices, or ambiguous duplicates', () => {
    assert.deepEqual(
      getMdmBindings(
        [
          { MyDevices_id: 12, Serial_Number: '' },
          { MyDevices_id: 13, Serial_Number: 'POS-C3' },
          { MyDevices_id: 14, Serial_Number: 'POS-D4' },
        ],
        [
          { MyDevices_id: 14, Serial_Number: 'POS-D4' },
          { MyDevices_id: 14, Serial_Number: 'POS-D4' },
        ]
      ),
      [
        { status: 'missingIdentity' },
        { status: 'notEnrolled' },
        { status: 'mismatch', mdmId: 14, mdmSerial: 'POS-D4' },
      ]
    );
  });

  it('marks binding unavailable when the MDM list could not be loaded', () => {
    assert.deepEqual(
      getMdmBindings([{ MyDevices_id: 12, Serial_Number: 'POS-A1' }], null),
      [{ status: 'unavailable' }]
    );
  });
});
