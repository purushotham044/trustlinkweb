import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Web Crypto API for jsdom if needed
if (!globalThis.crypto) {
  const nodeCrypto = require('crypto');
  globalThis.crypto = {
    subtle: {
      digest: async (_algo: string, data: ArrayBuffer) => {
        const hash = nodeCrypto.createHash('sha256');
        hash.update(Buffer.from(data));
        return hash.digest().buffer;
      }
    }
  } as any;
}
