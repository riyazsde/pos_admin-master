export const findSubscriptionById = (subscriptions, subscriptionId) => {
  if (
    !Array.isArray(subscriptions) ||
    subscriptionId === null ||
    subscriptionId === undefined
  ) {
    return null;
  }

  return (
    subscriptions.find(
      (subscription) =>
        String(subscription?.Subscription_id) === String(subscriptionId)
    ) || null
  );
};

export const calculateEarlyTerminationFee = (
  monthlyAmount,
  contractMonths,
  percentage
) => {
  if (
    monthlyAmount === null ||
    monthlyAmount === undefined ||
    monthlyAmount === '' ||
    contractMonths === null ||
    contractMonths === undefined ||
    contractMonths === '' ||
    percentage === null ||
    percentage === undefined ||
    percentage === ''
  ) {
    return null;
  }

  const amount = Number(monthlyAmount);
  const months = Number(contractMonths);
  const rate = Number(percentage);

  if (
    !Number.isFinite(amount) ||
    !Number.isFinite(months) ||
    !Number.isFinite(rate) ||
    amount < 0 ||
    months < 0 ||
    rate < 0
  ) {
    return null;
  }

  return Math.round(amount * months * (rate / 100) * 100) / 100;
};

export const getSubscriptionDetailsData = (subscription) => {
  const plan = subscription?.Plan || {};
  const billingHistory = subscription?.Billing_History ?? subscription?.billingHistory;
  const contractMonthlyAmount =
    subscription?.Amount ??
    subscription?.Monthly_Amount ??
    subscription?.Subscription_Amount ??
    plan.Price ??
    null;

  return {
    businessName:
      subscription?.Business_Name ??
      subscription?.Client?.Business_Name ??
      subscription?.Client_id?.Business_Name ??
      '—',
    planName: plan.PlanName ?? '—',
    planType: plan.Subscription_Type ?? '—',
    contractMonthlyAmount,
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
