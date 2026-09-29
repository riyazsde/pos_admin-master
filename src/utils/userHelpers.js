// src/Utils/userHelpers.js

/**
 * Format a date string into "MMM DD, YYYY" (e.g., "Aug 24, 2026").
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'N/A';
  }
};

/**
 * Get the full name from a Redux user object.
 */
export const getFullName = (user) => {
  if (!user) return 'Guest';
  const parts = [user.Name, user.last_name].filter(Boolean);
  return parts.length ? parts.join(' ') : 'Guest';
};

/**
 * Get the user's role name.
 */
export const getRoleName = (user) => {
  return user?.Role_id?.role_name || 'User';
};

/**
 * Get the user's responsibility.
 */
export const getResponsibility = (user) => {
  return user?.Responsibility_id?.Responsibility_name || '';
};

/**
 * Get a readable location string.
 * Prefers: City, State, Country — falls back gracefully.
 */
export const getLocation = (user) => {
  if (!user) return 'N/A';
  const city = user.City_id?.City_name;
  const state = user.State_id?.state_name;
  const country = user.Country_id?.Country_name;
  const parts = [city, state, country].filter(Boolean);
  return parts.length ? parts.join(', ') : 'N/A';
};

/**
 * Get avatar URL (with fallback).
 */
export const getAvatar = (user, fallback) => {
  return user?.user_image || fallback;
};

/**
 * Get initials for avatar fallback.
 */
export const getInitials = (user) => {
  if (!user) return '?';
  const first = user.Name?.[0] || '';
  const last = user.last_name?.[0] || '';
  return (first + last).toUpperCase() || '?';
};