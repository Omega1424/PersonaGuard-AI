from app.models.schemas import ChatMessage, MessageRole
from app.config import settings
from typing import List, Dict, Any, Optional
import time
import json
import ast
import logging
import re
from gradio_client import Client
from abc import ABC, abstractmethod

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BaseModelService(ABC):
    """Base class for all persona model services."""

    def __init__(self):
        self.client = None
        self.model_loaded = False

    @abstractmethod
    def _load_model(self):
        """Initialize the model client. Must be implemented by subclasses."""
        pass

    @abstractmethod
    def get_persona_name(self) -> str:
        """Return the persona name. Must be implemented by subclasses."""
        pass

    def _generate_with_model(self, message: str, conversation_history: List[ChatMessage] = None) -> Dict[str, str]:
        """Generate response using the HuggingFace inference client."""
        if not self.model_loaded or self.client is None:
            raise ValueError("Model client not loaded")

        try:
            start_time = time.perf_counter()

            result = self.client.predict(
                message,
                api_name="/inference"
            )

            end_time = time.perf_counter()
            elapsed = end_time - start_time
            logger.info(f"Inference time: {elapsed:.3f} seconds")

            parsed_data = {}

            try:
                parsed_data = json.loads(result)
            except json.JSONDecodeError:
                try:
                    parsed_data = ast.literal_eval(result)
                except (ValueError, SyntaxError):
                    logger.warning("Could not parse model output as JSON/Dict. Using raw string.")
                    parsed_data = {"response": result, "safety": "Unknown"}

            final_response = {
                'response': str(parsed_data.get('response', '')).strip(),
                'safety': str(parsed_data.get('safety', 'Unknown')).strip()
            }

            return final_response
        except Exception as e:
            error_msg = str(e)

            # Check for GPU quota error
            if "GPU quota" in error_msg or "exceeded your GPU quota" in error_msg:
                logger.warning(f"GPU quota exceeded: {error_msg}")
                # Extract wait time if available
                wait_time_match = re.search(r'Try again in ([\d:]+)', error_msg)
                wait_time = wait_time_match.group(1) if wait_time_match else "a few minutes"

                return {
                    'response': f"I'm currently experiencing high demand and the GPU quota has been temporarily exceeded. Please try again in {wait_time}. If this persists, your HuggingFace Space may need configuration adjustments.",
                    'safety': 'System'
                }

            # Check for other API/connection errors
            elif "API" in error_msg or "connection" in error_msg.lower() or "timeout" in error_msg.lower():
                logger.error(f"API/Connection error: {error_msg}")
                return {
                    'response': "Sorry, I'm having trouble connecting to the model service. Please try again in a moment.",
                    'safety': 'System'
                }

            # Other unexpected errors
            logger.error(f"Error generating response: {error_msg}")
            raise

    def generate_response(self, message: str, conversation_history: List[ChatMessage] = None) -> Dict[str, str]:
        """Generate a response with safety information."""
        if conversation_history is None:
            conversation_history = []

        if self.model_loaded:
            try:
                return self._generate_with_model(message, conversation_history)
            except Exception as e:
                logger.error(f"Model generation failed: {str(e)}")
                raise ValueError(f"Failed to generate response: {str(e)}")
        else:
            raise ValueError("Model client not loaded - cannot generate response")

    def get_model_status(self) -> Dict[str, Any]:
        """Get the current status of the model service."""
        return {
            "model_loaded": self.model_loaded,
            "persona": self.get_persona_name(),
        }

class SinglishModelService(BaseModelService):
    """
    Production-ready model service for Singlish chatbot.
    Uses Hugging Face inference API via gradio_client.
    """

    def __init__(self):
        super().__init__()
        self._load_model()

    def get_persona_name(self) -> str:
        return "Singlish"

    def _load_model(self):
        """Initialize the HuggingFace inference client for Singlish."""
        try:
            logger.info("Initializing Singlish HuggingFace inference client...")

            self.client = Client(
                "yuhueng/SinglishTest",
                token=settings.hf_token
            )

            self.model_loaded = True
            logger.info("Singlish HuggingFace inference client initialized successfully!")

        except Exception as e:
            logger.error(f"Failed to initialize Singlish HF client: {str(e)}")
            self.client = None
            self.model_loaded = False

    def get_model_status(self) -> Dict[str, Any]:
        """Get the current status of the model service."""
        base_status = super().get_model_status()
        return {
            **base_status,
            "inference_type": "HuggingFace API",
            "hf_space": "yuhueng/SinglishTest",
            "local_model": "No (remote inference)",
            "adapters_loaded": bool(settings.adapter_repo_name),
            "adapter_repo": settings.adapter_repo_name or "Not applicable for API inference"
        }


class XMMModelService(BaseModelService):
    """
    Model service for XMM persona chatbot.
    Uses placeholder HuggingFace endpoint (to be replaced).
    """

    def __init__(self):
        super().__init__()
        self._load_model()

    def get_persona_name(self) -> str:
        return "XMM"

    def _load_model(self):
        """Initialize the HuggingFace inference client for XMM."""
        try:
            logger.info("Initializing XMM HuggingFace inference client...")

            self.client = Client(
                "yuhueng/xmm-persona", 
                token=settings.hf_token
            )

            self.model_loaded = True
            logger.info("XMM HuggingFace inference client initialized successfully!")

        except Exception as e:
            logger.warning(f"XMM model not available (placeholder): {str(e)}")
            # For now, allow it to fail gracefully with a placeholder response
            self.client = None
            self.model_loaded = False

    def generate_response(self, message: str, conversation_history: List[ChatMessage] = None) -> Dict[str, str]:
        """Generate XMM persona response."""
        if not self.model_loaded:
            # Placeholder response when model is not loaded
            return {
                'response': f"XMM here! (Placeholder response) You said: {message}",
                'safety': "Safe"
            }
        return super().generate_response(message, conversation_history)

    def get_model_status(self) -> Dict[str, Any]:
        """Get the current status of the XMM model service."""
        base_status = super().get_model_status()
        return {
            **base_status,
            "inference_type": "HuggingFace API (Placeholder)",
            "hf_space": "yuhueng/XMM-Placeholder",
            "local_model": "No (remote inference)",
            "status": "placeholder - needs actual model endpoint"
        }


class AhBengModelService(BaseModelService):
    """
    Model service for Ah Beng persona chatbot.
    Uses placeholder HuggingFace endpoint (to be replaced).
    """

    def __init__(self):
        super().__init__()
        self._load_model()

    def get_persona_name(self) -> str:
        return "Ah Beng"

    def _load_model(self):
        """Initialize the HuggingFace inference client for Ah Beng."""
        try:
            logger.info("Initializing Ah Beng HuggingFace inference client...")

            self.client = Client(
                "yuhueng/ahbeng-persona",
                token=settings.hf_token
            )

            self.model_loaded = True
            logger.info("Ah Beng HuggingFace inference client initialized successfully!")

        except Exception as e:
            logger.warning(f"Ah Beng model not available (placeholder): {str(e)}")
            # For now, allow it to fail gracefully with a placeholder response
            self.client = None
            self.model_loaded = False

    def generate_response(self, message: str, conversation_history: List[ChatMessage] = None) -> Dict[str, str]:
        """Generate Ah Beng persona response."""
        if not self.model_loaded:
            # Placeholder response when model is not loaded
            return {
                'response': f"Wah bro! (Placeholder response) You said: {message}",
                'safety': "Safe"
            }
        return super().generate_response(message, conversation_history)

    def get_model_status(self) -> Dict[str, Any]:
        """Get the current status of the Ah Beng model service."""
        base_status = super().get_model_status()
        return {
            **base_status,
            "inference_type": "HuggingFace API (Placeholder)",
            "hf_space": "yuhueng/AhBeng-Placeholder",
            "local_model": "No (remote inference)",
            "status": "placeholder - needs actual model endpoint"
        }


class NSFModelService(BaseModelService):
    """
    Model service for NSF (National Serviceman) persona chatbot.
    Uses HuggingFace endpoint.
    """

    def __init__(self):
        super().__init__()
        self._load_model()

    def get_persona_name(self) -> str:
        return "NSF"

    def _load_model(self):
        """Initialize the HuggingFace inference client for NSF."""
        try:
            logger.info("Initializing NSF HuggingFace inference client...")

            self.client = Client(
                "yuhueng/nsf-persona",
                token=settings.hf_token
            )

            self.model_loaded = True
            logger.info("NSF HuggingFace inference client initialized successfully!")

        except Exception as e:
            logger.warning(f"NSF model not available: {str(e)}")
            # For now, allow it to fail gracefully with a placeholder response
            self.client = None
            self.model_loaded = False

    def generate_response(self, message: str, conversation_history: List[ChatMessage] = None) -> Dict[str, str]:
        """Generate NSF persona response."""
        if not self.model_loaded:
            # Placeholder response when model is not loaded
            return {
                'response': f"Eh bro, ORD loh! (Placeholder response) You said: {message}",
                'safety': "Safe"
            }
        return super().generate_response(message, conversation_history)

    def get_model_status(self) -> Dict[str, Any]:
        """Get the current status of the NSF model service."""
        base_status = super().get_model_status()
        return {
            **base_status,
            "inference_type": "HuggingFace API",
            "hf_space": "yuhueng/nsf-persona",
            "local_model": "No (remote inference)",
            "status": "active"
        }


# Singleton instances for each persona
singlish_service = SinglishModelService()
xmm_service = XMMModelService()
ahbeng_service = AhBengModelService()
nsf_service = NSFModelService()

# Keep backward compatibility
model_service = singlish_service