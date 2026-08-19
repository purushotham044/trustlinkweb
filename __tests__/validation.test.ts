import { describe, it, expect } from 'vitest';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES, BLOCKCHAIN_NETWORK, SHARE_EXPIRY_OPTIONS } from '@/lib/constants';

describe('Comprehensive Data Validation & Boundary Test Suite', () => {
  describe('UUID v4 Format Validation', () => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    it('should validate RFC4122 compliant UUID v4 strings', () => {
      const validUUIDs = [
        'c3f1b4a2-9d8e-4a7b-8c6d-5e4f3a2b1c0d',
        'e8a2c3d4-b5e6-4f7a-8b9c-0d1e2f3a4b5c',
        '12345678-1234-4234-8234-123456789abc'
      ];
      validUUIDs.forEach(id => {
        expect(uuidRegex.test(id)).toBe(true);
      });
    });

    it('should reject invalid UUID structures', () => {
      const invalidUUIDs = ['not-a-uuid', '1234-5678', '12345678-1234-5234-8234-123456789abc-extra'];
      invalidUUIDs.forEach(id => {
        expect(uuidRegex.test(id)).toBe(false);
      });
    });
  });

  describe('Blockchain Network & Address Validation', () => {
    it('should connect to configured Ethereum Sepolia network', () => {
      expect(BLOCKCHAIN_NETWORK).toBe('Ethereum Sepolia');
    });

    it('should validate 20-byte (42 character) Ethereum address hex format', () => {
      const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
      const validAddress = '0x1b9A1FBD6FC714B1aC443d00a555529567bd8D0E';
      const invalidAddress = '0x1b9A1FBD6FC714B1aC443d00a55552956';
      expect(ethAddressRegex.test(validAddress)).toBe(true);
      expect(ethAddressRegex.test(invalidAddress)).toBe(false);
    });

    it('should validate 32-byte (66 character) Ethereum transaction hash format', () => {
      const txHashRegex = /^0x[a-fA-F0-9]{64}$/;
      const validTx = '0x8A3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b';
      const invalidTx = '0x8A3b4c5d';
      expect(txHashRegex.test(validTx)).toBe(true);
      expect(txHashRegex.test(invalidTx)).toBe(false);
    });
  });

  describe('Sharing Expiration Boundaries', () => {
    it('should contain all valid share duration options: 1h, 24h, 7d, never', () => {
      const values = SHARE_EXPIRY_OPTIONS.map(o => o.value);
      expect(values).toEqual(['1h', '24h', '7d', 'never']);
    });

    it('should calculate accurate millisecond offsets for expiry', () => {
      const hourOpt = SHARE_EXPIRY_OPTIONS.find(o => o.value === '1h');
      const dayOpt = SHARE_EXPIRY_OPTIONS.find(o => o.value === '24h');
      const weekOpt = SHARE_EXPIRY_OPTIONS.find(o => o.value === '7d');
      const neverOpt = SHARE_EXPIRY_OPTIONS.find(o => o.value === 'never');

      expect(hourOpt?.ms).toBe(3600000);
      expect(dayOpt?.ms).toBe(86400000);
      expect(weekOpt?.ms).toBe(604800000);
      expect(neverOpt?.ms).toBeNull();
    });
  });

  describe('MIME Types & File Boundaries', () => {
    it('should allow major document formats: PDF, DOCX, XLSX, TXT, PNG, JPEG, WEBP', () => {
      const requiredTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/png',
        'image/jpeg',
        'image/webp',
        'text/plain'
      ];
      requiredTypes.forEach(t => {
        expect(ALLOWED_MIME_TYPES).toContain(t);
      });
    });

    it('should reject executable, script, and dangerous extensions', () => {
      const forbidden = ['application/x-dosexec', 'application/javascript', 'application/x-python'];
      forbidden.forEach(f => {
        expect(ALLOWED_MIME_TYPES).not.toContain(f);
      });
    });
  });
});
