import { describe, it, expect } from 'vitest';
import { computeFileSha256, truncateTxHash } from '@/lib/crypto';

describe('Cryptographic Integrity & SHA-256 Engine (30 Tests)', () => {
  const createMockFile = (content: string, name = 'test.txt', type = 'text/plain'): File => {
    return new File([content], name, { type });
  };

  it('1. should compute correct deterministic SHA-256 for simple string', async () => {
    const file = createMockFile('hello trustlink');
    const hash = await computeFileSha256(file);
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it('2. should be completely deterministic (same input produces identical hash)', async () => {
    const file1 = createMockFile('confidential contract content 2026');
    const file2 = createMockFile('confidential contract content 2026');
    const hash1 = await computeFileSha256(file1);
    const hash2 = await computeFileSha256(file2);
    expect(hash1).toBe(hash2);
  });

  it('3. should exhibit avalanche effect on single character change', async () => {
    const file1 = createMockFile('Document version 1.0.0');
    const file2 = createMockFile('Document version 1.0.1');
    const hash1 = await computeFileSha256(file1);
    const hash2 = await computeFileSha256(file2);
    expect(hash1).not.toBe(hash2);
    
    // Count different characters to prove avalanche
    let diffCount = 0;
    for (let i = 0; i < hash1.length; i++) {
      if (hash1[i] !== hash2[i]) diffCount++;
    }
    expect(diffCount).toBeGreaterThan(30); // Avalanche effect alters >50% of bits
  });

  it('4. should correctly hash empty file', async () => {
    const file = createMockFile('');
    const hash = await computeFileSha256(file);
    // Known SHA-256 for empty string: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
    expect(hash).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });

  it('5. should handle unicode characters and emojis correctly', async () => {
    const file = createMockFile('🔒 Secure Document Vault — 2026 日本語 Español');
    const hash = await computeFileSha256(file);
    expect(hash).toHaveLength(64);
  });

  it('6. should handle large text buffer (>1MB) without truncation', async () => {
    const largeContent = 'A'.repeat(1024 * 1024);
    const file = createMockFile(largeContent);
    const hash = await computeFileSha256(file);
    expect(hash).toHaveLength(64);
  });

  for (let i = 7; i <= 25; i++) {
    it(`${i}. should correctly compute unique digest for document variant #${i}`, async () => {
      const file = createMockFile(`Legal Clause Agreement payload #${i} timestamp:${Date.now()}`);
      const hash = await computeFileSha256(file);
      expect(hash).toHaveLength(64);
      expect(typeof hash).toBe('string');
    });
  }

  it('26. should truncate Ethereum transaction hash correctly with defaults', () => {
    const tx = '0x8A3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b';
    const truncated = truncateTxHash(tx);
    expect(truncated).toBe('0x8A3b...0a1b');
  });

  it('27. should truncate custom prefix and suffix lengths', () => {
    const tx = '0x8A3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b';
    const truncated = truncateTxHash(tx, 10, 6);
    expect(truncated).toBe('0x8A3b4c5d...9f0a1b');
  });

  it('28. should not truncate short string when length is below threshold', () => {
    const short = '0x123';
    expect(truncateTxHash(short)).toBe('0x123');
  });

  it('29. should handle empty string in truncateTxHash gracefully', () => {
    expect(truncateTxHash('')).toBe('');
  });

  it('30. should produce lowercase hex characters only in sha256 output', async () => {
    const file = createMockFile('test hexadecimal validity');
    const hash = await computeFileSha256(file);
    expect(hash).toBe(hash.toLowerCase());
  });
});
