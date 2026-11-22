export const isBundleSubscriptionCategory = (subscriptionType) =>
  String(subscriptionType ?? '').trim().toLowerCase() === 'saas + hardware';
