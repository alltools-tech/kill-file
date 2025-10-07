// Helper: Convert FileList to FormData for bulk upload
export async function uploadAndConvert(endpoint, files, formFields = {}) {
    const formData = new FormData();
    files.forEach(f => formData.append('files', f));
    Object.entries(formFields).forEach(([k, v]) => formData.append(k, v));

    let response = await fetch(endpoint, {
        method: 'POST',
        body: formData
    });
    if (!response.ok) throw new Error("Conversion API error");
    return await response.json();
}

// Example usage in your HTML page (replace with event handlers)
// Convert PDF
async function handlePdfConvert(files, compress, ocrLang) {
    try {
        let result = await uploadAndConvert(
            "http://localhost:8000/convert/pdf",
            files,
            { compress, ocr_lang: ocrLang }
        );
        // result.results = [{filename, size, compressed_size, ocr_lang, ocr_text, download_url}]
        // Update output area, show download/preview buttons
        console.log(result.results);
    } catch (err) {
        alert('API Error: ' + err.message);
    }
}

// Convert Image
async function handleImageConvert(files, toFormat, compress) {
    try {
        let result = await uploadAndConvert(
            "http://localhost:8000/convert/image",
            files,
            { to_format: toFormat, compress }
        );
        console.log(result.results);
    } catch (err) {
        alert('API Error: ' + err.message);
    }
}

// Convert Office
async function handleOfficeConvert(files, compress, ocrLang) {
    try {
        let result = await uploadAndConvert(
            "http://localhost:8000/convert/office",
            files,
            { compress, ocr_lang: ocrLang }
        );
        console.log(result.results);
    } catch (err) {
        alert('API Error: ' + err.message);
    }
}

// Bulk ZIP convert
async function handleBulkZipConvert(files, convertType, compress) {
    const formData = new FormData();
    files.forEach(f => formData.append('files', f));
    formData.append('convert_type', convertType);
    formData.append('compress', compress);

    let response = await fetch("http://localhost:8000/convert/zip", {
        method: 'POST',
        body: formData
    });
    if (!response.ok) throw new Error("Bulk ZIP API error");
    // Download ZIP file
    const blob = await response.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = "converted_files.zip";
    a.click();
}

// OCR on image
async function handleOcrImage(file, lang) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('lang', lang);

    let response = await fetch("http://localhost:8000/ocr/image", {
        method: 'POST',
        body: formData
    });
    if (!response.ok) throw new Error("OCR API error");
    let data = await response.json();
    return data.ocr_text;
}