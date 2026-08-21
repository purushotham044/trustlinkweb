import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Auth Provider
import { AuthProvider } from '@/context/AuthContext';

// Layout & Guards
import { PrivateRoute } from '@/components/layout/PrivateRoute';

// Public Pages
import { HomePage } from '@/pages/HomePage';
import { FeaturesPage } from '@/pages/FeaturesPage';
import { SecurityPage } from '@/pages/SecurityPage';
import { HowItWorksPage } from '@/pages/HowItWorksPage';
import { VerificationPage } from '@/pages/VerificationPage';
import { SharingPage } from '@/pages/SharingPage';
import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';

// Auth Pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { AuthCallbackPage } from '@/pages/auth/AuthCallbackPage';

// Authenticated Pages
import { DashboardPage } from '@/pages/app/DashboardPage';
import { VaultPage } from '@/pages/app/VaultPage';
import { DocumentDetailPage } from '@/pages/app/DocumentDetailPage';
import { SharePage } from '@/pages/app/SharePage';
import { ActivityPage } from '@/pages/app/ActivityPage';
import { ProfilePage } from '@/pages/app/ProfilePage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Marketing & Demo Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/verify" element={<VerificationPage />} />
          <Route path="/sharing" element={<SharingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />

          {/* Root App Redirect */}
          <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />

          {/* Authenticated Application Routes */}
          <Route
            path="/app/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/app/vault"
            element={
              <PrivateRoute>
                <VaultPage />
              </PrivateRoute>
            }
          />
          {/* Support both /app/documents/:id and /app/vault/:id */}
          <Route
            path="/app/documents/:id"
            element={
              <PrivateRoute>
                <DocumentDetailPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/app/vault/:id"
            element={
              <PrivateRoute>
                <DocumentDetailPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/app/sharing"
            element={
              <PrivateRoute>
                <SharePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/app/activity"
            element={
              <PrivateRoute>
                <ActivityPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/app/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
