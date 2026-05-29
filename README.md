<div align="center">
  
  # 🚀 TaskPilot - Adishila Core

  <p align="center">
    <strong>An advanced, AI-powered mission catalogue and execution brief generator built with a premium Neon Liquid Glass aesthetic.</strong>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
    <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
    <img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white" />
  </p>

</div>

---

## 🌟 Overview

**TaskPilot** is a sophisticated full-stack application designed to streamline project management and internal task distribution. Powered by **Google's Gemini 1.5 Pro AI**, it analyzes complex business operations and generates personalized, actionable execution briefs on the fly. 

The user interface features a custom **Neon Liquid Glass & Claymorphism** design system—blending deep dark modes, heavy backdrop blurs, and intense orange glowing accents to create a premium, futuristic experience.

---

## ✨ Core Features

*   🤖 **AI-Powered Briefs:** Generates comprehensive, step-by-step execution briefs using FastAPI and the Gemini API.
*   🎯 **Smart Recommendations:** Ranks and suggests optimal tasks based on user profiles and past interaction history.
*   🎨 **Neon Liquid Glass UI:** A fully custom Tailwind CSS design system featuring extreme backdrop blurs, frosted glass panels, and glowing neon accents.
*   💬 **Interactive Chatbot Orb:** A floating plasma CPU widget that opens a fully integrated AI assistant.
*   🛡️ **Robust Error Handling:** React Error Boundaries ensure the app stays alive even if an AI generation goes off the rails.
*   📊 **Real-Time Tracking:** Custom action tracking hooks log user interactions for future AI personalization.

---

## 🛠️ Tech Stack

### Frontend 💻
*   **React 18** (Vite build system)
*   **Tailwind CSS v3** (Custom extensive configuration)
*   **Lucide Icons / Material Symbols** for visual flair
*   **React Markdown** for beautiful AI brief rendering

### Backend ⚙️
*   **FastAPI** (High-performance Python framework)
*   **Google Gemini SDK** (Advanced LLM processing)
*   **Uvicorn** (ASGI server)
*   **Python 3.12+**

---

## 🚀 Getting Started

Follow these steps to get your local development environment up and running.

### 1. Clone the Repository
```bash
git clone https://github.com/akulattre-31/taskpilot.git
cd taskpilot
```

### 2. Backend Setup
Navigate to the backend directory and set up your Python environment:
```bash
cd backend
python -m venv venv

# Activate the virtual environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Environment Variables:**
Create a `.env` file in the `backend` folder and add your Gemini API key:
```env
GEMINI_API_KEY=your_api_key_here
```

**Run the Backend Server:**
```bash
python -m uvicorn app.main:app --reload --port 8000
```
*The API will be available at `http://localhost:8000`*

### 3. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and start Vite:
```bash
cd frontend

# Install Node dependencies
npm install

# Start the dev server
npm run dev
```
*The UI will be available at `http://localhost:5173`*

---

## 🎨 Design System

TaskPilot completely completely revamps standard components by using a tailored CSS ecosystem:
- **`liquid-glass`**: Extreme 30px blurs paired with deep dark backgrounds and semi-transparent borders.
- **`shadow-clay` & `shadow-clay-glow`**: Intense inset and outset glowing drop shadows mimicking 3D claymorphic UI trends.
- **Sora & Inter Typography**: Highly legible, modern fonts emphasizing data and task hierarchy.

---

## 🔒 Security & Privacy
This repository intentionally ignores all `.env` files, `.db` files, and local caches to ensure no API keys or private operator profiles are ever exposed to version control.

---

<div align="center">
  <i>Initiate your operations. Welcome to the Business Lab.</i> ⚡
</div>
