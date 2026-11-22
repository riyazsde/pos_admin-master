import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  findSubscriptionById,
  getSubscriptionDetailsData,
} from './subscriptionDetailsData.js';

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

  it('resolves detail context from the selected subscription ID', () => {
    const subscriptions = [
      {
        Subscription_id: 25,
        Business_Name: 'HARI Bars',
        Mode_Of_Payment: 'Stripe',
        Transaction_Reference: 'HARI-TX',
        Amount: 1234,
        Plan: {
          PlanName: 'TRIAXX-AUDIT-20261022',
          Subscription_Type: 'SaaS Only',
          Price: 1234,
        },
      },
      {
        Subscription_id: 65,
        Business_Name: 'riyaz',
        Mode_Of_Payment: 'Stripe',
        Transaction_Reference: 'RIYAZ-TX',
        Amount: 69.99,
        Plan: {
          PlanName: 'Pro + HW',
          Subscription_Type: 'SaaS + Hardware',
          Price: 69.99,
        },
      },
      {
        Subscription_id: 19,
        Business_Name: 'Restaurant Beef Cairo',
        Transaction_Reference: 'TEMPLATE-TX',
        Billing_History: [{ Transaction_Reference: 'TEMPLATE-TX' }],
        Plan: { PlanName: 'Starter', Price: 29 },
      },
    ];

    const hariDetails = getSubscriptionDetailsData(
      findSubscriptionById(subscriptions, 25)
    );
    const riyazDetails = getSubscriptionDetailsData(
      findSubscriptionById(subscriptions, '65')
    );

    assert.equal(hariDetails.businessName, 'HARI Bars');
    assert.equal(hariDetails.planName, 'TRIAXX-AUDIT-20261022');
    assert.equal(hariDetails.transactionReference, 'HARI-TX');
    assert.deepEqual(hariDetails.billingHistory, []);
    assert.equal(riyazDetails.businessName, 'riyaz');
    assert.equal(riyazDetails.planName, 'Pro + HW');
    assert.equal(riyazDetails.transactionReference, 'RIYAZ-TX');
    assert.deepEqual(riyazDetails.billingHistory, []);
  });
});
