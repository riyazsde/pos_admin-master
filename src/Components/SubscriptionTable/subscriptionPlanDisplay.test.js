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

  it('uses the plan category instead of a conflicting selected filter', () => {
    assert.equal(
      isBundleSubscriptionCategory('SaaS Only', 'SaaS + Hardware'),
      false
    );
  });

  it('falls back to the selected category when a plan category is missing', () => {
    assert.equal(isBundleSubscriptionCategory(undefined, 'SaaS + Hardware'), true);
  });
});
