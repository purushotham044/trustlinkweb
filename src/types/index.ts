// ============================================================
// TrustLink Web — TypeScript Types
// Mirrors the mobile app's type definitions exactly
// ============================================================

export type IntegrityStatus = 'PENDING' | 'VERIFIED' | 'FAILED';
export type SharePermission = 'VIEW' | 'DOWNLOAD';
export type BlockchainStatus = 'PENDING' | 'CONFIRMED' | 'FAILED';

export type AuditAction =
  | 'DOCUMENT_UPLOADED'
  | 'DOCUMENT_VIEWED'
  | 'DOCUMENT_DOWNLOADED'
  | 'DOCUMENT_RENAMED'
  | 'DOCUMENT_MOVED'
  | 'DOCUMENT_DELETED'
  | 'DOCUMENT_SHARED'
  | 'SHARE_REVOKED'
  | 'DOCUMENT_VERIFIED'
  | 'HASH_CREATED'
  | 'BLOCKCHAIN_ANCHORED'
  | 'BLOCKCHAIN_ANCHOR_FAILED';

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Folder {
  id: string;
  owner_id: string;
  name: string;
  parent_id: string | null;
  created_at: string;
}

export interface Document {
  id: string;
  owner_id: string;
  folder_id: string | null;
  name: string;
  mime_type: string;
  size: number;
  storage_path: string;
  current_hash: string | null;
  integrity_status: IntegrityStatus;
  created_at: string;
  updated_at: string;
}

export interface BlockchainProof {
  id: string;
  document_id: string;
  document_hash: string;
  transaction_hash: string | null;
  block_number: number | null;
  blockchain_network: string;
  status: BlockchainStatus;
  anchored_at: string | null;
  created_at: string;
}

export interface DocumentShare {
  id: string;
  document_id: string;
  owner_id: string;
  shared_with_id: string;
  permission: SharePermission;
  expires_at: string | null;
  revoked_at: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  document_id: string | null;
  action: AuditAction;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface VerificationResult {
  documentName: string;
  currentHash: string;
  storedHash: string | null;
  blockchainHash: string | null;
  trustlinkMatch: boolean;
  blockchainMatch: boolean | null;
  blockchainProof: BlockchainProof | null;
  overallVerified: boolean;
  verifiedAt: string;
}

// ── UI / App types ───────────────────────────────────────────

export interface DashboardStats {
  totalDocs: number;
  verifiedDocs: number;
  anchoredDocs: number;
  sharedDocs: number;
}

export type AuditCategory = 'ALL' | 'BLOCKCHAIN' | 'INTEGRITY' | 'SHARING' | 'FILES';

export interface ExtendedDocumentShare extends DocumentShare {
  document?: Document;
}

export interface ExtendedAuditLog extends AuditLog {
  document?: Document | null;
}
