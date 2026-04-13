from fastapi import APIRouter, HTTPException
from app.models.schemas import ChatRequest, ChatResponse, HealthCheck, ErrorResponse
from app.services.model import model_service, singlish_service, xmm_service, ahbeng_service, nsf_service
from datetime import datetime
import logging
import json


router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Default chat endpoint - uses Singlish persona for backward compatibility.
    """
    try:
        response_data = model_service.generate_response(
            message=request.message,
            conversation_history=request.conversation_history
        )

        logging.info(f"Generated response: {json.dumps(response_data)}")

        return ChatResponse(
            response=response_data["response"],
            safety=response_data["safety"],
            timestamp=datetime.now()
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.post("/chat/singlish", response_model=ChatResponse)
async def chat_singlish(request: ChatRequest):
    """
    Chat endpoint for Singlish persona.
    """
    try:
        response_data = singlish_service.generate_response(
            message=request.message,
            conversation_history=request.conversation_history
        )

        logging.info(f"[Singlish] Generated response: {json.dumps(response_data)}")

        return ChatResponse(
            response=response_data["response"],
            safety=response_data["safety"],
            timestamp=datetime.now()
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.post("/chat/xmm", response_model=ChatResponse)
async def chat_xmm(request: ChatRequest):
    """
    Chat endpoint for XMM persona.
    """
    try:
        response_data = xmm_service.generate_response(
            message=request.message,
            conversation_history=request.conversation_history
        )

        logging.info(f"[XMM] Generated response: {json.dumps(response_data)}")

        return ChatResponse(
            response=response_data["response"],
            safety=response_data["safety"],
            timestamp=datetime.now()
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.post("/chat/ahbeng", response_model=ChatResponse)
async def chat_ahbeng(request: ChatRequest):
    """
    Chat endpoint for Ah Beng persona.
    """
    try:
        response_data = ahbeng_service.generate_response(
            message=request.message,
            conversation_history=request.conversation_history
        )

        logging.info(f"[Ah Beng] Generated response: {json.dumps(response_data)}")

        return ChatResponse(
            response=response_data["response"],
            safety=response_data["safety"],
            timestamp=datetime.now()
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.post("/chat/nsf", response_model=ChatResponse)
async def chat_nsf(request: ChatRequest):
    """
    Chat endpoint for NSF persona.
    """
    try:
        response_data = nsf_service.generate_response(
            message=request.message,
            conversation_history=request.conversation_history
        )

        logging.info(f"[NSF] Generated response: {json.dumps(response_data)}")

        return ChatResponse(
            response=response_data["response"],
            safety=response_data["safety"],
            timestamp=datetime.now()
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.get("/health", response_model=HealthCheck)
async def health_check():
    """
    Health check endpoint to verify API is working.
    """
    return HealthCheck(
        status="healthy",
        timestamp=datetime.now()
    )

@router.get("/model-status")
async def model_status():
    """
    Get the current status of the loaded model.
    """
    return {
        "status": "ok",
        "model": model_service.get_model_status()
    }

@router.get("/")
async def chat_info():
    """
    Information about the chat API.
    """
    return {
        "message": "Multi-Persona Chatbot API",
        "version": "2.0.0",
        "endpoints": {
            "chat_default": "/api/chat",
            "chat_singlish": "/api/chat/singlish",
            "chat_xmm": "/api/chat/xmm",
            "chat_ahbeng": "/api/chat/ahbeng",
            "chat_nsf": "/api/chat/nsf",
            "health": "/api/health",
            "model_status": "/api/model-status"
        },
        "personas": {
            "singlish": {
                "endpoint": "/api/chat/singlish",
                "status": singlish_service.get_model_status()
            },
            "xmm": {
                "endpoint": "/api/chat/xmm",
                "status": xmm_service.get_model_status()
            },
            "ahbeng": {
                "endpoint": "/api/chat/ahbeng",
                "status": ahbeng_service.get_model_status()
            },
            "nsf": {
                "endpoint": "/api/chat/nsf",
                "status": nsf_service.get_model_status()
            }
        },
        "status": "operational"
    }