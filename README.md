# Developing a Culturally Grounded Singlish-Adapted Conversational Simulator for Persona-Driven Interactions in Singapore

A minimalist chat interface for a fine-tuned Singlish conversational AI. This system is built with a React (Vite) frontend and a FastAPI backend serving a trained model with LoRA adapters. [Demo](https://yh-singlish-chatbot.vercel.app/)

## Authors

**Ng Yu Hueng, Austin Isaac, Jithin Bathula, Tang Zhi-Ju Edward, Siew Rui Ze Zayne**

## Architecture
<img width="1793" height="918" alt="Paktor-Anot pptx" src="https://github.com/user-attachments/assets/b89b79ac-ade5-4cfa-aedb-fa767ca106c3" />

## Tech Stack

- **Frontend:** React 18+, Vite, Tailwind CSS, Axios
- **Backend:** FastAPI, Uvicorn, Transformers, PEFT
- **Runtime:** Python 3.10+, Node 18+

## Features

- **Authentic Singlish Responses:** Generates natural local-style conversations based on fine-tuned models.
- **Minimalist Design:** Clean, focused chat interface.
- **Mobile-Responsive:** Fully functional across various device sizes.
- **Fast Performance:** Optimized for quick response times.
- **Easy Setup:** Streamlined development workflow.
- **Beautiful UI:** Custom color scheme and typography designed for readability.

## Training Resources & Data

The `Google Colab Files` directory contains the complete source code used to train and fine-tune our models. This includes:

- **Jupyter Notebooks:** Complete workflow for loading the base model, applying QLoRA adapters, and executing the training loop.
- **Data Processing:** Scripts used to clean, format, and tokenize the raw Singlish text data.
- **Datasets:** A compiled list of the specific datasets used to ground the model in the Singaporean context, including colloquialisms, code-switching examples, and local context pairs.

## Model Ecosystem

Our project utilizes a "Mixture of Personas" approach. Below are the links to the specific Hugging Face repositories and interactive demos for each persona.

### Interactive Demos (Hugging Face Spaces)

Experience the fine-tuned personas directly through our hosted ZeroSpace environments:

- **Singlish Base Demo:** [SinglishTest Space](https://huggingface.co/spaces/yuhueng/SinglishTest)
- **NSF Persona Demo:** [NSF Persona Space](https://huggingface.co/spaces/yuhueng/nsf-persona/)
- **Ah Beng Persona Demo:** [Ah Beng Persona Space](https://huggingface.co/spaces/yuhueng/ahbeng-persona/)
- **XMM Persona Demo:** [XMM Persona Space](https://huggingface.co/spaces/yuhueng/xmm-persona)

### Trained Model Weights

The following LoRA adapters are hosted on Hugging Face:

**Singlish Base Model**
_The foundation model optimized for general Singlish conversation._

- [yuhueng/qwen3-4b-singlish-base-v3](https://huggingface.co/yuhueng/qwen3-4b-singlish-base-v3) (Latest)
- [yuhueng/qwen3-4b-singlish-base-v2](https://huggingface.co/yuhueng/qwen3-4b-singlish-base-v2)
- [yuhueng/qwen3-4b-singlish-base](https://huggingface.co/yuhueng/qwen3-4b-singlish-base)

**NSF Persona (National Service)**
_Optimized for military context and slang._

- [Birthright00/singlish_adapter_4B-NSF-on-Singlish_no_system_prompt](https://huggingface.co/Birthright00/singlish_adapter_4B-NSF-on-Singlish_no_system_prompt)

**Ah Beng Persona**
_Tailored for dialect-heavy, street-smart interactions._

- [JithinBathula/ah-beng-singlish-no-system-prompt](https://huggingface.co/JithinBathula/ah-beng-singlish-no-system-prompt)

**XMM Persona (Xiao Mei Mei)**
_Mimicking local youth subculture speech._

- [Birthright00/singlish_adapter_4B-XMM-on-Singlish_no_system_prompt](https://huggingface.co/Birthright00/singlish_adapter_4B-XMM-on-Singlish_no_system_prompt)

## Quick Start

### Prerequisites

- Python 3.11 or below (Due to specific dependency requirements)
- Node.js 18 or higher
- npm or yarn

### Setup

1.  **Clone the repository**

    ```bash
    git clone https://github.com/Omega1424/Paktor-Anot.git
    ```

2.  **Backend Setup**

    ```bash
    cd Backend

    # Create virtual environment
    python -m venv venv

    # Activate virtual environment
    # Windows:
    venv\Scripts\activate
    # macOS/Linux:
    source venv/bin/activate

    # Install dependencies
    pip install -r requirements.txt
    ```

3.  **Frontend Setup**

    ```bash
    cd Frontend

    # Install dependencies
    npm install
    ```

4.  **Run the Application**

    **Terminal 1 - Backend:**

    ```bash
    cd Backend
    # Make sure virtual environment is activated
    uvicorn app.main:app --reload --port 8000
    ```

    **Terminal 2 - Frontend:**

    ```bash
    cd Frontend
    npm run dev
    ```

5.  **Access the Application**

    - Frontend: `http://localhost:5173`
    - Backend API: `http://localhost:8000`
    - API Documentation: `http://localhost:8000/docs`

## API Endpoints

| Endpoint      | Method | Purpose                        |
| :------------ | :----- | :----------------------------- |
| `/api/chat`   | POST   | Send message, receive response |
| `/api/health` | GET    | Health check                   |

### POST `/api/chat`

**Request:**

```json
{
  "message": "Hello how are you?",
  "conversation_history": [
    { "role": "user", "content": "Previous message" },
    { "role": "assistant", "content": "Previous response" }
  ]
}
```

**Response:**

```json
{
  "response": "Wah hello bro! I'm doing great lah, you?",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Project Structure

```text
NLP Project Interface/
├── Backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application
│   │   ├── config.py            # Configuration settings
│   │   ├── models/
│   │   │   └── schemas.py       # Pydantic models
│   │   ├── routers/
│   │   │   └── chat.py          # API endpoints
│   │   └── services/
│   │       └── model.py         # Model service (placeholder)
│   ├── requirements.txt         # Python dependencies
│   └── .gitignore               # Python ignores
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── InputBar.jsx
│   │   │   └── TypingIndicator.jsx
│   │   ├── hooks/
│   │   │   └── useChat.js       # Chat state management
│   │   ├── services/
│   │   │   └── api.js           # Backend communication
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Global styles
│   ├── package.json             # Node.js dependencies
│   ├── vite.config.js           # Vite configuration
│   ├── tailwind.config.js       # Tailwind configuration
│   ├── postcss.config.js        # PostCSS configuration
│   └── index.html               # HTML template
├── Google Colab Files/          # Training source code and notebooks
├── README.md                    # This file
└── .gitignore                   # Project ignores
```

## Development

### Frontend Development

```bash
cd Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Development

```bash
cd Backend

# Run with auto-reload
uvicorn app.main:app --reload --port 8000

# Or run the Python file directly
python app/main.py
```

## UI Guidelines

- **Design Philosophy:** Minimalist, clean, ample whitespace.
- **Max Width:** 800px centered container.
- **Color Scheme:**
  - Background: `#FAFAFA`
  - User bubbles: `#3B82F6` (blue-500)
  - Bot bubbles: `#F3F4F6` (gray-100)
  - Text: `#111827` (gray-900)
- **Typography:** Sans-serif, 16px base.
- **Responsive:** Mobile-first with breakpoints at 640px, 768px, 1024px.

## Troubleshooting

### Common Issues

**Backend won't start:**

- Ensure Python 3.10+ is installed.
- Check if virtual environment is activated.
- Verify all requirements are installed.

**Frontend won't start:**

- Ensure Node.js 18+ is installed.
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`.
- Check if port 5173 is available.

**CORS errors:**

- Ensure backend is running on port 8000.
- Check CORS configuration in `Backend/app/main.py`.
- Verify Vite proxy configuration in `Frontend/vite.config.js`.

**API connection issues:**

- Check backend health: `http://localhost:8000/api/health`.
- Verify API endpoints in browser.
- Check browser console for network errors.

## License

This project is part of academic coursework and research purposes.
