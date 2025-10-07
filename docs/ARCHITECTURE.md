# Universal File Converter — Architecture & Flow Diagram (Free OSS)

## Quick Summary

Ek scalable, fault-tolerant microservice architecture jisme frontend, API gateway, object storage, queue, workers (image/office/pdf/ocr/compress), virus-scan, monitoring, aur admin components hain — sab Dockerize karke MinIO + Redis + PostgreSQL ke saath run karte hain.

(Full diagram and details from your previous message…)

## UI Cards Overview

…[full content above]…

## High-Level Architecture Diagram

```mermaid
flowchart TB
  subgraph Client
    A[User Browser / Mobile]
  end
  subgraph Frontend
    B[Upload UI (React/Next.js)]
    C[Ws/SSE Status]
  end
  subgraph API
    G[API Gateway (Node/TS - Fastify)]
    Auth[(Auth / Rate-limit)]
    Presign[Presigned Uploads]
  end
  subgraph Storage
    S3[(MinIO / S3)]
  end
  subgraph Queue
    Redis[(Redis)]
  end
  subgraph Workers
    W1[Ingest Worker - validation & ClamAV]
    W2[Image Worker - libvips, libheif, libavif]
    W3[Office Worker - LibreOffice headless]
    W4[PDF Worker - poppler, PyMuPDF, pikepdf]
    W5[OCR Worker - OCRmyPDF + Tesseract]
    W6[Compression Worker - mozjpeg, pngquant, ghostscript]
    DLQ[Dead Letter Queue]
  end
  subgraph Orchestration
    Celery[(Celery) or BullMQ]
    DB[(Postgres - job metadata)]
  end
  subgraph Observability
    Prom[Prometheus]
    Graf[Grafana]
    Sentry[Sentry]
    Logs[(ELK / Loki)]
  end
  A --> B
  B -->|request| G
  G --> Auth
  G --> Presign
  B --> C
  B -->|upload to presigned| S3
  G --> Redis
  S3 --> W1
  W1 --> Celery
  Celery --> W2
  Celery --> W3
  Celery --> W4
  Celery --> W5
  Celery --> W6
  W2 --> S3
  W3 --> S3
  W4 --> S3
  W5 --> S3
  W6 --> S3
  W1 --> DLQ
  W2 --> DLQ
  W3 --> DLQ
  W4 --> DLQ
  W5 --> DLQ
  W6 --> DLQ
  Celery --> DB
  W1 --> Prom
  W2 --> Prom
  W3 --> Prom
  W4 --> Prom
  W5 --> Prom
  W6 --> Prom
  Prom --> Graf
  Any --> Sentry
  Logs --> Graf
```

…[rest of content as per above detailed architecture]…