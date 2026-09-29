import React from 'react'
import Sign from './Views/Sign/Sign'
import ForgotPassword from './Components/SignIn/ForgotPassword'
import AppRoutes from './Views/AppRoutes/AppRoutes'
import { Toaster, toast } from 'sonner';

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
      />note
      <AppRoutes />
    </div>
  )
}

export default App