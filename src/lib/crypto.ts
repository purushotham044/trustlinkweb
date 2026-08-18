// ============================================================
// TrustLink Web — Browser Cryptographic Utilities
// Computes deterministic SHA-256 digests via Web Crypto API
// ============================================================

export async function computeFileSha256(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function truncateTxHash(tx: string, prefix = 6, suffix = 4): string {
  if (!tx || tx.length <= prefix + suffix + 2) return tx;
  return `${tx.slice(0, prefix)}...${tx.slice(-suffix)}`;
}
