import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  getPermissionEditValue,
  getPermissionLabelKey,
} from './subadminPermissions.js';

describe('sub-admin permission glossary', () => {
  it('maps legacy MDM values to the MOM permission label', () => {
    assert.equal(getPermissionLabelKey('MDM'), 'subadmin.permissions.momDevice');
    assert.equal(getPermissionLabelKey('MDM Device'), 'subadmin.permissions.momDevice');
    assert.equal(getPermissionEditValue('MDM'), 'mdm device');
  });

  it('maps MOM aliases consistently', () => {
    assert.equal(getPermissionLabelKey('MOM Device'), 'subadmin.permissions.momDevice');
    assert.equal(getPermissionEditValue('mom'), 'mdm device');
  });
});
