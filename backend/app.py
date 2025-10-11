import logging
import io
import zipfile
import os
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from backend.utils.pdf_utils import pdf_to_pdf
from backend.utils.image_utils import image_to_image
from backend.utils.office_utils import office_to_pdf_with_ocr
from backend.utils.ocr_utils import ocr_image_bytes

# ------------------ Config ------------------
ALLOWED_PDF = ['pdf']
ALLOWED_IMAGE = ['jpg', 'jpeg', 'png', 'bmp', 'tiff', 'svg', 'webp', 'avif', 'heic', 'heif']
ALLOWED_OFFICE = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'csv', 'txt']
MAX_FILE_SIZE = 12 * 1024 * 1024  # 12MB

# Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("killfile")

# App
app = FastAPI(
    title="Kill File Backend API",
    description="Universal Files Converter & Compressor",
    version="0.3.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # frontend may be anywhere
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Output folder
os.makedirs("converted", exist_ok=True)

# ------------------ Static & Templates ------------------
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
def root(request: Request):
    """Landing page"""
    return templates.TemplateResponse("index.html", {"request": request})

# ------------------ Helper ------------------
def validate_file(filename, content, allowed_exts):
    ext = filename.lower().rsplit('.', 1)[-1]
    if ext not in allowed_exts:
        raise HTTPException(status_code=400, detail=f"File type not allowed: {ext}")
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail=f"File too large: {filename}")

# ------------------ Existing API Routes ------------------
@app.get("/health")
def health():
    return {"status": "ok", "message": "API running"}

@app.post("/convert/pdf")
async def convert_pdf(files: List[UploadFile] = File(...), compress: int = Form(80), ocr_lang: Optional[str] = Form("none")):
    results = []
    for f in files:
        content = await f.read()
        validate_file(f.filename, content, ALLOWED_PDF)
        out_bytes, ocr_text = pdf_to_pdf(content, quality=compress, ocr_lang=None if ocr_lang == "none" else ocr_lang)
        out_name = f.filename.rsplit('.', 1)[0] + "_out.pdf"
        out_path = os.path.join("converted", out_name)
        with open(out_path, "wb") as outf:
            outf.write(out_bytes)
        results.append({
            "filename": out_name,
            "size": len(content),
            "compressed_size": len(out_bytes),
            "ocr_lang": ocr_lang,
            "download_url": f"/download/{out_name}"
        })
    return JSONResponse(content={"results": results})

@app.post("/convert/image")
async def convert_image(files: List[UploadFile] = File(...), to_format: str = Form("jpg"), compress: int = Form(80)):
    results = []
    for f in files:
        content = await f.read()
        validate_file(f.filename, content, ALLOWED_IMAGE)
        out_name = f"{f.filename.rsplit('.', 1)[0]}_out.{to_format}"
        out_bytes = image_to_image(content, to_format=to_format, quality=compress)
        out_path = os.path.join("converted", out_name)
        with open(out_path, "wb") as outf:
            outf.write(out_bytes)
        results.append({
            "filename": out_name,
            "download_url": f"/download/{out_name}"
        })
    return JSONResponse(content={"results": results})

@app.post("/convert/office")
async def convert_office(files: List[UploadFile] = File(...), ocr_lang: Optional[str] = Form("none"), compress: int = Form(80)):
    results = []
    for f in files:
        content = await f.read()
        validate_file(f.filename, content, ALLOWED_OFFICE)
        ext = f.filename.rsplit('.', 1)[-1]
        out_name = f"{f.filename.rsplit('.', 1)[0]}_out.pdf"
        out_bytes, _ = office_to_pdf_with_ocr(content, file_ext=ext, ocr_lang=None if ocr_lang == "none" else ocr_lang)
        out_path = os.path.join("converted", out_name)
        with open(out_path, "wb") as outf:
            outf.write(out_bytes)
        results.append({
            "filename": out_name,
            "download_url": f"/download/{out_name}"
        })
    return JSONResponse(content={"results": results})

@app.post("/convert/zip")
async def convert_zip(files: List[UploadFile] = File(...), convert_type: str = Form("pdf"), compress: int = Form(80)):
    mem_zip = io.BytesIO()
    with zipfile.ZipFile(mem_zip, mode="w", compression=zipfile.ZIP_DEFLATED) as zf:
        for f in files:
            file_bytes = await f.read()
            ext = f.filename.rsplit('.', 1)[-1]
            if convert_type == "pdf":
                validate_file(f.filename, file_bytes, ALLOWED_PDF)
                out_bytes, _ = pdf_to_pdf(file_bytes, quality=compress)
                out_name = f"{f.filename.rsplit('.', 1)[0]}_out.pdf"
            elif convert_type == "image":
                validate_file(f.filename, file_bytes, ALLOWED_IMAGE)
                out_bytes = image_to_image(file_bytes, to_format="jpg", quality=compress)
                out_name = f"{f.filename.rsplit('.', 1)[0]}_out.jpg"
            elif convert_type == "office":
                validate_file(f.filename, file_bytes, ALLOWED_OFFICE)
                out_bytes, _ = office_to_pdf_with_ocr(file_bytes, file_ext=ext)
                out_name = f"{f.filename.rsplit('.', 1)[0]}_out.pdf"
            else:
                out_bytes = file_bytes
                out_name = f.filename
            zf.writestr(out_name, out_bytes)
    mem_zip.seek(0)
    return StreamingResponse(mem_zip, media_type="application/zip", headers={
        "Content-Disposition": "attachment; filename=converted_files.zip"
    })

@app.post("/ocr/image")
async def ocr_image(file: UploadFile = File(...), lang: str = Form("eng")):
    content = await file.read()
    validate_file(file.filename, content, ALLOWED_IMAGE)
    text = ocr_image_bytes(content, lang=lang)
    return JSONResponse(content={"filename": file.filename, "ocr_text": text})

@app.get("/download/{filename}")
async def download_file(filename: str):
    path = os.path.join("converted", filename)
    if not os.path.exists(path):
        return JSONResponse(content={"error": "File not found"}, status_code=404)
    with open(path, "rb") as f:
        content = f.read()
    return StreamingResponse(io.BytesIO(content), media_type="application/octet-stream", headers={
        "Content-Disposition": f"attachment; filename={filename}"
    })