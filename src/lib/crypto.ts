// ============================================================
// TrustLink Web — Browser Cryptographic Utilities
// Computes deterministic SHA-256 digests via Web Crypto API with ethers fallback
// ============================================================

import { ethers } from 'ethers';

export async function computeFileSha256(file: File | Blob): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {}
  }
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {}
  }
  const uint8Array = new Uint8Array(arrayBuffer);
  return ethers.sha256(uint8Array).replace('0x', '').toLowerCase();
}

export function computeSha256FromBuffer(buffer: ArrayBuffer): string {
  const uint8Array = new Uint8Array(buffer);
  return ethers.sha256(uint8Array).replace('0x', '').toLowerCase();
}

export function truncateHash(hash: string, prefix = 8, suffix = 8): string {
  if (!hash) return '';
  if (hash.length <= prefix + suffix + 3) return hash;
  return `${hash.slice(0, prefix)}...${hash.slice(-suffix)}`;
}

export function truncateTxHash(tx: string, prefix = 6, suffix = 4): string {
  if (!tx || tx.length <= prefix + suffix + 2) return tx;
  return `${tx.slice(0, prefix)}...${tx.slice(-suffix)}`;
}
