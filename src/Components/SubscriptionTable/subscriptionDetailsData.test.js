import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getSubscriptionDetailsData } from './subscriptionDetailsData.js';

describe('subscription detail context', () => {
  it('derives customer, plan, and payment context from the selected record', () => {
    const details = getSubscriptionDetailsData({
      Business_Name: 'HARI Bars',
      Mode_Of_Payment: 'Bank transfer',
      Transaction_Reference: 'TX-101',
      Plan: {
        PlanName: 'Audit Plan',
        Subscription_Type: 'SaaS',
        Price: 125,
      },
    });

    assert.equal(details.businessName, 'HARI Bars');
    assert.equal(details.planName, 'Audit Plan');
    assert.equal(details.planType, 'SaaS');
    assert.equal(details.planPrice, 125);
    assert.equal(details.paymentMethod, 'Bank transfer');
    assert.equal(details.transactionReference, 'TX-101');
    assert.deepEqual(details.billingHistory, []);
  });

  it('uses only billing rows attached to the selected subscription', () => {
    const billingHistory = [{ Transaction_Reference: 'TX-202' }];
    const details = getSubscriptionDetailsData({
      Business_Name: 'riyaz',
      Plan: { PlanName: 'Pro+HW' },
      Billing_History: billingHistory,
    });

    assert.equal(details.businessName, 'riyaz');
    assert.equal(details.planName, 'Pro+HW');
    assert.equal(details.billingHistory, billingHistory);
    assert.deepEqual(
      getSubscriptionDetailsData({ Plan: { PlanName: 'Other plan' } }).billingHistory,
      []
    );
  });
});
