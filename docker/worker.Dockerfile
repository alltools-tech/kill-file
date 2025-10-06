# ===== Python Worker (Kill File Project) =====
FROM python:3.11-slim

WORKDIR /app

# ===== Install System Packages and Fonts =====
RUN apt-get update && apt-get install -y \
    tesseract-ocr-all \
    fonts-noto \
    fonts-noto-cjk \
    fonts-noto-color-emoji \
    fonts-freefont-ttf \
    poppler-utils \
    libreoffice \
    ghostscript \
    python3-pip \
    unzip \
    wget \
    && rm -rf /var/lib/apt/lists/*

# ===== Copy and Install Python Dependencies =====
COPY worker/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt || true

# ===== Copy Worker Source Code =====
COPY worker/ ./

# ===== Default OCR and Font Env =====
ENV TESSERACT_LANG=eng+hin+ara+chi_sim+jpn+kor+fra+spa+rus
ENV LANG=C.UTF-8
ENV PYTHONIOENCODING=utf-8

# ===== Start Worker ====
CMD ["python", "worker.py"]