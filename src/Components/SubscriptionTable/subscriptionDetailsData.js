export const getSubscriptionDetailsData = (subscription) => {
  const plan = subscription?.Plan || {};
  const billingHistory = subscription?.Billing_History ?? subscription?.billingHistory;

  return {
    businessName:
      subscription?.Business_Name ??
      subscription?.Client?.Business_Name ??
      subscription?.Client_id?.Business_Name ??
      '—',
    planName: plan.PlanName ?? '—',
    planType: plan.Subscription_Type ?? '—',
    planPrice: plan.Price ?? null,
    purchaseDate: subscription?.Purchase_Date ?? null,
    renewalDate: subscription?.Renewal_Date ?? null,
    nextBillingDate:
      subscription?.Next_Billing_Date ??
      subscription?.NextBillingDate ??
      null,
    contractEndDate: subscription?.Contract_End_Date ?? null,
    renewalCount:
      subscription?.Renewal_Count ??
      subscription?.No_Of_Renewals ??
      null,
    deviceCount: subscription?.Device_Count ?? null,
    depositAmount: subscription?.Deposit_Amount ?? null,
    depositStatus: subscription?.Deposit_Status ?? null,
    contractStatus:
      subscription?.Contract_Status ??
      subscription?.Subscription_Status ??
      null,
    paymentMethod:
      subscription?.Mode_Of_Payment ??
      subscription?.Payment_Method ??
      subscription?.PaymentMethod ??
      '—',
    paymentStatus:
      subscription?.Payment_Status ??
      subscription?.PaymentStatus ??
      null,
    transactionReference:
      subscription?.Transaction_Reference ??
      subscription?.TransactionReference ??
      '—',
    billingHistory: Array.isArray(billingHistory) ? billingHistory : [],
  };
};
