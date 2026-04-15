from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import chat
from app.routers import session as session_router
from app.config import settings
from app import db

app = FastAPI(
    title=settings.api_title,
    description="PersonaGuard AI — scam simulation and detection API",
    version=settings.api_version,
    debug=settings.debug,
)

# Initialise SQLite on startup
db.init_db()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(chat.router, prefix="/api", tags=["chat"])
app.include_router(session_router.router, prefix="/api", tags=["session"])


@app.get("/")
async def root():
    return {
        "message": settings.api_title,
        "version": settings.api_version,
        "docs": "/docs",
        "health": "/api/health",
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.host, port=settings.port)
