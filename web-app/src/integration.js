// Integration code to wire HTML buttons to backend API

// PDF to PDF/OCR
document.getElementById('pdf2pdfBtn').addEventListener('click', async function() {
    const files = Array.from(document.getElementById('pdf2pdfInput').files);
    const compress = document.getElementById('pdf2pdfQuality').value;
    const ocrLang = document.getElementById('pdf2pdfLang').value;
    const spinner = document.getElementById('pdf2pdfSpin');
    spinner.style.display = 'inline-block';
    try {
        let result = await uploadAndConvert("http://localhost:8000/convert/pdf", files, {compress, ocr_lang: ocrLang});
        spinner.style.display = 'none';
        let html = result.results.map(r => `
            <span class="file-pill output-pill">
                <span>${r.filename}</span>
                <span class="badge bg-success text-dark">${Math.round(r.compressed_size/1024)} KB</span>
                <a class="btn btn-outline-success btn-sm btn-download" href="${r.download_url}" target="_blank">Download</a>
                <button class="btn btn-outline-primary btn-sm btn-preview" onclick="showPreviewLink('${r.download_url}', '${r.filename}')">Preview</button>
            </span>
        `).join('');
        if (result.results.length > 1) {
            html += `<button class="btn btn-outline-primary btn-sm mt-2 download-zip-btn" onclick="bulkZipDownload('pdf', ${compress})">Download All as ZIP</button>`;
        }
        document.getElementById('pdf2pdfOutput').innerHTML = html;
    } catch (err) {
        spinner.style.display = 'none';
        alert('API Error: ' + err.message);
    }
});

// PDF to Image
document.getElementById('pdf2imgBtn').addEventListener('click', async function() {
    const files = Array.from(document.getElementById('pdf2imgInput').files);
    const toFormat = document.getElementById('pdf2imgFormat').value;
    const compress = document.getElementById('pdf2imgQuality').value;
    const spinner = document.getElementById('pdf2imgSpin');
    spinner.style.display = 'inline-block';
    try {
        let result = await uploadAndConvert("http://localhost:8000/convert/image", files, {to_format: toFormat, compress});
        spinner.style.display = 'none';
        let html = result.results.map(r => `
            <span class="file-pill output-pill">
                <span>${r.filename}</span>
                <span class="badge bg-success text-dark">${Math.round(r.compressed_size/1024)} KB</span>
                <a class="btn btn-outline-success btn-sm btn-download" href="${r.download_url}" target="_blank">Download</a>
                <button class="btn btn-outline-primary btn-sm btn-preview" onclick="showPreviewLink('${r.download_url}', '${r.filename}')">Preview</button>
            </span>
        `).join('');
        if (result.results.length > 1) {
            html += `<button class="btn btn-outline-primary btn-sm mt-2 download-zip-btn" onclick="bulkZipDownload('image', ${compress})">Download All as ZIP</button>`;
        }
        document.getElementById('pdf2imgOutput').innerHTML = html;
    } catch (err) {
        spinner.style.display = 'none';
        alert('API Error: ' + err.message);
    }
});

// Images to PDF/OCR
document.getElementById('img2pdfBtn').addEventListener('click', async function() {
    const files = Array.from(document.getElementById('img2pdfInput').files);
    const compress = document.getElementById('img2pdfQuality').value;
    const ocrLang = document.getElementById('img2pdfLang').value;
    const spinner = document.getElementById('img2pdfSpin');
    spinner.style.display = 'inline-block';
    try {
        let result = await uploadAndConvert("http://localhost:8000/convert/pdf", files, {compress, ocr_lang: ocrLang});
        spinner.style.display = 'none';
        let html = result.results.map(r => `
            <span class="file-pill output-pill">
                <span>${r.filename}</span>
                <span class="badge bg-success text-dark">${Math.round(r.compressed_size/1024)} KB</span>
                <a class="btn btn-outline-success btn-sm btn-download" href="${r.download_url}" target="_blank">Download</a>
                <button class="btn btn-outline-primary btn-sm btn-preview" onclick="showPreviewLink('${r.download_url}', '${r.filename}')">Preview</button>
            </span>
        `).join('');
        if (result.results.length > 1) {
            html += `<button class="btn btn-outline-primary btn-sm mt-2 download-zip-btn" onclick="bulkZipDownload('pdf', ${compress})">Download All as ZIP</button>`;
        }
        document.getElementById('img2pdfOutput').innerHTML = html;
    } catch (err) {
        spinner.style.display = 'none';
        alert('API Error: ' + err.message);
    }
});

// Images to Images
document.getElementById('img2imgBtn').addEventListener('click', async function() {
    const files = Array.from(document.getElementById('img2imgInput').files);
    const toFormat = document.getElementById('img2imgFormat').value;
    const compress = document.getElementById('img2imgQuality').value;
    const spinner = document.getElementById('img2imgSpin');
    spinner.style.display = 'inline-block';
    try {
        let result = await uploadAndConvert("http://localhost:8000/convert/image", files, {to_format: toFormat, compress});
        spinner.style.display = 'none';
        let html = result.results.map(r => `
            <span class="file-pill output-pill">
                <span>${r.filename}</span>
                <span class="badge bg-success text-dark">${Math.round(r.compressed_size/1024)} KB</span>
                <a class="btn btn-outline-success btn-sm btn-download" href="${r.download_url}" target="_blank">Download</a>
                <button class="btn btn-outline-primary btn-sm btn-preview" onclick="showPreviewLink('${r.download_url}', '${r.filename}')">Preview</button>
            </span>
        `).join('');
        if (result.results.length > 1) {
            html += `<button class="btn btn-outline-primary btn-sm mt-2 download-zip-btn" onclick="bulkZipDownload('image', ${compress})">Download All as ZIP</button>`;
        }
        document.getElementById('img2imgOutput').innerHTML = html;
    } catch (err) {
        spinner.style.display = 'none';
        alert('API Error: ' + err.message);
    }
});

// Office to PDF/OCR
document.getElementById('office2pdfBtn').addEventListener('click', async function() {
    const files = Array.from(document.getElementById('office2pdfInput').files);
    const compress = document.getElementById('office2pdfQuality').value;
    const ocrLang = document.getElementById('office2pdfLang').value;
    const spinner = document.getElementById('office2pdfSpin');
    spinner.style.display = 'inline-block';
    try {
        let result = await uploadAndConvert("http://localhost:8000/convert/office", files, {compress, ocr_lang: ocrLang});
        spinner.style.display = 'none';
        let html = result.results.map(r => `
            <span class="file-pill output-pill">
                <span>${r.filename}</span>
                <span class="badge bg-success text-dark">${Math.round(r.compressed_size/1024)} KB</span>
                <a class="btn btn-outline-success btn-sm btn-download" href="${r.download_url}" target="_blank">Download</a>
                <button class="btn btn-outline-primary btn-sm btn-preview" onclick="showPreviewLink('${r.download_url}', '${r.filename}')">Preview</button>
            </span>
        `).join('');
        if (result.results.length > 1) {
            html += `<button class="btn btn-outline-primary btn-sm mt-2 download-zip-btn" onclick="bulkZipDownload('office', ${compress})">Download All as ZIP</button>`;
        }
        document.getElementById('office2pdfOutput').innerHTML = html;
    } catch (err) {
        spinner.style.display = 'none';
        alert('API Error: ' + err.message);
    }
});

// Bulk ZIP download handler
function bulkZipDownload(type, compress) {
    let files = [];
    switch(type) {
        case 'pdf': files = [...document.getElementById('pdf2pdfInput').files]; break;
        case 'image': files = [...document.getElementById('pdf2imgInput').files, ...document.getElementById('img2imgInput').files]; break;
        case 'office': files = [...document.getElementById('office2pdfInput').files]; break;
    }
    uploadAndConvertZip("http://localhost:8000/convert/zip", files, type, compress)
        .then(blob => {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = "converted_files.zip";
            a.click();
        })
        .catch(err => alert('ZIP API Error: ' + err.message));
}

// Preview modal for download link
window.showPreviewLink = function(url, name) {
    let ext = name.split('.').pop().toLowerCase();
    let previewHtml = '';
    if (['jpg','jpeg','png','bmp','svg','webp','avif','heic','heif'].includes(ext)) {
        previewHtml = `<img src="${url}" class="preview-image mb-2"><div>${name}</div>`;
    } else if (ext === 'pdf') {
        previewHtml = `<iframe src="${url}" class="preview-pdf"></iframe><div>${name}</div>`;
    } else {
        previewHtml = `<div>No preview available for ${ext.toUpperCase()}.</div>`;
    }
    document.getElementById('previewContent').innerHTML = previewHtml;
    const modal = new bootstrap.Modal(document.getElementById('previewModal'));
    modal.show();
};