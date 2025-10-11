// integration.js
// Connects HTML frontend to backend API (uses api.js)

const SECTIONS = [
  {
    btnId: 'pdf2pdfBtn',
    inputId: 'pdf2pdfInput',
    outputId: 'pdf2pdfOutput',
    spinId: 'pdf2pdfSpin',
    endpoint: '/convert/pdf',
    previewExt: ['pdf'],
    extraFields: () => ({ compress: document.getElementById('pdf2pdfQuality').value,
                          ocr_lang: document.getElementById('pdf2pdfLang').value })
  },
  {
    btnId: 'pdf2imgBtn',
    inputId: 'pdf2imgInput',
    outputId: 'pdf2imgOutput',
    spinId: 'pdf2imgSpin',
    endpoint: '/convert/image',
    previewExt: ['jpg','jpeg','png','bmp','tiff','svg','webp','avif','heic','heif'],
    extraFields: () => ({ compress: document.getElementById('pdf2imgQuality').value,
                          to_format: document.getElementById('pdf2imgFormat').value })
  },
  {
    btnId: 'img2pdfBtn',
    inputId: 'img2pdfInput',
    outputId: 'img2pdfOutput',
    spinId: 'img2pdfSpin',
    endpoint: '/convert/pdf',
    previewExt: ['pdf'],
    extraFields: () => ({ compress: document.getElementById('img2pdfQuality').value,
                          ocr_lang: document.getElementById('img2pdfLang').value })
  },
  {
    btnId: 'img2imgBtn',
    inputId: 'img2imgInput',
    outputId: 'img2imgOutput',
    spinId: 'img2imgSpin',
    endpoint: '/convert/image',
    previewExt: ['jpg','jpeg','png','bmp','tiff','svg','webp','avif','heic','heif'],
    extraFields: () => ({ compress: document.getElementById('img2imgQuality').value,
                          to_format: document.getElementById('img2imgFormat').value })
  },
  {
    btnId: 'office2pdfBtn',
    inputId: 'office2pdfInput',
    outputId: 'office2pdfOutput',
    spinId: 'office2pdfSpin',
    endpoint: '/convert/office',
    previewExt: ['pdf'],
    extraFields: () => ({ compress: document.getElementById('office2pdfQuality').value,
                          ocr_lang: document.getElementById('office2pdfLang').value })
  }
];

// Helper to create output pill HTML
function createFilePill(fileData, previewExt) {
  const ext = fileData.filename.split('.').pop().toLowerCase();
  return `
    <span class="file-pill output-pill">
      <span>${fileData.filename}</span>
      <span class="badge bg-success text-dark">${Math.round(fileData.compressed_size/1024)} KB</span>
      <a class="btn btn-outline-success btn-sm btn-download" href="${fileData.download_url}" target="_blank">Download</a>
      ${previewExt.includes(ext) ? `<button class="btn btn-outline-primary btn-sm btn-preview" onclick="showPreviewLink('${fileData.download_url}', '${fileData.filename}')">Preview</button>` : ''}
    </span>
  `;
}

// Main setup function
SECTIONS.forEach(sec => {
  const btn = document.getElementById(sec.btnId);
  const spinner = document.getElementById(sec.spinId);
  const output = document.getElementById(sec.outputId);
  const input = document.getElementById(sec.inputId);

  btn.addEventListener('click', async () => {
    const files = Array.from(input.files);
    if (!files.length) return alert('Please select at least one file.');
    spinner.style.display = 'inline-block';
    btn.disabled = true;
    output.innerHTML = '';

    try {
      const formFields = sec.extraFields();
      const result = await uploadAndConvert(API_BASE + sec.endpoint, files, formFields);

      let html = result.results.map(r => createFilePill(r, sec.previewExt)).join('');

      if (result.results.length > 1) {
        html += `<button class="btn btn-outline-primary btn-sm mt-2 download-zip-btn" onclick="bulkZipDownload('${sec.endpoint}', ${JSON.stringify(formFields)})">Download All as ZIP</button>`;
      }

      output.innerHTML = html;
    } catch (err) {
      alert('API Error: ' + err.message);
    } finally {
      spinner.style.display = 'none';
      btn.disabled = false;
    }
  });
});

// Bulk ZIP download helper
async function bulkZipDownload(endpoint, formFields) {
  let files = [];
  // Collect all selected files from all sections
  SECTIONS.forEach(sec => {
    const input = document.getElementById(sec.inputId);
    if (input.files.length) files.push(...Array.from(input.files));
  });
  if (!files.length) return alert('No files selected for ZIP download.');

  try {
    const blob = await uploadAndConvertZip(API_BASE + '/convert/zip', files, formFields.convert_type || 'auto', formFields.compress || 80);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = "converted_files.zip";
    a.click();
  } catch (err) {
    alert('ZIP API Error: ' + err.message);
  }
}

// Preview modal
window.showPreviewLink = function(url, name) {
  let ext = name.split('.').pop().toLowerCase();
  let html = '';
  if (['jpg','jpeg','png','bmp','svg','webp','avif','heic','heif'].includes(ext)) {
    html = `<img src="${url}" class="preview-image mb-2"><div>${name}</div>`;
  } else if (ext === 'pdf') {
    html = `<iframe src="${url}" class="preview-pdf"></iframe><div>${name}</div>`;
  } else {
    html = `<div>No preview available for ${ext.toUpperCase()}.</div>`;
  }
  document.getElementById('previewContent').innerHTML = html;
  new bootstrap.Modal(document.getElementById('previewModal')).show();
};