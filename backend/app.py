from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse, StreamingResponse
from typing import List, Optional
import io
import zipfile

app = FastAPI(
    title="Kill File Backend API",
    description="Universal Files Converter & Compressor – PDF, Images, Office, OCR, Bulk ZIP",
    version="0.1.0",
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
    # TODO: Implement PDF compress/ocr logic
    results = []
    for f in files:
        # Demo: Just echo file info
        content = await f.read()
        results.append({
            "filename": f.filename,
            "size": len(content),
            "compressed_size": int(len(content) * compress / 100),
            "ocr_lang": ocr_lang,
            "download_url": f"/download/{f.filename}"
        })
    return JSONResponse(content={"results": results})

@app.post("/convert/image")
async def convert_image(
    files: List[UploadFile] = File(...),
    to_format: str = Form("jpg"),
    compress: int = Form(80)
):
    # TODO: Implement image conversion/compression logic
    results = []
    for f in files:
        content = await f.read()
        out_name = f"{f.filename.rsplit('.',1)[0]}.{to_format}"
        results.append({
            "filename": out_name,
            "size": len(content),
            "compressed_size": int(len(content) * compress / 100),
            "download_url": f"/download/{out_name}"
        })
    return JSONResponse(content={"results": results})

@app.post("/convert/office")
async def convert_office(
    files: List[UploadFile] = File(...),
    ocr_lang: Optional[str] = Form("none"),
    compress: int = Form(80)
):
    # TODO: Implement office to PDF/OCR logic
    results = []
    for f in files:
        content = await f.read()
        out_name = f"{f.filename.rsplit('.',1)[0]}.pdf"
        results.append({
            "filename": out_name,
            "size": len(content),
            "compressed_size": int(len(content) * compress / 100),
            "ocr_lang": ocr_lang,
            "download_url": f"/download/{out_name}"
        })
    return JSONResponse(content={"results": results})

@app.post("/convert/zip")
async def convert_zip(
    files: List[UploadFile] = File(...),
    convert_type: str = Form("pdf"),
    compress: int = Form(80)
):
    # TODO: Implement bulk conversion, return ZIP
    mem_zip = io.BytesIO()
    with zipfile.ZipFile(mem_zip, mode="w", compression=zipfile.ZIP_DEFLATED) as zf:
        for f in files:
            file_bytes = await f.read()
            zf.writestr(f.filename, file_bytes)
    mem_zip.seek(0)
    return StreamingResponse(mem_zip, media_type="application/zip", headers={
        "Content-Disposition": "attachment; filename=converted_files.zip"
    })

# Demo download endpoint (not secure, for test only)
@app.get("/download/{filename}")
async def download_file(filename: str):
    # TODO: Serve the actual converted file
    # For now, send dummy file
    dummy_content = b"Demo file content"
    return StreamingResponse(io.BytesIO(dummy_content), media_type="application/octet-stream", headers={
        "Content-Disposition": f"attachment; filename={filename}"
    })