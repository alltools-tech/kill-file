# Architecture Overview – Kill File

Below is an architecture diagram (Mermaid syntax) to visualize the system’s main components and their interactions.

```mermaid
flowchart TD
    User[User (Android/Web)]
    UI[UI (Bootstrap/Material)]
    API[Backend API (Python/Java)]
    PDFConv[PDF Converter/Compressor]
    ImgConv[Image Converter/Compressor]
    OfficeConv[Office to PDF]
    OCR[OCR Engine (Tesseract/ML Kit)]
    Storage[(Device/Cloud Storage)]
    User --> UI
    UI --> API
    API --> PDFConv
    API --> ImgConv
    API --> OfficeConv
    PDFConv --> OCR
    ImgConv --> OCR
    PDFConv --> Storage
    ImgConv --> Storage
    OfficeConv --> Storage
    OCR --> Storage
```

## Components

- **User**: Android app or Web user
- **UI**: User interface (Android, Bootstrap/Material web)
- **API**: Backend server (Python/Java) for heavy processing
- **PDFConv**: PDF conversion and compression engine
- **ImgConv**: Image conversion and compression engine
- **OfficeConv**: Office files to PDF engine
- **OCR**: Optical Character Recognition engine (multi-language)
- **Storage**: Device or cloud storage (Google Drive, Dropbox, etc.)

---

> Next: docs/usage.md (basic usage instructions)