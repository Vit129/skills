// Template: File Upload UI
// Category: File
// Usage: await FileUploadHelper.upload(page, '/path/to/file.pdf')
// Version: 2.0.0 (Tier A - 12+ variants)

import { Page, expect } from '@playwright/test';

/**
 * FileUploadHelper - Static utility class for managing File Upload UI
 * Supports both click upload and drag-and-drop
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
 * - Single/Multiple file upload (upload, uploadMultiple)
 * - Drag & Drop upload (uploadByDragDrop)
 * - Upload from URL/Base64 (uploadFromUrl, uploadBase64)
 * - Upload with progress (uploadWithProgress, waitForUploadComplete)
 * - Upload control (cancelUpload, retryFailedUpload)
 * - Upload verification (verifyUploadSuccess, verifyFilePreview)
 * - File management (removeFile, clearFiles, getUploadedFiles)
 * - Status & validation (getUploadStatus, verifyFileSizeLimit)
 * 
 * @example
 * // Upload single file
 * await FileUploadHelper.upload(page, './report.pdf')
 */
export class FileUploadHelper {
    // ===== Built-in Selector Patterns =====

    /** File input selectors */
    private static readonly INPUT_SELECTORS = 'input[type="file"], [type="file"]';

    /** Drop zone selectors */
    private static readonly DROPZONE_SELECTORS = '.dropzone, .drop-zone, [class*="drop"], [data-dropzone]';

    /** Success message selectors */
    private static readonly SUCCESS_SELECTORS = '.upload-success, .file-name, .success-message, [class*="success"]';

    /** File item selectors */
    private static readonly FILE_ITEM_SELECTORS = '.file-item, .uploaded-file, [class*="file-item"]';

    /** Remove button selectors */
    private static readonly REMOVE_BTN_SELECTORS = '.remove-btn, .delete-btn, button[class*="remove"], button[class*="delete"]';

    // ===== 🔥 MAIN Functions =====

    /**
     * 🔥 MAIN: Upload file via Click (input file)
     * @param page - Playwright Page
     * @param filePath - Path to file
     * @param inputSelector - Selector of input file
     */
    static async upload(page: Page, filePath: string, inputSelector: string = 'input[type="file"]') {
        await page.locator(inputSelector).setInputFiles(filePath);
    }

    /**
     * Upload multiple files
     * @param page - Playwright Page
     * @param filePaths - Array of file paths
     * @param inputSelector - Selector of input file
     * 
     * @example
     * await FileUploadHelper.uploadMultiple(page, ['./file1.pdf', './file2.pdf'])
     */
    static async uploadMultiple(page: Page, filePaths: string[], inputSelector: string = 'input[type="file"]') {
        await page.locator(inputSelector).setInputFiles(filePaths);
    }

    /**
     * Upload file via Drag & Drop
     * @param page - Playwright Page
     * @param filePath - Path to file
     * @param inputSelector - Selector of input file (hidden)
     * @param dropZoneSelector - Selector of drop zone (if need to simulate drop event)
     * 
     * @example
     * await FileUploadHelper.uploadByDragDrop(page, './file.pdf')
     * await FileUploadHelper.uploadByDragDrop(page, './file.pdf', '#file-input', '.dropzone')
     */
    static async uploadByDragDrop(
        page: Page,
        filePath: string,
        inputSelector: string = 'input[type="file"]',
        dropZoneSelector?: string
    ) {
        // Easy way: use setInputFiles with hidden input
        await page.locator(inputSelector).setInputFiles(filePath);

        // If need to simulate drop event
        if (dropZoneSelector) {
            await page.locator(dropZoneSelector).dispatchEvent('drop');
        }
    }

    /**
     * Verify upload success
     * @param page - Playwright Page
     * @param fileName - Expected file name
     * @param successSelector - Selector of success message
     * 
     * @example
     * await FileUploadHelper.verifyUploadSuccess(page, 'report.pdf')
     */
    static async verifyUploadSuccess(
        page: Page,
        fileName: string,
        successSelector: string = '.upload-success, .file-name'
    ) {
        await expect(page.locator(successSelector)).toContainText(fileName);
    }

    /**
     * Remove uploaded file
     * @param page - Playwright Page
     * @param fileName - Name of file to remove
     * @param fileItemSelector - Selector of file item
     * @param removeButtonSelector - Selector of remove button
     * 
     * @example
     * await FileUploadHelper.removeFile(page, 'report.pdf')
     */
    static async removeFile(
        page: Page,
        fileName: string,
        fileItemSelector: string = '.file-item',
        removeButtonSelector: string = '.remove-btn, .delete-btn'
    ) {
        const fileRow = page.locator(fileItemSelector).filter({ hasText: fileName });
        await fileRow.locator(removeButtonSelector).click();
    }

    /**
     * Clear all files
     * @param page - Playwright Page
     * @param inputSelector - Selector of input file
     * 
     * @example
     * await FileUploadHelper.clearFiles(page)
     */
    static async clearFiles(page: Page, inputSelector: string = 'input[type="file"]') {
        await page.locator(inputSelector).setInputFiles([]);
    }

    // ===== 🔥 NEW: Advanced Features (Tier A) =====

    /**
     * 🔥 Upload file from URL
     * @param page - Playwright Page
     * @param fileUrl - URL of file
     * @param inputSelector - Selector of input file
     * 
     * @example
     * await FileUploadHelper.uploadFromUrl(page, 'https://example.com/file.pdf')
     */
    static async uploadFromUrl(
        page: Page,
        fileUrl: string,
        inputSelector: string = 'input[type="file"]'
    ): Promise<void> {
        // Download file to temp location
        const response = await page.request.get(fileUrl);
        if (!response.ok()) {
            throw new Error(`Failed to download file from ${fileUrl}: ${response.status()}`);
        }

        const buffer = await response.body();
        const fileName = fileUrl.split('/').pop() || 'downloaded_file';

        // Upload buffer as file
        await page.locator(inputSelector).setInputFiles({
            name: fileName,
            mimeType: response.headers()['content-type'] || 'application/octet-stream',
            buffer: buffer
        });
    }

    /**
     * 🔥 Upload file from Base64
     * @param page - Playwright Page
     * @param base64String - Base64 string of file
     * @param fileName - File name
     * @param mimeType - MIME type
     * @param inputSelector - Selector of input file
     * 
     * @example
     * await FileUploadHelper.uploadBase64(page, base64String, 'image.png', 'image/png')
     */
    static async uploadBase64(
        page: Page,
        base64String: string,
        fileName: string,
        mimeType: string = 'application/octet-stream',
        inputSelector: string = 'input[type="file"]'
    ): Promise<void> {
        const buffer = Buffer.from(base64String, 'base64');

        await page.locator(inputSelector).setInputFiles({
            name: fileName,
            mimeType: mimeType,
            buffer: buffer
        });
    }

    /**
     * 🔥 Upload with progress bar wait
     * @param page - Playwright Page
     * @param filePath - Path to file
     * @param options - Upload options
     * 
     * @example
     * await FileUploadHelper.uploadWithProgress(page, './large-file.zip', {
     *   progressSelector: '.upload-progress',
     *   timeout: 60000
     * })
     */
    static async uploadWithProgress(
        page: Page,
        filePath: string,
        options: {
            inputSelector?: string;
            progressSelector?: string;
            completeSelector?: string;
            timeout?: number;
        } = {}
    ): Promise<void> {
        const {
            inputSelector = 'input[type="file"]',
            progressSelector = '.upload-progress, .progress-bar, [role="progressbar"]',
            completeSelector = '.upload-complete, .upload-success',
            timeout = 30000
        } = options;

        // Upload file
        await page.locator(inputSelector).setInputFiles(filePath);

        // Wait for progress bar to appear
        await page.locator(progressSelector).waitFor({ state: 'visible', timeout: 5000 }).catch(() => { });

        // Wait for upload to complete
        await page.locator(completeSelector).waitFor({ state: 'visible', timeout });
    }

    /**
     * 🔥 Cancel upload
     * @param page - Playwright Page
     * @param cancelButtonSelector - Selector of cancel button
     * 
     * @example
     * await FileUploadHelper.cancelUpload(page)
     */
    static async cancelUpload(
        page: Page,
        cancelButtonSelector: string = '.cancel-upload, button[class*="cancel"]'
    ): Promise<void> {
        const btn = page.locator(cancelButtonSelector);
        await btn.waitFor({ state: 'visible', timeout: 5000 });
        await btn.click();
    }

    /**
     * 🔥 Retry failed upload
     * @param page - Playwright Page
     * @param retryButtonSelector - Selector of retry button
     * 
     * @example
     * await FileUploadHelper.retryFailedUpload(page)
     */
    static async retryFailedUpload(
        page: Page,
        retryButtonSelector: string = '.retry-upload, button[class*="retry"]'
    ): Promise<void> {
        const btn = page.locator(retryButtonSelector);
        await btn.waitFor({ state: 'visible', timeout: 5000 });
        await btn.click();
    }

    /**
     * 🔥 Verify file preview
     * @param page - Playwright Page
     * @param fileName - File name
     * @param previewSelector - Selector of preview
     * 
     * @example
     * await FileUploadHelper.verifyFilePreview(page, 'image.png')
     */
    static async verifyFilePreview(
        page: Page,
        fileName: string,
        previewSelector: string = '.file-preview, .preview-image, img[class*="preview"]'
    ): Promise<void> {
        const preview = page.locator(previewSelector);
        await preview.waitFor({ state: 'visible', timeout: 5000 });

        // Verify file name in preview or alt text
        const alt = await preview.getAttribute('alt').catch(() => '');
        const title = await preview.getAttribute('title').catch(() => '');
        const src = await preview.getAttribute('src').catch(() => '');

        const hasFileName = alt?.includes(fileName) || title?.includes(fileName) || src?.includes(fileName);

        if (!hasFileName) {
            throw new Error(`File preview should contain '${fileName}', but not found`);
        }
    }

    /**
     * 🔥 Get upload status
     * @param page - Playwright Page
     * @param statusSelector - Selector of status
     * @returns Upload status
     * 
     * @example
     * const status = await FileUploadHelper.getUploadStatus(page)
     */
    static async getUploadStatus(
        page: Page,
        statusSelector: string = '.upload-status, [class*="status"]'
    ): Promise<{
        status: 'uploading' | 'success' | 'error' | 'pending' | 'unknown';
        message: string;
        progress?: number;
    }> {
        const statusEl = page.locator(statusSelector).first();
        const visible = await statusEl.isVisible().catch(() => false);

        if (!visible) {
            return { status: 'unknown', message: '' };
        }

        const message = await statusEl.textContent() || '';
        const className = await statusEl.getAttribute('class') || '';

        let status: 'uploading' | 'success' | 'error' | 'pending' | 'unknown' = 'unknown';
        if (className.includes('uploading') || className.includes('progress')) status = 'uploading';
        else if (className.includes('success') || className.includes('complete')) status = 'success';
        else if (className.includes('error') || className.includes('failed')) status = 'error';
        else if (className.includes('pending') || className.includes('waiting')) status = 'pending';

        // Try to get progress percentage
        let progress: number | undefined;
        const progressBar = page.locator('[role="progressbar"]').first();
        if (await progressBar.isVisible().catch(() => false)) {
            const ariaValueNow = await progressBar.getAttribute('aria-valuenow');
            if (ariaValueNow) {
                progress = parseInt(ariaValueNow);
            }
        }

        return { status, message, progress };
    }

    /**
     * 🔥 Wait for upload to complete
     * @param page - Playwright Page
     * @param timeout - Timeout (ms)
     * 
     * @example
     * await FileUploadHelper.waitForUploadComplete(page, 60000)
     */
    static async waitForUploadComplete(
        page: Page,
        timeout: number = 30000
    ): Promise<void> {
        const successSelectors = [
            '.upload-success',
            '.upload-complete',
            '[class*="success"]',
            '.file-name'
        ];

        for (const selector of successSelectors) {
            const el = page.locator(selector).first();
            const visible = await el.waitFor({ state: 'visible', timeout: timeout / successSelectors.length }).catch(() => false);
            if (visible) return;
        }

        throw new Error(`Upload did not complete within ${timeout}ms`);
    }

    /**
     * 🔥 Verify file size before upload
     * @param page - Playwright Page
     * @param filePath - Path to file
     * @param maxSizeMb - Max size (MB)
     * 
     * @example
     * await FileUploadHelper.verifyFileSizeLimit(page, './file.pdf', 10)
     */
    static async verifyFileSizeLimit(
        page: Page,
        filePath: string,
        maxSizeMb: number
    ): Promise<void> {
        const fs = require('fs');
        const stats = fs.statSync(filePath);
        const fileSizeMB = stats.size / (1024 * 1024);

        if (fileSizeMB > maxSizeMb) {
            throw new Error(
                `❌ File Size Limit Exceeded\n\n` +
                `📁 File: ${filePath}\n` +
                `📊 Size: ${fileSizeMB.toFixed(2)} MB\n` +
                `🚫 Max Allowed: ${maxSizeMb} MB\n\n` +
                `💡 Suggestions:\n` +
                `1. Compress the file\n` +
                `2. Split into smaller parts\n` +
                `3. Contact admin to increase limit`
            );
        }
    }

    /**
     * 🔥 Get list of uploaded files
     * @param page - Playwright Page
     * @param fileItemSelector - Selector of file items
     * @returns Array of file names
     * 
     * @example
     * const files = await FileUploadHelper.getUploadedFiles(page)
     */
    static async getUploadedFiles(
        page: Page,
        fileItemSelector: string = '.file-item, .uploaded-file'
    ): Promise<string[]> {
        const items = page.locator(fileItemSelector);
        const count = await items.count();
        const fileNames: string[] = [];

        for (let i = 0; i < count; i++) {
            const text = await items.nth(i).textContent() || '';
            fileNames.push(text.trim());
        }

        return fileNames;
    }
}

// ===== Usage Examples =====

// Variant 1: Upload single file (Click)
/*
import { FileUploadHelper } from './webUiFile.template';

await FileUploadHelper.upload(page, '/path/to/file.pdf');
await FileUploadHelper.verifyUploadSuccess(page, 'file.pdf');
*/

// Variant 2: Upload multiple files
/*
await FileUploadHelper.uploadMultiple(page, ['/path/to/file1.pdf', '/path/to/file2.pdf']);
*/

// Variant 3: Upload via Drag & Drop
/*
await FileUploadHelper.uploadByDragDrop(page, '/path/to/file.pdf', '#file-input', '.dropzone');
*/

// Variant 4: Remove file
/*
await FileUploadHelper.removeFile(page, 'file.pdf');
*/

// Variant 5: Clear all files
/*
await FileUploadHelper.clearFiles(page);
*/

// Variant 6: Upload with custom selector
/*
await FileUploadHelper.upload(page, '/path/to/file.pdf', '#custom-file-input');
*/

// Variant 7: Upload and verify
/*
await FileUploadHelper.upload(page, '/path/to/report.xlsx');
await FileUploadHelper.verifyUploadSuccess(page, 'report.xlsx', '.success-message');
*/

// ===== NEW VARIANTS (Tier A) =====

// Variant 8: Upload from URL
/*
await FileUploadHelper.uploadFromUrl(page, 'https://example.com/file.pdf');
*/

// Variant 9: Upload from Base64
/*
const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAUA...';
await FileUploadHelper.uploadBase64(page, base64, 'image.png', 'image/png');
*/

// Variant 10: Upload with progress bar
/*
await FileUploadHelper.uploadWithProgress(page, './large-file.zip', {
  timeout: 60000
});
*/

// Variant 11: Cancel and retry
/*
await FileUploadHelper.cancelUpload(page);
await FileUploadHelper.retryFailedUpload(page);
*/

// Variant 12: Verify preview and status
/*
await FileUploadHelper.verifyFilePreview(page, 'image.png');
const status = await FileUploadHelper.getUploadStatus(page);
console.log(`Status: ${status.status}, Progress: ${status.progress}%`);
*/

// Variant 13: Wait for upload complete
/*
await FileUploadHelper.upload(page, './file.pdf');
await FileUploadHelper.waitForUploadComplete(page, 30000);
*/

// Variant 14: Verify file size
/*
await FileUploadHelper.verifyFileSizeLimit(page, './file.pdf', 10); // Max 10MB
await FileUploadHelper.upload(page, './file.pdf');
*/

// Variant 15: Get list of uploaded files
/*
const files = await FileUploadHelper.getUploadedFiles(page);
console.log(`Uploaded files: ${files.join(', ')}`);
*/

// Variant 16: Combo - Upload with full validation
/*
await FileUploadHelper.verifyFileSizeLimit(page, './report.pdf', 5);
await FileUploadHelper.uploadWithProgress(page, './report.pdf');
await FileUploadHelper.verifyFilePreview(page, 'report.pdf');
const status = await FileUploadHelper.getUploadStatus(page);
if (status.status === 'success') {
  const files = await FileUploadHelper.getUploadedFiles(page);
  console.log(`Successfully uploaded: ${files.join(', ')}`);
}
*/
