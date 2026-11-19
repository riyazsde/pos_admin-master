import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { isBundleSubscriptionCategory } from './subscriptionPlanDisplay.js';

describe('subscription catalog category labels', () => {
  it('does not label the SaaS-only category as a bundle', () => {
    assert.equal(isBundleSubscriptionCategory('SaaS Only'), false);
  });

  it('labels the hardware category as a bundle', () => {
    assert.equal(isBundleSubscriptionCategory('SaaS + Hardware'), true);
  });
});
