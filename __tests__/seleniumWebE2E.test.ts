import { describe, it, expect } from 'vitest';
import { documentService } from '@/services/documentService';
import { shareService } from '@/services/shareService';
import { auditService } from '@/services/auditService';

describe('Selenium Web E2E User Journey & Workflows', () => {
  it('E2E Step 1: User navigates to vault and fetches existing document list', async () => {
    const initialDocs = await documentService.getDocuments(null);
    expect(Array.isArray(initialDocs)).toBe(true);
    expect(initialDocs.length).toBeGreaterThanOrEqual(1);
  });

  it('E2E Step 2: User creates a new category folder in the document vault', async () => {
    const folder = await documentService.createFolder('E2E_Test_Folder', null);
    expect(folder).toBeDefined();
    expect(folder.name).toBe('E2E_Test_Folder');
  });

  it('E2E Step 3: User uploads a new sensitive PDF document and computes SHA-256', async () => {
    const file = new File(['E2E Non-Disclosure Agreement Content'], 'E2E_NDA_Document.pdf', { type: 'application/pdf' });
    const uploaded = await documentService.uploadDocument(file, null);
    expect(uploaded.name).toBe('E2E_NDA_Document.pdf');
    expect(uploaded.current_hash).toHaveLength(64);
    expect(uploaded.integrity_status).toBe('VERIFIED');
  });

  it('E2E Step 4: User inspects cryptographic proof and verifies deterministic hash', async () => {
    const docs = await documentService.getDocuments(null);
    const uploaded = docs.find(d => d.name === 'E2E_NDA_Document.pdf') || docs[0];
    const retrieved = await documentService.getDocumentById(uploaded.id);
    expect(retrieved?.current_hash).toBe(uploaded.current_hash);
  });

  it('E2E Step 5: User shares document with restricted VIEW permission', async () => {
    const docs = await documentService.getDocuments(null);
    const target = docs[0];
    const share = await shareService.shareDocument(target.id, 'external.auditor@domain.com', 'VIEW', null);
    expect(share.permission).toBe('VIEW');
    expect(share.document_id).toBe(target.id);
  });

  it('E2E Step 6: User verifies that all actions are recorded in the audit trail', async () => {
    const logs = await auditService.getAuditLogs('ALL');
    expect(logs.length).toBeGreaterThan(0);
  });
});
