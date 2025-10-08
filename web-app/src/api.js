const API_BASE = "https://kill-file-1.onrender.com";
// Universal API helper for file conversion/compression endpoints

// Convert FileList to FormData for bulk upload
function uploadAndConvert(endpoint, files, formFields = {}) {
  const formData = new FormData();
  // Bugfix: support FileList or Array
  Array.from(files).forEach(f => formData.append('files', f));
  Object.entries(formFields).forEach(([k, v]) => formData.append(k, v));
  return fetch(endpoint, {
    method: 'POST',
    body: formData
  }).then(async response => {
    if (!response.ok) {
      // Try to show backend error message if available
      let msg = "Conversion API error";
      try { msg = await response.text(); } catch(e){}
      throw new Error(msg);
    }
    return await response.json();
  });
}

// Bulk ZIP endpoint (for multiple files)
function uploadAndConvertZip(endpoint, files, convertType, compress) {
  const formData = new FormData();
  Array.from(files).forEach(f => formData.append('files', f));
  formData.append('convert_type', convertType);
  formData.append('compress', compress);
  return fetch(endpoint, {
    method: 'POST',
    body: formData
  }).then(async response => {
    if (!response.ok) {
      let msg = "Bulk ZIP API error";
      try { msg = await response.text(); } catch(e){}
      throw new Error(msg);
    }
    return await response.blob();
  });
}

// OCR for image
function ocrImage(endpoint, file, lang) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('lang', lang);
  return fetch(endpoint, {
    method: 'POST',
    body: formData
  }).then(async response => {
    if (!response.ok) {
      let msg = "OCR API error";
      try { msg = await response.text(); } catch(e){}
      throw new Error(msg);
    }
    return await response.json();
  });
}