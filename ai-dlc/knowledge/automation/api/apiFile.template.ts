// Template: File Upload Helper
// Category: File
// Usage: await FileUploadHelper.upload(request, baseUrl, token, { filePath: './report.xlsx' })

import { APIRequestContext, APIResponse } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * FileUploadHelper - Static utility class for managing File Uploads via API
 * Supports multipart/form-data, single/multiple files, buffer, and base64
 * 
 * ✅ ALLOWED FILE TYPES:
 * - Documents: .pdf, .xlsx, .xls, .docx, .doc, .pptx, .csv, .txt, .json, .xml
 * - Images: .jpg, .jpeg, .png, .gif, .webp, .svg
 * - Archives: .zip, .rar
 * - Media: .mp4, .mp3
 * 
 * ❌ NOT ALLOWED:
 * - Executable files: .exe, .bat, .sh, .cmd, .app
 * - System files: .dll, .sys, .ini
 * - Script files: .js, .ts, .py, .php (unless explicitly required)
 * 
 * ✅ FEATURES:
 * - Single file upload (upload, uploadSingle)
 * - Multiple files upload (uploadMultiple)
 * - Upload from Buffer/Base64 (uploadBuffer, uploadBase64)
 * - MIME type detection (getMimeType)
 * - File validation (validateFile)
 * 
 * @example
 * // Upload single file
 * const fileUploadHelper = new FileUploadHelper(request);
 * await fileUploadHelper.upload(baseUrl, token, { filePath: './report.xlsx' })
 */
export class FileUploadHelper {
  constructor(private readonly request: APIRequestContext) { }

  // ===== Built-in MIME Type Patterns =====

  /** Common MIME types */
  private static readonly MIME_TYPES: { [key: string]: string } = {
    '.pdf': 'application/pdf',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.xls': 'application/vnd.ms-excel',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.doc': 'application/msword',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.csv': 'text/csv',
    '.txt': 'text/plain',
    '.json': 'application/json',
    '.xml': 'application/xml',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.zip': 'application/zip',
    '.rar': 'application/x-rar-compressed',
    '.mp4': 'video/mp4',
    '.mp3': 'audio/mpeg'
  };

  // ===== 🔥 MAIN Functions =====

  /**
   * 🔥 MAIN: Upload files (single/multiple)
   * @param baseUrl - Base URL of API
   * @param token - Bearer token
   * @param options - Upload options
   * 
   * @example
   * await fileUploadHelper.upload(baseUrl, token, { filePath: './report.pdf' })
   * await fileUploadHelper.upload(baseUrl, token, { filePaths: ['./file1.pdf', './file2.pdf'] })
   */
  async upload(
    baseUrl: string,
    token: string,
    options: {
      /** Path of single file */
      filePath?: string;
      /** Paths of multiple files */
      filePaths?: string[];
      /** Field name for multipart (default: 'file' or 'files') */
      fieldName?: string;
      /** Additional form fields */
      fields?: { [key: string]: any };
      /** API endpoint (default: '/api/upload') */
      endpoint?: string;
    }
  ): Promise<APIResponse> {
    const { filePath, filePaths, fieldName, fields = {}, endpoint = '/api/upload' } = options;

    const multipart: any = { ...fields };

    if (filePaths && filePaths.length > 0) {
      // Multiple files
      const files = filePaths.map(fp => this.createFileObject(fp));
      multipart[fieldName || 'files'] = files;
    } else if (filePath) {
      // Single file
      multipart[fieldName || 'file'] = this.createFileObject(filePath);
    }

    const response = await this.request.post(`${baseUrl}${endpoint}`, {
      headers: { 'Authorization': `Bearer ${token}` },
      multipart
    });

    if (!response.ok()) {
      throw new Error(`Upload failed: ${response.status()} ${response.statusText()}`);
    }

    return response;
  }

  /**
   * Upload single file (shorthand)
   * 
   * @example
   * await fileUploadHelper.uploadSingle(baseUrl, token, './report.pdf')
   */
  async uploadSingle(
    baseUrl: string,
    token: string,
    filePath: string,
    options?: { fields?: { [key: string]: any }; endpoint?: string }
  ): Promise<APIResponse> {
    return this.upload(baseUrl, token, {
      filePath,
      ...options
    });
  }

  /**
   * Upload multiple files (shorthand)
   * 
   * @example
   * await fileUploadHelper.uploadMultiple(baseUrl, token, ['./file1.pdf', './file2.pdf'])
   */
  async uploadMultiple(
    baseUrl: string,
    token: string,
    filePaths: string[],
    options?: { fields?: { [key: string]: any }; endpoint?: string }
  ): Promise<APIResponse> {
    return this.upload(baseUrl, token, {
      filePaths,
      endpoint: options?.endpoint || '/api/upload-multiple',
      ...options
    });
  }

  /**
   * Upload from Buffer
   * 
   * @example
   * const buffer = fs.readFileSync('./report.pdf')
   * await fileUploadHelper.uploadBuffer(baseUrl, token, { buffer, fileName: 'report.pdf' })
   */
  async uploadBuffer(
    baseUrl: string,
    token: string,
    options: {
      buffer: Buffer;
      fileName: string;
      mimeType?: string;
      fields?: { [key: string]: any };
      endpoint?: string;
    }
  ): Promise<APIResponse> {
    const { buffer, fileName, mimeType, fields = {}, endpoint = '/api/upload' } = options;

    const multipart: any = {
      ...fields,
      file: {
        name: fileName,
        mimeType: mimeType || this.getMimeType(path.extname(fileName)),
        buffer
      }
    };

    const response = await this.request.post(`${baseUrl}${endpoint}`, {
      headers: { 'Authorization': `Bearer ${token}` },
      multipart
    });

    if (!response.ok()) {
      throw new Error(`Upload failed: ${response.status()} ${response.statusText()}`);
    }

    return response;
  }

  /**
   * Upload from Base64
   * 
   * @example
   * await fileUploadHelper.uploadBase64(baseUrl, token, { 
   *   base64: 'JVBERi0xLjQK...', 
   *   fileName: 'report.pdf' 
   * })
   */
  async uploadBase64(
    baseUrl: string,
    token: string,
    options: {
      base64: string;
      fileName: string;
      mimeType?: string;
      fields?: { [key: string]: any };
      endpoint?: string;
    }
  ): Promise<APIResponse> {
    const buffer = Buffer.from(options.base64, 'base64');
    return this.uploadBuffer(baseUrl, token, {
      buffer,
      fileName: options.fileName,
      mimeType: options.mimeType,
      fields: options.fields,
      endpoint: options.endpoint
    });
  }

  // ===== Private Helper Methods =====

  /**
   * Create file object for multipart
   */
  private createFileObject(filePath: string): { name: string; mimeType: string; buffer: Buffer } {
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    const mimeType = this.getMimeType(path.extname(filePath));

    return {
      name: fileName,
      mimeType: mimeType,
      buffer: fileBuffer
    };
  }

  /**
   * Determine MIME type based on file extension
   */
  getMimeType(ext: string): string {
    const mimeTypes: { [key: string]: string } = {
      // Documents
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.xls': 'application/vnd.ms-excel',
      '.pdf': 'application/pdf',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.doc': 'application/msword',
      '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      '.csv': 'text/csv',
      '.txt': 'text/plain',
      '.json': 'application/json',
      '.xml': 'application/xml',
      // Images
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      // Others
      '.zip': 'application/zip',
      '.rar': 'application/x-rar-compressed',
      '.mp4': 'video/mp4',
      '.mp3': 'audio/mpeg'
    };
    return mimeTypes[ext.toLowerCase()] || 'application/octet-stream';
  }

  /**
   * Check if file exists before upload
   */
  validateFile(filePath: string): { valid: boolean; error?: string } {
    if (!fs.existsSync(filePath)) {
      return { valid: false, error: `File not found: ${filePath}` };
    }

    const stats = fs.statSync(filePath);
    if (stats.size === 0) {
      return { valid: false, error: `File is empty: ${filePath}` };
    }

    return { valid: true };
  }
}

// ===== Usage Examples =====

// Variant 1: Upload single file (main function)
/*
import { FileUploadHelper } from './apiFileUpload.template';

const helper = new FileUploadHelper(request);
const response = await helper.upload('https://api.example.com', token, {
  filePath: './reports/monthly.xlsx',
  fields: { description: 'Monthly report', category: 'finance' }
});
*/

// Variant 2: Upload single file (shorthand)
/*
const helper = new FileUploadHelper(request);
const response = await helper.uploadSingle(
  'https://api.example.com', token, './document.pdf'
);
*/

// Variant 3: Upload multiple files
/*
const helper = new FileUploadHelper(request);
const response = await helper.uploadMultiple(
  'https://api.example.com', token,
  ['./file1.pdf', './file2.pdf', './file3.xlsx'],
  { fields: { category: 'documents' } }
);
*/

// Variant 4: Upload from Buffer
/*
const helper = new FileUploadHelper(request);
const buffer = fs.readFileSync('./image.png');
const response = await helper.uploadBuffer(
  'https://api.example.com', token,
  { buffer, fileName: 'screenshot.png', mimeType: 'image/png' }
);
*/

// Variant 5: Upload from Base64
/*
const helper = new FileUploadHelper(request);
const base64Data = 'iVBORw0KGgo...'; // base64 string
const response = await helper.uploadBase64(
  'https://api.example.com', token,
  { base64: base64Data, fileName: 'image.png' }
);
*/

// Variant 6: Verify file exists before upload
/*
const helper = new FileUploadHelper(request);
const validation = helper.validateFile('./report.xlsx');
if (validation.valid) {
  await helper.uploadSingle(baseUrl, token, './report.xlsx');
} else {
  console.error(validation.error);
}
*/

// Variant 7: Use with custom endpoint and field name
/*
const helper = new FileUploadHelper(request);
const response = await helper.upload('https://api.example.com', token, {
  filePath: './avatar.png',
  fieldName: 'avatar',
  endpoint: '/api/users/avatar',
  fields: { userId: '123' }
});
*/
