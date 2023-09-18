import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import i18n from 'src/locales/i18n'
import App from 'src/App'
import { I18nextProvider } from 'react-i18next'
import 'react-lazy-load-image-component/src/effects/blur.css'
import 'react-lazy-load-image-component/src/effects/opacity.css'
import 'react-lazy-load-image-component/src/effects/black-and-white.css'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import { SettingsProvider } from './contexts/SettingsContext'
import { CollapseDrawerProvider } from './contexts/CollapseDrawerContext'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AuthProvider } from 'src/contexts/Auth'
// redux

import { LocalizationProvider } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'

const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>

    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <HelmetProvider>

          <QueryClientProvider client={queryClient}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <SettingsProvider>
                <CollapseDrawerProvider>
                  <BrowserRouter>
                    <App/>
                  </BrowserRouter>
                </CollapseDrawerProvider>
              </SettingsProvider>
            </LocalizationProvider>
          </QueryClientProvider>
        </HelmetProvider>
      </AuthProvider>
    </I18nextProvider>

  </StrictMode>
)
