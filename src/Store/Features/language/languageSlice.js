import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { languageService } from '../../../Services/apiService';

// Map backend Language_name → i18n code
const NAME_TO_CODE = {
  English: 'en',
  French: 'fr',
  Arabic: 'ar',
  Spanish: 'es',
};

const storedCode = localStorage.getItem('admin_language') || 'en';

const initialState = {
  languages: [],
  currentCode: storedCode,
  currentName: 'English',
  loading: false,
  hasLoaded: false,
  error: null,
};

export const fetchLanguages = createAsyncThunk(
  'language/fetchLanguages',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLanguagesLoading(true));
      const { data } = await languageService.getAllLanguages();
      dispatch(setLanguagesData({ data }));
      return data;
    } catch (err) {
      const msg = err?.message || 'Failed to load languages';
      dispatch(setLanguagesError(msg));
      return rejectWithValue(msg);
    }
  }
);

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguagesLoading: (state, action) => {
      state.loading = action.payload;
    },
    setLanguagesData: (state, action) => {
      state.languages = action.payload.data || [];
      state.hasLoaded = true;
      state.loading = false;
      state.error = null;

      const match = state.languages.find(
        (l) => NAME_TO_CODE[l.Language_name] === state.currentCode
      );
      if (match) state.currentName = match.Language_name;
    },
    setLanguageCode: (state, action) => {
      const { code, name } = action.payload;
      state.currentCode = code;
      state.currentName = name;
      localStorage.setItem('admin_language', code);
    },
    setLanguagesError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    resetLanguages: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLanguages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLanguages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setLanguagesLoading,
  setLanguagesData,
  setLanguageCode,
  setLanguagesError,
  resetLanguages,
} = languageSlice.actions;

export { NAME_TO_CODE };
export default languageSlice.reducer;