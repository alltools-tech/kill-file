from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse, StreamingResponse
from typing import List, Optional
import io
import zipfile
import os

from utils.pdf_utils import pdf_to_pdf
from utils.image_utils import image_to_image
from utils.office_utils import office_to_pdf_with_ocr
from utils.ocr_utils import ocr_image_bytes

app = FastAPI(
    title="Kill File Backend API",
    description="Universal Files Converter & Compressor – PDF, Images, Office, OCR, Bulk ZIP",
    version="0.2.0",
)

@app.get("/health")
def health():
    return {"status": "ok", "message": "API running"}

@app.post("/convert/pdf")
async def convert_pdf(
    files: List[UploadFile] = File(...),
    compress: int = Form(80),
    ocr_lang: Optional[str] = Form("none")
):
    results = []
    for f in files:
        content = await f.read()
        out_bytes, ocr_text = pdf_to_pdf(content, quality=compress, ocr_lang=ocr_lang if ocr_lang != "none" else None)
        out_name = f.filename.rsplit('.',1)[0] + "_out.pdf"
        # Save file for download simulation
        with open(os.path.join("converted", out_name), "wb") as outf:
            outf.write(out_bytes)
        results.append({
            "filename": out_name,
            "size": len(content),
            "compressed_size": len(out_bytes),
            "ocr_lang": ocr_lang,
            "ocr_text": ocr_text,
            "download_url": f"/download/{out_name}"
        })
    return JSONResponse(content={"results": results})

@app.post("/convert/image")
async def convert_image(
    files: List[UploadFile] = File(...),
    to_format: str = Form("jpg"),
    compress: int = Form(80)
):
    results = []
    for f in files:
        content = await f.read()
        out_name = f"{f.filename.rsplit('.',1)[0]}_out.{to_format}"
        out_bytes = image_to_image(content, to_format=to_format, quality=compress)
        with open(os.path.join("converted", out_name), "wb") as outf:
            outf.write(out_bytes)
        results.append({
            "filename": out_name,
            "size": len(content),
            "compressed_size": len(out_bytes),
            "download_url": f"/download/{out_name}"
        })
    return JSONResponse(content={"results": results})

@app.post("/convert/office")
async def convert_office(
    files: List[UploadFile] = File(...),
    ocr_lang: Optional[str] = Form("none"),
    compress: int = Form(80)
):
    results = []
    for f in files:
        content = await f.read()
        ext = f.filename.rsplit('.',1)[-1]
        out_name = f"{f.filename.rsplit('.',1)[0]}_out.pdf"
        out_bytes, ocr_text = office_to_pdf_with_ocr(content, file_ext=ext, ocr_lang=ocr_lang if ocr_lang != "none" else None)
        with open(os.path.join("converted", out_name), "wb") as outf:
            outf.write(out_bytes)
        results.append({
            "filename": out_name,
            "size": len(content),
            "compressed_size": len(out_bytes),
            "ocr_lang": ocr_lang,
            "ocr_text": ocr_text,
            "download_url": f"/download/{out_name}"
        })
    return JSONResponse(content={"results": results})

@app.post("/convert/zip")
async def convert_zip(
    files: List[UploadFile] = File(...),
    convert_type: str = Form("pdf"),
    compress: int = Form(80)
):
    # Convert all files, add to ZIP, return ZIP file
    mem_zip = io.BytesIO()
    with zipfile.ZipFile(mem_zip, mode="w", compression=zipfile.ZIP_DEFLATED) as zf:
        for f in files:
            file_bytes = await f.read()
            ext = f.filename.rsplit('.',1)[-1]
            # Use pdf/image/office utils accordingly
            if convert_type == "pdf":
                out_bytes, _ = pdf_to_pdf(file_bytes, quality=compress)
                out_name = f"{f.filename.rsplit('.',1)[0]}_out.pdf"
            elif convert_type == "image":
                out_bytes = image_to_image(file_bytes, to_format="jpg", quality=compress)
                out_name = f"{f.filename.rsplit('.',1)[0]}_out.jpg"
            elif convert_type == "office":
                out_bytes, _ = office_to_pdf_with_ocr(file_bytes, file_ext=ext)
                out_name = f"{f.filename.rsplit('.',1)[0]}_out.pdf"
            else:
                out_bytes = file_bytes
                out_name = f.filename
            zf.writestr(out_name, out_bytes)
    mem_zip.seek(0)
    return StreamingResponse(mem_zip, media_type="application/zip", headers={
        "Content-Disposition": "attachment; filename=converted_files.zip"
    })

@app.post("/ocr/image")
async def ocr_image(
    file: UploadFile = File(...),
    lang: str = Form("eng")
):
    content = await file.read()
    text = ocr_image_bytes(content, lang=lang)
    return JSONResponse(content={"filename": file.filename, "ocr_text": text})

# Demo download endpoint (not secure, for test only)
@app.get("/download/{filename}")
async def download_file(filename: str):
    path = os.path.join("converted", filename)
    if not os.path.exists(path):
        return JSONResponse(content={"error":"File not found"}, status_code=404)
    with open(path, "rb") as f:
        content = f.read()
    return StreamingResponse(io.BytesIO(content), media_type="application/octet-stream", headers={
        "Content-Disposition": f"attachment; filename={filename}"
    })

# Ensure converted/ folder exists
os.makedirs("converted", exist_ok=True)