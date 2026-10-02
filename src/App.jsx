// src/App.jsx

import React,{useEffect} from 'react';
import { Toaster } from 'sonner';
import AppRoutes from './Views/AppRoutes/AppRoutes';
import { fetchLanguages } from './Store/Features/language/languageSlice';
import { useAppDispatch } from './Store/hooks';

function App() {
    const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchLanguages());
  }, [dispatch]);
  return (
    <div>
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={3000}
        toastOptions={{
          style: {
            zIndex: 9999,
          },
        }}
      />
      <AppRoutes />
    </div>
  );
}

export default App;