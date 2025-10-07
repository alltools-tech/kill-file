# Use official Python image
FROM python:3.11-slim

WORKDIR /app

# Copy requirements
COPY ../worker/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy rest of worker code
COPY ../worker .

# Start command (change to your main file)
CMD ["python", "src/main.py"]