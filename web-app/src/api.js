// api.js
const API_BASE = "https://kill-file-1.onrender.com";

/**
 * Upload files to a conversion endpoint.
 * @param {string} endpoint - API endpoint path (e.g., "/convert/pdf")
 * @param {File[]|FileList} files - Files to upload
 * @param {object} formFields - Additional form fields for conversion
 * @returns {Promise<object>} - JSON response from backend
 */
export async function uploadAndConvert(endpoint, files, formFields = {}) {
  const formData = new FormData();
  Array.from(files).forEach(f => formData.append('files', f));
  Object.entries(formFields).forEach(([k, v]) => formData.append(k, v));

  const response = await fetch(API_BASE + endpoint, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    let msg = 'Conversion API error';
    try { msg = await response.text(); } catch(e) {}
    throw new Error(msg);
  }

  return await response.json();
}

/**
 * Upload multiple files for ZIP download.
 * @param {string} endpoint - API endpoint path (e.g., "/convert/zip")
 * @param {File[]|FileList} files - Files to include in ZIP
 * @param {string} convertType - Conversion type (pdf, image, office)
 * @param {number} compress - Compression quality
 * @returns {Promise<Blob>} - ZIP file as Blob
 */
export async function uploadAndConvertZip(endpoint, files, convertType, compress) {
  const formData = new FormData();
  Array.from(files).forEach(f => formData.append('files', f));
  formData.append('convert_type', convertType);
  formData.append('compress', compress);

  const response = await fetch(API_BASE + endpoint, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    let msg = 'Bulk ZIP API error';
    try { msg = await response.text(); } catch(e) {}
    throw new Error(msg);
  }

  return await response.blob();
}

/**
 * Perform OCR on a single image file.
 * @param {string} endpoint - OCR endpoint path (e.g., "/ocr")
 * @param {File} file - Image file
 * @param {string} lang - OCR language
 * @returns {Promise<object>} - JSON OCR results
 */
export async function ocrImage(endpoint, file, lang) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('lang', lang);

  const response = await fetch(API_BASE + endpoint, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    let msg = 'OCR API error';
    try { msg = await response.text(); } catch(e) {}
    throw new Error(msg);
  }

  return await response.json();
}