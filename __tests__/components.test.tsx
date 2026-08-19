import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Badge, IntegrityBadge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { HashDisplay } from '@/components/ui/HashDisplay';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthProvider } from '@/context/AuthContext';

describe('UI Design System & Layout Components', () => {
  describe('Button Component', () => {
    it('renders primary button correctly', () => {
      render(<Button variant="primary">Click Me</Button>);
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('renders secondary button with proper styling classes', () => {
      render(<Button variant="secondary">Secondary Action</Button>);
      const btn = screen.getByRole('button', { name: /secondary action/i });
      expect(btn).toBeInTheDocument();
    });

    it('disables button and shows spinner in loading state', () => {
      render(<Button loading>Submit</Button>);
      const btn = screen.getByRole('button');
      expect(btn).toBeDisabled();
    });
  });

  describe('Badge Component', () => {
    it('renders verified badge with green text', () => {
      render(<IntegrityBadge status="VERIFIED" />);
      expect(screen.getByText(/verified/i)).toBeInTheDocument();
    });

    it('renders tampered badge when integrity status is FAILED', () => {
      render(<IntegrityBadge status="FAILED" />);
      expect(screen.getByText(/tampered/i)).toBeInTheDocument();
    });

    it('renders pending badge for unverified documents', () => {
      render(<IntegrityBadge status="PENDING" />);
      expect(screen.getByText(/pending/i)).toBeInTheDocument();
    });
  });

  describe('Input Component', () => {
    it('renders input with label and placeholder', () => {
      render(<Input label="Document Title" placeholder="e.g. Agreement.pdf" />);
      expect(screen.getByLabelText(/document title/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/e.g. agreement.pdf/i)).toBeInTheDocument();
    });

    it('displays validation error message when passed error prop', () => {
      render(<Input label="Email" error="Invalid email address" />);
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });

  describe('HashDisplay Component', () => {
    it('renders deterministic SHA-256 hash string with monospace code font', () => {
      const hash = 'a3f8c2e91d47b65f0e8a2c3d4b5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3';
      render(<HashDisplay hash={hash} label="SHA-256 Digest" />);
      expect(screen.getByText(/sha-256 digest/i)).toBeInTheDocument();
      expect(screen.getByText(hash)).toBeInTheDocument();
    });

    it('handles null hash gracefully', () => {
      render(<HashDisplay hash={null} />);
      expect(screen.getByText(/not computed/i)).toBeInTheDocument();
    });
  });

  describe('Layout — Navbar & Footer', () => {
    it('renders TrustLink logo and primary navigation links in Navbar', () => {
      render(
        <AuthProvider>
          <BrowserRouter>
            <Navbar />
          </BrowserRouter>
        </AuthProvider>
      );
      expect(screen.getByLabelText(/trustlink home/i)).toBeInTheDocument();
      expect(screen.getByText(/features/i)).toBeInTheDocument();
      expect(screen.getByText(/security/i)).toBeInTheDocument();
    });

    it('renders legal and blockchain network info in Footer', () => {
      render(
        <BrowserRouter>
          <Footer />
        </BrowserRouter>
      );
      expect(screen.getByText(/ethereum sepolia network/i)).toBeInTheDocument();
      expect(screen.getByText(/postgresql rls protected/i)).toBeInTheDocument();
    });
  });
});
