// src/App.jsx

import React from 'react';
import { Toaster } from 'sonner';
import AppRoutes from './Views/AppRoutes/AppRoutes';

function App() {
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