import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

print("Gemini Key Loaded:", settings.GEMINI_API_KEY is not None)

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup event
    logger.info("Starting up Zerops Copilot AI...")
    yield
    # Shutdown event
    logger.info("Shutting down Zerops Copilot AI...")

app = FastAPI(
    title="Zerops Copilot AI",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
from app.api import analysis
app.include_router(analysis.router, tags=["analysis"])

@app.get("/")
async def root():
    return {
        "service": "Zerops Copilot AI",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "UP",
        "service": "zerops-copilot-ai"
    }
