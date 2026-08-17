// ============================================================
// TrustLink Web — App Constants
// Mirrors mobile app constants/index.ts
// ============================================================

export const APP_NAME = 'TrustLink';

export const BLOCKCHAIN_NETWORK = 'Ethereum Sepolia';
export const BLOCKCHAIN_EXPLORER_BASE = 'https://sepolia.etherscan.io/tx/';

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB
export const MAX_FILE_SIZE_LABEL = '50 MB';

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/webp',
  'text/plain',
];

export const AUDIT_ACTION_LABELS: Record<string, string> = {
  DOCUMENT_UPLOADED: 'Document uploaded',
  DOCUMENT_VIEWED: 'Document viewed',
  DOCUMENT_DOWNLOADED: 'Document downloaded',
  DOCUMENT_RENAMED: 'Document renamed',
  DOCUMENT_MOVED: 'Document moved',
  DOCUMENT_DELETED: 'Document deleted',
  DOCUMENT_SHARED: 'Document shared',
  SHARE_REVOKED: 'Share access revoked',
  DOCUMENT_VERIFIED: 'Document verified',
  HASH_CREATED: 'SHA-256 proof created',
  BLOCKCHAIN_ANCHORED: 'Hash anchored to blockchain',
  BLOCKCHAIN_ANCHOR_FAILED: 'Blockchain anchoring failed',
};

export const SHARE_EXPIRY_OPTIONS = [
  { label: '1 Hour', value: '1h', ms: 3600 * 1000 },
  { label: '24 Hours', value: '24h', ms: 24 * 3600 * 1000 },
  { label: '7 Days', value: '7d', ms: 7 * 24 * 3600 * 1000 },
  { label: 'Never', value: 'never', ms: null },
] as const;
