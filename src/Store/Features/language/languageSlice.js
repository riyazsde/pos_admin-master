// src/Store/Features/language/languageSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { languageService } from '../../../Services/apiService';

// ---------------------------------------------------------------------------
// Language name → i18n code
// ---------------------------------------------------------------------------
export const NAME_TO_CODE = {
  English: 'en',
  French: 'fr',
  Arabic: 'ar',
  Spanish: 'es',
};

export const CODE_TO_NAME = {
  en: 'English',
  fr: 'French',
  ar: 'Arabic',
  es: 'Spanish',
};

/**
 * Case-insensitive name → code resolver
 */
export const getCodeForLanguage = (name) => {
  if (!name) return 'en';
  if (NAME_TO_CODE[name]) return NAME_TO_CODE[name];

  const key = Object.keys(NAME_TO_CODE).find(
    (k) => k.toLowerCase() === String(name).toLowerCase().trim()
  );
  return key ? NAME_TO_CODE[key] : 'en';
};

/**
 * Reverse: code → display name
 */
export const getNameForCode = (code) => {
  if (!code) return 'English';
  return CODE_TO_NAME[code] || 'English';
};

// ---------------------------------------------------------------------------
// Initial state (reads from localStorage)
// ---------------------------------------------------------------------------
const storedCode = localStorage.getItem('admin_language') || 'en';

const initialState = {
  languages: [],
  currentCode: storedCode,
  currentName: getNameForCode(storedCode),
  loading: false,
  hasLoaded: false,
  error: null,
};

// ---------------------------------------------------------------------------
// Async thunk
// ---------------------------------------------------------------------------
export const fetchLanguages = createAsyncThunk(
  'language/fetchLanguages',
  async (_, { rejectWithValue }) => {
    try {
      return await languageService.getAllLanguages();
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to load languages'
      );
    }
  }
);

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------
const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguageCode: (state, action) => {
      const { code, name } = action.payload;
      const resolvedName = name || getNameForCode(code);

      state.currentCode = code;
      state.currentName = resolvedName;

      localStorage.setItem('admin_language', code);

      console.log('✅ Language set:', { code, name: resolvedName }); // debug
    },
    resetLanguages: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLanguages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLanguages.fulfilled, (state, action) => {
        state.languages = action.payload?.data || [];
        state.hasLoaded = true;
        state.loading = false;

        console.log('✅ Languages loaded:', state.languages.map((l) => l.Language_name)); // debug

        // Sync display name with current code
        const match = state.languages.find(
          (l) => getCodeForLanguage(l.Language_name) === state.currentCode
        );
        if (match) {
          state.currentName = match.Language_name;
        } else {
          state.currentName = getNameForCode(state.currentCode);
        }
      })
      .addCase(fetchLanguages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setLanguageCode, resetLanguages } = languageSlice.actions;
export default languageSlice.reducer;