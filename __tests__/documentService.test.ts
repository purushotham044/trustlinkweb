import { describe, it, expect } from 'vitest';
import { documentService } from '@/services/documentService';

describe('Document & Folder Hierarchy Service', () => {
  it('should retrieve list of documents in vault', async () => {
    const docs = await documentService.getDocuments(null);
    expect(Array.isArray(docs)).toBe(true);
    expect(docs.length).toBeGreaterThan(0);
    const doc = docs[0];
    expect(doc).toHaveProperty('id');
    expect(doc).toHaveProperty('name');
    expect(doc).toHaveProperty('current_hash');
    expect(doc).toHaveProperty('integrity_status');
  });

  it('should retrieve folders hierarchy', async () => {
    const folders = await documentService.getFolders(null);
    expect(Array.isArray(folders)).toBe(true);
    expect(folders.length).toBeGreaterThan(0);
    expect(folders[0]).toHaveProperty('name');
    expect(folders[0]).toHaveProperty('id');
  });

  it('should create a new folder and add it to folder list', async () => {
    const folderName = `Test_Folder_${Date.now()}`;
    const newFolder = await documentService.createFolder(folderName, null);
    expect(newFolder.name).toBe(folderName);
    expect(newFolder).toHaveProperty('id');

    const allFolders = await documentService.getFolders(null);
    expect(allFolders.some(f => f.name === folderName)).toBe(true);
  });

  it('should reject empty folder names', async () => {
    await expect(documentService.createFolder('   ', null)).rejects.toThrow('Folder name cannot be empty');
  });

  it('should upload a new document with SHA-256 computation', async () => {
    const file = new File(['Document Test Content ' + Date.now()], 'Uploaded_Contract.pdf', { type: 'application/pdf' });
    const uploaded = await documentService.uploadDocument(file, null);
    expect(uploaded.name).toBe('Uploaded_Contract.pdf');
    expect(uploaded.integrity_status).toBe('VERIFIED');
    expect(uploaded.current_hash).toHaveLength(64);
    expect(uploaded.size).toBeGreaterThan(0);
  });

  it('should retrieve document by specific ID', async () => {
    const docs = await documentService.getDocuments(null);
    const target = docs[0];
    const retrieved = await documentService.getDocumentById(target.id);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.id).toBe(target.id);
    expect(retrieved?.name).toBe(target.name);
  });

  it('should calculate accurate dashboard statistics', async () => {
    const stats = await documentService.getDashboardStats();
    expect(stats).toHaveProperty('totalDocs');
    expect(stats).toHaveProperty('verifiedDocs');
    expect(stats).toHaveProperty('anchoredDocs');
    expect(stats).toHaveProperty('sharedDocs');
    expect(stats.totalDocs).toBeGreaterThanOrEqual(stats.verifiedDocs);
  });

  it('should delete a document and update vault count', async () => {
    const file = new File(['Temporary content'], 'to_delete.txt', { type: 'text/plain' });
    const doc = await documentService.uploadDocument(file, null);
    await documentService.deleteDocument(doc);
    const docs = await documentService.getDocuments(null);
    expect(docs.some(d => d.id === doc.id)).toBe(false);
  });
});
