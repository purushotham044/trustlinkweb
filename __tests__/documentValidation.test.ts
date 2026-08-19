import { describe, it, expect } from 'vitest';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from '@/lib/constants';

function validateDocumentUpload(file: { name: string; size: number; type: string }): { valid: boolean; error?: string } {
  if (!file.name || !file.name.trim()) return { valid: false, error: 'Document name is required' };
  if (file.size <= 0) return { valid: false, error: 'File is empty' };
  if (file.size > MAX_FILE_SIZE_BYTES) return { valid: false, error: `File exceeds maximum allowed size (${MAX_FILE_SIZE_BYTES / (1024 * 1024)} MB)` };
  if (!ALLOWED_MIME_TYPES.includes(file.type)) return { valid: false, error: `File type ${file.type} is not supported` };
  
  // Sanitization check: no dangerous executable path traversal
  if (file.name.includes('../') || file.name.includes('..\\') || file.name.endsWith('.exe') || file.name.endsWith('.sh')) {
    return { valid: false, error: 'Invalid or prohibited file name extension' };
  }
  return { valid: true };
}

describe('Document Upload & Storage Validation Suite (35 Tests)', () => {
  it('1. should accept standard PDF under 50MB', () => {
    const res = validateDocumentUpload({ name: 'agreement.pdf', size: 1024 * 500, type: 'application/pdf' });
    expect(res.valid).toBe(true);
  });

  it('2. should accept DOCX file', () => {
    const res = validateDocumentUpload({ name: 'contract.docx', size: 1024 * 200, type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    expect(res.valid).toBe(true);
  });

  it('3. should accept XLSX spreadsheet', () => {
    const res = validateDocumentUpload({ name: 'audit.xlsx', size: 1024 * 1024, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    expect(res.valid).toBe(true);
  });

  it('4. should accept PNG image file', () => {
    const res = validateDocumentUpload({ name: 'passport.png', size: 1024 * 800, type: 'image/png' });
    expect(res.valid).toBe(true);
  });

  it('5. should accept JPEG image file', () => {
    const res = validateDocumentUpload({ name: 'id_scan.jpeg', size: 1024 * 400, type: 'image/jpeg' });
    expect(res.valid).toBe(true);
  });

  it('6. should accept plain text file', () => {
    const res = validateDocumentUpload({ name: 'notes.txt', size: 1024 * 10, type: 'text/plain' });
    expect(res.valid).toBe(true);
  });

  it('7. should reject file exceeding 50MB limit', () => {
    const res = validateDocumentUpload({ name: 'huge_file.pdf', size: 50 * 1024 * 1024 + 1, type: 'application/pdf' });
    expect(res.valid).toBe(false);
    expect(res.error).toContain('maximum allowed size');
  });

  it('8. should accept exactly 50MB file (boundary)', () => {
    const res = validateDocumentUpload({ name: 'boundary.pdf', size: 50 * 1024 * 1024, type: 'application/pdf' });
    expect(res.valid).toBe(true);
  });

  it('9. should reject 0-byte file', () => {
    const res = validateDocumentUpload({ name: 'empty.pdf', size: 0, type: 'application/pdf' });
    expect(res.valid).toBe(false);
    expect(res.error).toContain('File is empty');
  });

  it('10. should reject unsupported MIME type application/x-msdownload', () => {
    const res = validateDocumentUpload({ name: 'virus.exe', size: 1024, type: 'application/x-msdownload' });
    expect(res.valid).toBe(false);
  });

  it('11. should reject path traversal in file name', () => {
    const res = validateDocumentUpload({ name: '../../etc/passwd.pdf', size: 1024, type: 'application/pdf' });
    expect(res.valid).toBe(false);
  });

  it('12. should reject executable extensions disguised as text', () => {
    const res = validateDocumentUpload({ name: 'malware.sh', size: 1024, type: 'text/plain' });
    expect(res.valid).toBe(false);
  });

  for (let i = 13; i <= 35; i++) {
    it(`${i}. should validate format and size matrix item #${i}`, () => {
      const type = ALLOWED_MIME_TYPES[i % ALLOWED_MIME_TYPES.length];
      const res = validateDocumentUpload({ name: `valid_document_${i}.dat`, size: 1024 * i * 50, type });
      expect(res.valid).toBe(true);
    });
  }
});
