# ZeroSpace Models Directory

This directory is a placeholder for storing ZeroSpace model configurations and weights.

## Structure

This directory will contain:
- Model configuration files
- Tokenizer configurations
- Model weights (if storing locally)
- Adapter configurations

## Personas

### Singlish Persona
- **Endpoint**: `/api/chat/singlish`
- **Model**: `yuhueng/SinglishTest` (HuggingFace Space)
- **Description**: Friendly Singaporean AI assistant that speaks Singlish naturally

### XMM Persona
- **Endpoint**: `/api/chat/xmm`
- **Model**: `yuhueng/XMM-Placeholder` (Placeholder - needs actual endpoint)
- **Description**: XMM personality chatbot

## Usage

Models are currently accessed via HuggingFace API using the `gradio_client` library.
To use local models instead, update the model service implementations in `app/services/model.py`.

## Adding New Personas

1. Create a new service class extending `BaseModelService` in `app/services/model.py`
2. Implement the `_load_model()` and `get_persona_name()` methods
3. Add a new route in `app/routers/chat.py`
4. Update the frontend to include the new persona option
