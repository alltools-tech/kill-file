import pytesseract
from PIL import Image
import io

def ocr_image_bytes(image_bytes, lang="eng"):
    """
    Run OCR on image bytes using Tesseract. Supports multi-language.
    Supported langs: eng, hin, urd, chi, jpn, ara, rus, fra (install traineddata files).
    """
    img = Image.open(io.BytesIO(image_bytes))
    text = pytesseract.image_to_string(img, lang=lang)
    return text

def ocr_pdf_bytes(pdf_bytes, lang="eng"):
    """
    Stub for PDF OCR: extract images from PDF pages and run Tesseract.
    Real implementation: render PDF page to image, then run OCR.
    """
    # TODO: Use fitz/PyMuPDF to render pages as images, then call ocr_image_bytes
    return "OCR from PDF not implemented in demo."