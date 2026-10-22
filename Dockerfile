FROM python:3.11-slim

# Install system dependencies, including git-lfs for large model files
RUN apt-get update && \
    apt-get install -y --no-install-recommends git-lfs && \
    git lfs install && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy repository files
COPY . .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE $PORT

CMD ["uvicorn", "backend.app:app", "--host", "0.0.0.0", "--port", "${PORT:-8000}"]
