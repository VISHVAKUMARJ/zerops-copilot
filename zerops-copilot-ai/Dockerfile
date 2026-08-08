# Use the official Python 3.12 slim image for a smaller footprint
FROM python:3.12-slim

# Set environment variables for production optimization
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_DEFAULT_TIMEOUT=100

# Set the working directory
WORKDIR /app

# Create a non-root user for security
RUN adduser --disabled-password --gecos "" appuser

# Copy requirements file first to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY app/ ./app/

# Change ownership of the /app directory to the non-root user
RUN chown -R appuser:appuser /app

# Switch to the non-root user
USER appuser

# Expose the application port
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
