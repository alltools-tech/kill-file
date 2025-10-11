// integration.js
// Handles UI + API integration for Kill File

// Utility to get file extension
function getExt(name) {
  return name.split('.').pop().toLowerCase();
}

// Show error alert
function showError(msg) {
  const alert = document.getElementById('errorAlert');
  alert.textContent = msg;
  alert.classList.remove('d-none');
  setTimeout(() => alert.classList.add('d-none'), 3500);
}

// File section setup
function setupFileSection(section, allowedPreview = ['pdf','jpg','jpeg','png','bmp','svg','webp','avif','heic','heif']) {
  const dropZone = document.getElementById(section + 'Drop');
  const fileInput = document.getElementById(section + 'Input');
  const fileList = document.getElementById(section + 'List');
  let files = [];

  dropZone.addEventListener('click', () => fileInput.click());
  dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
  });
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) handleFiles(fileInput.files);
  });

  function handleFiles(selectedFiles) {
    files = Array.from(selectedFiles);
    fileList.innerHTML = files.map(f =>
      `<span class="file-pill">
        <i class="bi bi-file-earmark"></i>
        <span>${f.name}</span>
        <span class="badge bg-light text-dark">${getExt(f.name).toUpperCase()}</span>
        <span class="badge bg-info text-dark">${(f.size/1024/1024).toFixed(2)} MB</span>
      </span>`
    ).join('');
  }

  return () => files;
}

// Compression slider sync
function setupQualitySlider(sliderId, valId) {
  const slider = document.getElementById(sliderId);
  const val = document.getElementById(valId);
  slider.addEventListener('input', () => { val.textContent = slider.value + '%'; });
}

// Preview modal
function showPreview(ext, url) {
  let previewHtml = '';
  if (['jpg','jpeg','png','bmp','svg','webp','avif','heic','heif'].includes(ext)) {
    previewHtml = `<img src="${url}" class="preview-image mb-2"><div>${url.split('/').pop()}</div>`;
  } else if (ext === 'pdf') {
    previewHtml = `<iframe src="${url}" class="preview-pdf"></iframe><div>${url.split('/').pop()}</div>`;
  } else {
    previewHtml = `<div>No preview available for ${ext.toUpperCase()}</div>`;
  }
  document.getElementById('previewContent').innerHTML = previewHtml;
  const modal = new bootstrap.Modal(document.getElementById('previewModal'));
  modal.show();
}

// Main convert button setup
function setupConvertButtonAPI(btnId, spinId, getFilesFn, outputId, options={}) {
  const btn = document.getElementById(btnId);
  const spin = document.getElementById(spinId);
  const output = document.getElementById(outputId);

  btn.addEventListener('click', async () => {
    const files = getFilesFn();
    if (!files.length) return showError('Please select at least one file.');
    
    spin.style.display = 'inline-block';
    btn.disabled = true;
    output.innerHTML = '';

    try {
      let results = [];
      // Determine type of conversion
      if (options.type === 'ocr') {
        // OCR single file at a time
        for (const f of files) {
          const res = await ocrImage(`${API_BASE}/ocr`, f, options.lang || 'eng');
          results.push({url: res.file_url, name: f.name});
        }
      } else if (files.length > 1 && options.zip) {
        // Bulk ZIP conversion
        const zipBlob = await uploadAndConvertZip(`${API_BASE}/${options.endpoint}`, files, options.convertType, options.compress || 80);
        const zipUrl = URL.createObjectURL(zipBlob);
        output.innerHTML = `<a class="btn btn-outline-primary" href="${zipUrl}" download="converted-files.zip">Download All as ZIP</a>`;
        spin.style.display = 'none';
        btn.disabled = false;
        return;
      } else {
        // Regular conversion
        const formFields = {};
        if (options.compress) formFields.compress = options.compress;
        if (options.lang) formFields.lang = options.lang;
        const res = await uploadAndConvert(`${API_BASE}/${options.endpoint}`, files, formFields);
        results = res.files; // expecting [{file_url: '', name: ''}]
      }

      // Render output files
      output.innerHTML = results.map((f, idx) => {
        const ext = getExt(f.name);
        return `<span class="file-pill output-pill">
          <i class="bi bi-file-earmark-arrow-down"></i>
          <input class="edit-name-input" value="${f.name}" />
          <span class="badge bg-light text-dark">${ext.toUpperCase()}</span>
          <button class="btn btn-outline-success btn-sm btn-download" onclick="downloadFile('${f.url}', this.previousElementSibling.value)">Download</button>
          ${['pdf','jpg','jpeg','png','bmp','svg','webp','avif','heic','heif'].includes(ext) ? 
            `<button class="btn btn-outline-primary btn-sm btn-preview" onclick="showPreview('${ext}', '${f.url}')">Preview</button>` : ''}
        </span>`;
      }).join('');

    } catch (err) {
      showError(err.message);
    } finally {
      spin.style.display = 'none';
      btn.disabled = false;
    }
  });
}

// Helper download function
function downloadFile(url, name) {
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// --- Initialize all sections ---

const getPdf2pdfFiles = setupFileSection('pdf2pdf', ['pdf']);
const getPdf2imgFiles = setupFileSection('pdf2img', ['pdf']);
const getImg2pdfFiles = setupFileSection('img2pdf', ['jpg','jpeg','png','bmp','tiff','svg','webp','avif','heic','heif']);
const getImg2imgFiles = setupFileSection('img2img', ['jpg','jpeg','png','bmp','tiff','svg','webp','avif','heic','heif']);
const getOffice2pdfFiles = setupFileSection('office2pdf', ['doc','docx','xls','xlsx','ppt','pptx','csv','txt']);

// Setup sliders
setupQualitySlider('pdf2pdfQuality', 'pdf2pdfQualityVal');
setupQualitySlider('pdf2imgQuality', 'pdf2imgQualityVal');
setupQualitySlider('img2pdfQuality', 'img2pdfQualityVal');
setupQualitySlider('img2imgQuality', 'img2imgQualityVal');
setupQualitySlider('office2pdfQuality', 'office2pdfQualityVal');

// Convert buttons API integration
setupConvertButtonAPI('pdf2pdfBtn', 'pdf2pdfSpin', getPdf2pdfFiles, 'pdf2pdfOutput', {
  endpoint: 'convert/pdf2pdf',
  compress: document.getElementById('pdf2pdfQuality').value,
  lang: document.getElementById('pdf2pdfLang').value,
  type: 'convert',
  zip: true
});

setupConvertButtonAPI('pdf2imgBtn', 'pdf2imgSpin', getPdf2imgFiles, 'pdf2imgOutput', {
  endpoint: 'convert/pdf2img',
  compress: document.getElementById('pdf2imgQuality').value,
  type: 'convert',
  zip: true
});

setupConvertButtonAPI('img2pdfBtn', 'img2pdfSpin', getImg2pdfFiles, 'img2pdfOutput', {
  endpoint: 'convert/img2pdf',
  compress: document.getElementById('img2pdfQuality').value,
  lang: document.getElementById('img2pdfLang').value,
  type: 'convert',
  zip: true
});

setupConvertButtonAPI('img2imgBtn', 'img2imgSpin', getImg2imgFiles, 'img2imgOutput', {
  endpoint: 'convert/img2img',
  compress: document.getElementById('img2imgQuality').value,
  convertType: document.getElementById('img2imgFormat').value,
  type: 'convert',
  zip: true
});

setupConvertButtonAPI('office2pdfBtn', 'office2pdfSpin', getOffice2pdfFiles, 'office2pdfOutput', {
  endpoint: 'convert/office2pdf',
  compress: document.getElementById('office2pdfQuality').value,
  lang: document.getElementById('office2pdfLang').value,
  type: 'convert',
  zip: true
});