from backend.app import app

# Render or Gunicorn will use this
# Run with: gunicorn backend.passenger_wsgi:app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=10000)