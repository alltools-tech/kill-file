import io

def office_to_pdf(input_bytes, file_ext="docx"):
    """Stub for converting office files (docx, xlsx, pptx, etc) to PDF.
    Real implementation: use LibreOffice or unoconv for conversion."""
    # Demo: just echo input (should convert to PDF in real code)
    output_pdf = input_bytes  # Replace with real conversion
    return output_pdf

def office_to_pdf_with_ocr(input_bytes, file_ext="docx", ocr_lang="eng"):
    """Stub for office to PDF + OCR."""
    # Real implementation: convert to PDF, then apply OCR if needed
    pdf_bytes = office_to_pdf(input_bytes, file_ext)
    ocr_text = "OCR text not implemented in demo."
    return pdf_bytes, ocr_text