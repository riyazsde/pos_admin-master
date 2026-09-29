// src/Utils/authStorage.js

const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const EXP_KEY = 'tokenExp';

/**
 * Get the auth token from either localStorage or sessionStorage.
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
};

/**
 * Get the stored user object.
 */
export const getUser = () => {
  const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * Get the token expiry timestamp (ms).
 */
export const getTokenExp = () => {
  const val = localStorage.getItem(EXP_KEY) || sessionStorage.getItem(EXP_KEY);
  return val ? Number(val) : null;
};

/**
 * Check if the user is authenticated.
 * Optionally verifies the token has not expired.
 */
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  const exp = getTokenExp();
  if (exp && Date.now() > exp) {
    clearAuth();
    return false;
  }

  return true;
};

/**
 * Save token + user to the correct storage.
 * @param {string} token
 * @param {object} user
 * @param {boolean} rememberMe - true → localStorage, false → sessionStorage
 */
export const saveAuth = (token, user, rememberMe = false) => {
  clearAuth(); // Wipe both first to avoid stale data

  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(TOKEN_KEY, token);
  storage.setItem(USER_KEY, JSON.stringify(user ?? {}));

  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    if (decoded?.exp) {
      storage.setItem(EXP_KEY, String(decoded.exp * 1000));
    }
  } catch (e) {
    console.warn('Could not decode token expiry', e);
  }
};

/**
 * Clear auth data from BOTH storages.
 */
export const clearAuth = () => {
  [localStorage, sessionStorage].forEach((storage) => {
    storage.removeItem(TOKEN_KEY);
    storage.removeItem(USER_KEY);
    storage.removeItem(EXP_KEY);
  });
};