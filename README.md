# Kill File – Universal Files Converter & Compressor

Convert, compress, and OCR: PDF, Images, Office files. Bulk ZIP, multi-language OCR. Free, open source.

---

## Features

- PDF to PDF, compress, OCR
- PDF to Images (JPG, PNG, etc)
- Images to PDF/OCR
- Images to Images (convert/compress)
- Office to PDF/OCR (DOCX, XLSX, PPTX, TXT, etc)
- Bulk ZIP download
- Multi-language OCR (English, Hindi, Urdu, Chinese, Japanese, Arabic, Russian, French)
- 12 MB max file size, secure validation
- Download and preview
- Help & Contact cards (frontend)

---

## Quickstart

### 1. Install Dependencies

```sh
pip install -r backend/requirements.txt
```

### 2. Run Backend (API Server)

```sh
uvicorn backend.app:app --reload
```
Or if you're in the backend folder:
```sh
uvicorn app:app --reload
```

### 3. Frontend (Web App)

- Open `web-app/src/index.html` in your browser
- Or run a local web server:
  ```sh
  cd web-app/src
  python -m http.server 8001
  ```
  Visit: [http://localhost:8001/index.html](http://localhost:8001/index.html)

### 4. Test API

- Use browser UI
- Or run:
  ```sh
  python backend/test_api.py
  ```

---

## API Endpoints

| Endpoint              | Method | Description                          |
|-----------------------|--------|--------------------------------------|
| `/health`             | GET    | Health check                         |
| `/convert/pdf`        | POST   | PDF to PDF/compress/OCR              |
| `/convert/image`      | POST   | Images convert/compress              |
| `/convert/office`     | POST   | Office to PDF/OCR                    |
| `/convert/zip`        | POST   | Bulk conversion + ZIP download       |
| `/ocr/image`          | POST   | OCR on image                         |
| `/download/{file}`    | GET    | Download converted file              |

**Fields:**  
- `files`: upload files (form-data, multiple)
- `compress`: compression quality (10-100)
- `ocr_lang`: OCR language (eng, hin, urd, chi, jpn, ara, rus, fra)
- `to_format`: image format (jpg, png, etc) for image endpoints

---

## Security Notes

- Only allowed file types/extensions (see app.py)
- Max file size: 12 MB per file
- All uploads and downloads validated

---

## Deployment

- Host backend with FastAPI/Uvicorn (local or cloud)
- Frontend is static HTML, can be served from any web host
- For HTTPS/domain, use Nginx/Cloudflare/CDN

---

## Contributing

- Star, fork, and PRs welcome!
- Issues/feature requests: [GitHub Issues](https://github.com/alltools-tech/killfile/issues)
- Contact: support@killfile.io or Telegram [@killfile_support](https://t.me/killfile_support)

---

## License

MIT License

---

## Credits

- Powered by FastAPI, Pillow, pytesseract, Bootstrap, etc.