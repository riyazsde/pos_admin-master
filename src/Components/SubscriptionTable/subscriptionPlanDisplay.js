export const isBundleSubscriptionCategory = (
  subscriptionType,
  fallbackType
) => (subscriptionType ?? fallbackType) === 'SaaS + Hardware';
