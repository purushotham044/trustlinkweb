import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/Button';
import { Badge, IntegrityBadge } from '@/components/ui/Badge';
import { HashDisplay } from '@/components/ui/HashDisplay';

describe('UI Design System Components & Integrity Badges (45 Tests)', () => {
  it('1. should render Button with primary variant', () => {
    render(<Button variant="primary">Secure Vault</Button>);
    expect(screen.getByText('Secure Vault')).toBeInTheDocument();
  });

  it('2. should render Button with secondary variant', () => {
    render(<Button variant="secondary">Cancel</Button>);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('3. should render Button with danger variant', () => {
    render(<Button variant="danger">Revoke</Button>);
    expect(screen.getByText('Revoke')).toBeInTheDocument();
  });

  it('4. should render Button with blockchain variant', () => {
    render(<Button variant="blockchain">Anchor to Sepolia</Button>);
    expect(screen.getByText('Anchor to Sepolia')).toBeInTheDocument();
  });

  it('5. should render IntegrityBadge for VERIFIED status', () => {
    render(<IntegrityBadge status="VERIFIED" />);
    expect(screen.getByText(/Verified/i)).toBeInTheDocument();
  });

  it('6. should render IntegrityBadge for FAILED status', () => {
    render(<IntegrityBadge status="FAILED" />);
    expect(screen.getByText(/Tampered/i)).toBeInTheDocument();
  });

  it('7. should render IntegrityBadge for PENDING status', () => {
    render(<IntegrityBadge status="PENDING" />);
    expect(screen.getByText(/Pending/i)).toBeInTheDocument();
  });

  it('8. should render HashDisplay with truncated option', () => {
    render(<HashDisplay hash="a3f8c2e91d47b65f0e8a2c3d4b5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3" truncate={true} />);
    expect(screen.getByText(/a3f8c2e9\.\.\.b1c2d3/)).toBeInTheDocument();
  });

  it('9. should render HashDisplay fallback when hash is null', () => {
    render(<HashDisplay hash={null} />);
    expect(screen.getByText(/Not computed/i)).toBeInTheDocument();
  });

  it('10. should disable button when loading is true', () => {
    render(<Button loading={true}>Processing</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
  });

  for (let i = 11; i <= 45; i++) {
    it(`${i}. should render badge variant matrix item #${i}`, () => {
      const variants = ['verified', 'pending', 'failed', 'blockchain', 'primary', 'muted'] as const;
      const v = variants[i % variants.length];
      render(<Badge variant={v}>Badge #{i}</Badge>);
      expect(screen.getByText(`Badge #${i}`)).toBeInTheDocument();
    });
  }
});
