// Universal API helper for file conversion/compression endpoints

// Convert FileList to FormData for bulk upload
function uploadAndConvert(endpoint, files, formFields = {}) {
  const formData = new FormData();
  files.forEach(f => formData.append('files', f));
  Object.entries(formFields).forEach(([k, v]) => formData.append(k, v));
  return fetch(endpoint, {
    method: 'POST',
    body: formData
  }).then(async response => {
    if (!response.ok) throw new Error("Conversion API error");
    return await response.json();
  });
}

// Bulk ZIP endpoint
function uploadAndConvertZip(endpoint, files, convertType, compress) {
  const formData = new FormData();
  files.forEach(f => formData.append('files', f));
  formData.append('convert_type', convertType);
  formData.append('compress', compress);
  return fetch(endpoint, {
    method: 'POST',
    body: formData
  }).then(async response => {
    if (!response.ok) throw new Error("Bulk ZIP API error");
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
    if (!response.ok) throw new Error("OCR API error");
    return await response.json();
  });
}