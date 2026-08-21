// ============================================================
// TrustLink Web — TypeScript Types
// Matches the mobile app and Supabase backend exactly
// ============================================================

export type IntegrityStatus = 'PENDING' | 'VERIFIED' | 'FAILED';
export type SharePermission = 'VIEW' | 'DOWNLOAD';
export type BlockchainStatus = 'PENDING' | 'CONFIRMED' | 'FAILED';

export type AuditAction =
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'USER_REGISTERED'
  | 'FOLDER_CREATED'
  | 'FOLDER_RENAMED'
  | 'FOLDER_DELETED'
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
  updated_at?: string;
}

export interface Folder {
  id: string;
  owner_id: string;
  name: string;
  parent_folder_id: string | null;
  created_at: string;
  updated_at?: string;
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

export interface IntegrityRecord {
  id: string;
  document_id: string;
  sha256_hash: string;
  generated_at: string;
  generated_by: string;
  version_reference: number;
}

export interface BlockchainProof {
  id: string;
  document_id: string;
  document_hash: string;
  blockchain_network: string;
  transaction_hash: string | null;
  block_number: number | null;
  contract_address: string | null;
  anchored_at: string | null;
  status: BlockchainStatus;
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
  document?: Document;
}

export interface AuditLog {
  id: string;
  user_id: string;
  document_id: string | null;
  action: AuditAction;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface ExtendedAuditLog extends AuditLog {
  document?: Document | null;
}

export type AuditCategory = 'ALL' | 'BLOCKCHAIN' | 'INTEGRITY' | 'SHARING' | 'FILES';

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

export interface DashboardStats {
  totalDocs: number;
  verifiedDocs: number;
  anchoredDocs: number;
  sharedDocs: number;
}
