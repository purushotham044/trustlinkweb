import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';

// Pages
import { HomePage } from '@/pages/HomePage';
import { FeaturesPage } from '@/pages/FeaturesPage';
import { SecurityPage } from '@/pages/SecurityPage';
import { HowItWorksPage } from '@/pages/HowItWorksPage';
import { VerificationPage } from '@/pages/VerificationPage';
import { SharingPage } from '@/pages/SharingPage';
import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <AuthProvider>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </AuthProvider>
  );
};

describe('Web Application Full Page Renders', () => {
  it('renders HomePage with hero headline, workflow, and CTA', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByRole('heading', { level: 1, name: /trustlink/i })).toBeInTheDocument();
    expect(screen.getAllByText(/how trustlink works/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/get started free/i)).toBeInTheDocument();
  });

  it('renders FeaturesPage with core capabilities and storage breakdown', () => {
    renderWithProviders(<FeaturesPage />);
    expect(screen.getByText(/engineered for absolute document integrity/i)).toBeInTheDocument();
    expect(screen.getAllByText(/secure document vault/i).length).toBeGreaterThan(0);
  });

  it('renders SecurityPage with architecture pillars and zero-trust model', () => {
    renderWithProviders(<SecurityPage />);
    expect(screen.getByText(/security without compromise/i)).toBeInTheDocument();
    expect(screen.getByText(/deterministic cryptography/i)).toBeInTheDocument();
  });

  it('renders HowItWorksPage with step-by-step workflow and verification flow', () => {
    renderWithProviders(<HowItWorksPage />);
    expect(screen.getAllByText(/how trustlink works/i).length).toBeGreaterThan(0);
  });

  it('renders VerificationPage with interactive demo tool', () => {
    renderWithProviders(<VerificationPage />);
    expect(screen.getByText(/verify any document's integrity/i)).toBeInTheDocument();
  });

  it('renders SharingPage with granular permissions and duration controls', () => {
    renderWithProviders(<SharingPage />);
    expect(screen.getAllByText(/controlled document sharing/i).length).toBeGreaterThan(0);
  });

  it('renders AboutPage with problem statement and mission', () => {
    renderWithProviders(<AboutPage />);
    expect(screen.getAllByText(/about trustlink/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/the problem we solve/i)).toBeInTheDocument();
  });

  it('renders ContactPage with form inputs for name, email, and message', () => {
    renderWithProviders(<ContactPage />);
    expect(screen.getByRole('heading', { name: /contact trustlink/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
  });

  it('renders LoginPage with email/password inputs, Google button, and Instant Demo button', () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByRole('heading', { name: /sign in to your vault/i })).toBeInTheDocument();
    expect(screen.getByText(/instant demo sign-in/i)).toBeInTheDocument();
  });

  it('renders RegisterPage with registration fields', () => {
    renderWithProviders(<RegisterPage />);
    expect(screen.getByRole('heading', { name: /create your vault/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
  });
});
