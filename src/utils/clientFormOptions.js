// src/Utils/clientFormOptions.js

// ⚠️ These IDs must match your backend
export const LANGUAGE_OPTIONS = [
  { id: 1, label: 'French' },
  { id: 2, label: 'English' },
  { id: 3, label: 'Arabic' },
  { id: 4, label: 'Spanish' },
];

export const CURRENCY_OPTIONS = [
  { id: 1, label: 'XOF', icon: 'CFA' },
  { id: 2, label: 'EUR', icon: '€' },
  { id: 3, label: 'USD', icon: '$' },
  { id: 4, label: 'GBP', icon: '£' },
];

export const TYPE_OPTIONS = ['Restaurant', 'Cafe', 'Bar', 'Cloud Kitchen'];

export const TIMEZONE_OPTIONS = [
  'Africa/Cairo',
  'Africa/Abidjan',
  'Africa/Lagos',
  'Asia/Kolkata',
  'Europe/Paris',
  'America/New_York',
];

export const PLAN_OPTIONS = ['Starter', 'Professional', 'Enterprise'];
export const BILLING_OPTIONS = ['Monthly', 'Quarterly', 'Yearly'];
export const TRIAL_DURATION_OPTIONS = ['7 days', '14 days', '30 days', 'No Trial'];
export const SUPPORT_TIER_OPTIONS = ['Basic', 'Standard', 'Premium 24/7'];

export const MOBILE_MONEY_OPTIONS = [
  'Orange Money',
  'MTN Money',
  'Moov Money',
  'Wave',
  'M-Pesa',
];

export const PAYMENT_METHOD_OPTIONS = [
  'Cash',
  'Mobile Money',
  'Bank POS Terminal',
  'QR Payment',
  'Card',
];

export const OPERATIONAL_CONFIG_OPTIONS = [
  'Table Service',
  'Delivery',
  'Takeaway',
  'Multi-Location Management',
  'Kitchen Display System',
  'Online Ordering',
];