# Roadmap – Kill File

## 1. Research & Planning
- Trend analysis of file types, user needs, competitors (ilovepdf, smallpdf, pdf2go, cloudconvert)
- Decide core features & technology stack

## 2. Core Features
- PDF to PDF (compress + OCR)
- PDF to image (jpeg, png, bmp, tiff, svg, webp, avif, heic, heif) + compress
- Image to PDF (all formats) + compress
- Office files (docx, xlsx, pptx, csv, txt) to PDF + compress
- Bulk/single file operations
- Multi-language support (UI + OCR)

## 3. Tech Stack Selection
- Android: Java/Kotlin, PDFBox-Android, ML Kit/Tesseract, ImageMagick/libvips
- Backend (optional): Python (Flask/FastAPI), Java (Spring), LibreOffice, Pillow, PyMuPDF
- Web: Bootstrap, Material Design, JS

## 4. Architecture Design
- Draw architecture (see docs/architecture.md)
- Plan UI/UX (mobile-first, drag-drop, batch)

## 5. Development Steps
- [ ] Android app basic skeleton
- [ ] PDF conversion/compression
- [ ] Image conversion/compression
- [ ] Office to PDF conversion
- [ ] OCR integration
- [ ] Bulk file support
- [ ] Multi-language UI & OCR
- [ ] Web frontend (optional)
- [ ] Backend API (optional)
- [ ] Sample files & testing
- [ ] Documentation (usage, guides)
- [ ] SEO & marketing content

## 6. Testing & Optimization
- Test all major file formats, bulk/single, compression
- Optimize speed, memory, UI
- Add user feedback

## 7. Launch & Promotion
- Publish on GitHub, Play Store (if Android)
- Share on forums, social media
- Add tutorials, FAQs

---

> Next: docs/architecture.md (overview diagram)