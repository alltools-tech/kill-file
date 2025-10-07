FROM python:3.11-slim
WORKDIR /app
COPY ./worker/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY ./worker/src ./src
CMD ["python", "src/main.py"]