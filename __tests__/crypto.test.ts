import { describe, it, expect } from 'vitest';
import { computeFileSha256, truncateTxHash } from '@/lib/crypto';

describe('Cryptographic Module — SHA-256 & Hash Formatting', () => {
  it('should compute valid 64-character hexadecimal SHA-256 digest for a text file', async () => {
    const file = new File(['Hello TrustLink Document Integrity'], 'test.txt', { type: 'text/plain' });
    const hash = await computeFileSha256(file);
    expect(hash).toHaveLength(64);
    expect(/^[0-9a-f]{64}$/.test(hash)).toBe(true);
  });

  it('should be deterministic: identical files must produce identical SHA-256 hashes', async () => {
    const file1 = new File(['Same Content Buffer 12345'], 'doc1.pdf', { type: 'application/pdf' });
    const file2 = new File(['Same Content Buffer 12345'], 'doc2.pdf', { type: 'application/pdf' });
    const hash1 = await computeFileSha256(file1);
    const hash2 = await computeFileSha256(file2);
    expect(hash1).toBe(hash2);
  });

  it('should detect single-bit modification (Avalanche effect): different content produces completely distinct hash', async () => {
    const original = new File(['Confidential Agreement v1.0'], 'contract.pdf', { type: 'application/pdf' });
    const tampered = new File(['Confidential Agreement v1.1'], 'contract.pdf', { type: 'application/pdf' });
    const hashOrig = await computeFileSha256(original);
    const hashTamp = await computeFileSha256(tampered);
    expect(hashOrig).not.toBe(hashTamp);
    expect(hashOrig).toHaveLength(64);
    expect(hashTamp).toHaveLength(64);
  });

  it('should compute hash for empty file correctly', async () => {
    const emptyFile = new File([''], 'empty.txt', { type: 'text/plain' });
    const hash = await computeFileSha256(emptyFile);
    // Standard SHA-256 for empty string is e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
    expect(hash).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });

  it('should compute hash for binary buffers (e.g. simulated images / PDFs)', async () => {
    const binaryData = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00]);
    const file = new File([binaryData], 'sample.png', { type: 'image/png' });
    const hash = await computeFileSha256(file);
    expect(hash).toHaveLength(64);
    expect(/^[0-9a-f]{64}$/.test(hash)).toBe(true);
  });

  it('should properly truncate Ethereum transaction hashes with standard prefix and suffix', () => {
    const tx = '0x8A3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b';
    const truncated = truncateTxHash(tx, 6, 4);
    expect(truncated).toBe('0x8A3b...0a1b');
  });

  it('should handle short transaction strings gracefully without over-truncating', () => {
    const shortTx = '0x1234';
    expect(truncateTxHash(shortTx)).toBe('0x1234');
    expect(truncateTxHash('')).toBe('');
  });
});
