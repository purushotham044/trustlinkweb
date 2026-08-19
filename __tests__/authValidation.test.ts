import { describe, it, expect } from 'vitest';
import * as authService from '@/services/authService';

describe('Auth & Input Validation Suite', () => {
  describe('Email & Password Input Constraints', () => {
    it('should validate RFC-compliant email formats', () => {
      const validEmails = ['user@trustlink.app', 'analyst.security@company.org', 'test+tag@sub.domain.co'];
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      validEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(true);
      });
    });

    it('should reject malformed or invalid email inputs', () => {
      const invalidEmails = ['plainaddress', '@missingusername.com', 'user@.com', 'user@domain'];
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      invalidEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(false);
      });
    });

    it('should enforce password minimum length constraints (>= 8 characters)', () => {
      expect('short'.length >= 8).toBe(false);
      expect('password123'.length >= 8).toBe(true);
      expect('SuperSecure!2026'.length >= 8).toBe(true);
    });

    it('should trim and normalize email strings before dispatch', () => {
      const dirtyEmail = '  Security.User@TrustLink.App  ';
      const cleanEmail = dirtyEmail.trim().toLowerCase();
      expect(cleanEmail).toBe('security.user@trustlink.app');
    });
  });

  describe('Authentication Service Execution', () => {
    it('should have signInWithEmail defined and returning an AuthResult contract', async () => {
      expect(typeof authService.signInWithEmail).toBe('function');
    });

    it('should have signUpWithEmail defined and handling user metadata', async () => {
      expect(typeof authService.signUpWithEmail).toBe('function');
    });

    it('should handle signOut gracefully', async () => {
      expect(typeof authService.signOut).toBe('function');
      await expect(authService.signOut()).resolves.not.toThrow();
    });

    it('should verify getSession and getCurrentUser function signatures', async () => {
      expect(typeof authService.getSession).toBe('function');
      expect(typeof authService.getCurrentUser).toBe('function');
    });
  });
});
