# Backend API – Kill File

This folder contains the API server for conversion, compression, and OCR.

## 🚀 Tech Stack

- Python 3.10+
- FastAPI (API framework)
- PyMuPDF / pdfminer.six (PDF tools)
- Pillow, OpenCV (images)
- LibreOffice (office conversion)
- Tesseract OCR (multi-language)

## 📂 Structure

```
backend/
├── app.py         # Main API server
├── requirements.txt
├── utils/         # Conversion/ocr helpers
├── README.md      # This file
```

## 🛠️ Features

- PDF compress, convert, OCR (multi-language)
- Image convert/compress (all formats)
- Office to PDF/OCR (docx, xlsx, pptx, etc)
- Bulk file support (ZIP)
- REST API endpoints for web-app

## 🌐 API Endpoints

| Method | Endpoint           | Description                        |
|--------|--------------------|------------------------------------|
| POST   | /convert/pdf       | PDF compress/convert/OCR           |
| POST   | /convert/image     | Image convert/compress             |
| POST   | /convert/office    | Office to PDF/OCR                  |
| POST   | /convert/zip       | Bulk ZIP conversion                |
| GET    | /health            | Health check                       |

## 💡 How to Run

1. Install Python 3.10+
2. `pip install -r requirements.txt`
3. `python app.py`
4. API runs at `http://localhost:8000`

---

> See app.py for endpoint code samples.