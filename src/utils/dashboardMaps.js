// src/Utils/dashboardMaps.js

// Admin plan ID → human-readable name
export const PLAN_MAP = {
  1: { name: '3 Months Plan', amount: 460,  currency: 'XOF' },
  2: { name: '6 Months Plan', amount: 840,  currency: 'XOF' },
  3: { name: '1 Year Plan',   amount: 1060, currency: 'XOF' },
  4: { name: '1 Year Plan',   amount: 1060, currency: 'XOF' },
};

export const getPlanInfo = (planId) => {
  return PLAN_MAP[planId] || { name: 'Unknown Plan', amount: 0, currency: 'XOF' };
};

// City ID → city name (⚠️ placeholder — get real names from backend)
export const CITY_MAP = {
  1: 'Johannesburg',
  2: 'Cairo',
  3: 'Cape Town',
  4: 'Nairobi',
  5: 'Lagos',
  // Add more as your backend returns them
};

export const getCityName = (cityId) => {
  if (cityId === null || cityId === undefined) return 'Unknown';
  return CITY_MAP[cityId] || `City #${cityId}`;
};

// Fixed color palette for pie slices
export const SLICE_COLORS = [
  '#525B7A',
  '#FF7A1A',
  '#2563EB',
  '#FF00FF',
  '#10B981',
  '#F59E0B',
  '#8B5CF6',
  '#EF4444',
];