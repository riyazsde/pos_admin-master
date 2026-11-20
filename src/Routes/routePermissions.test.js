import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { hasRoutePermission } from './routePermissions.js';

describe('route permissions', () => {
  it('allows administrators without a sub-admin permission list', () => {
    assert.equal(
      hasRoutePermission({ Role_id: { role_name: 'Administrator' } }, 'Reports'),
      true
    );
  });

  it('requires an active matching grant for non-admin users', () => {
    assert.equal(
      hasRoutePermission(
        {
          SubAdmin_Permissions: {
            IsPermissons: [{ type: 'Reports', status: true }],
          },
        },
        'reports'
      ),
      true
    );
    assert.equal(
      hasRoutePermission(
        {
          SubAdmin_Permissions: {
            IsPermissons: [{ type: 'Reports', status: false }],
          },
        },
        'reports'
      ),
      false
    );
    assert.equal(hasRoutePermission({ role: 'Manager' }, 'reports'), false);
  });
});
