import React from 'react';
import { RouterProvider } from 'react-router'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import router from './Routes/routes.jsx'
import AuthProvider from './context/auth/AuthProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
