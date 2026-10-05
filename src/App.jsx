// src/App.jsx

import React, { useEffect, useRef } from 'react';
import { Toaster } from 'sonner';
import AppRoutes from './Views/AppRoutes/AppRoutes';
import {
  fetchLanguages,
  setLanguageCode,
  getCodeForLanguage,
} from './Store/Features/language/languageSlice';
import { useAppDispatch, useAppSelector } from './Store/hooks';

function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const languages = useAppSelector((s) => s.language.languages);
  const syncedRef = useRef(false);

  // Fetch languages once
  useEffect(() => {
    dispatch(fetchLanguages());
  }, [dispatch]);

  // ✅ ONE-TIME sync with user's preferred language (only if no saved pick)
  useEffect(() => {
    if (syncedRef.current) return;
    if (!languages.length || !user) return;

    // ❗ If user has already picked a language in this browser, skip sync
    if (localStorage.getItem('admin_language')) {
      syncedRef.current = true;
      return;
    }

    syncedRef.current = true;

    const preferredName = user.Language_id?.Language_name;
    if (!preferredName) return;

    const match = languages.find((l) => l.Language_name === preferredName);
    if (!match) return;

    dispatch(
      setLanguageCode({
        code: getCodeForLanguage(match.Language_name),
        name: match.Language_name,
      })
    );
  }, [languages, user, dispatch]);

  return (
    <div>
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={3000}
        toastOptions={{ style: { zIndex: 9999 } }}
      />
      <AppRoutes />
    </div>
  );
}

export default App;