# Maternova Healthcare Platform

A digital healthcare platform connecting **ASHA workers**, **pregnant women**, **elderly citizens**, and **infant families** to essential health services across rural India. Powered by a React frontend and a RAG-based AI assistant backed by FastAPI and Google Gemini.

---

## ✨ Features

- 🏥 Role-based login for ASHA Workers, Pregnant Women, Elderly, and Infant Families
- 🚨 Emergency alert system with real-time Supabase sync
- 💉 Vaccination and Treatment record tracking
- 🍽️ Meal and Nutrition management
- 💰 Government funding scheme tracker
- 🤖 **Maternova AI Assistant** — RAG-powered chatbot with context from the official Maternova website
- 🌐 Multilingual support (12 Indian languages)
- 🪟 Premium glassmorphism UI with animated gradient backgrounds

---

## 🗂️ Project Structure

```
maternova/
├── src/                  # React frontend (Vite + TypeScript)
│   ├── components/       # UI components including AiAssistant
│   ├── hooks/            # Custom Supabase data hooks
│   ├── context/          # App and Language contexts
│   └── lib/              # Utilities (error-utils, etc.)
├── main.py               # FastAPI AI backend (RAG + Gemini)
├── ingest.py             # Script to build the Maternova vector DB
├── requirements.txt      # Python backend dependencies
├── .env.example          # Environment variable template
└── supabase/             # DB schema and migrations
```

---

## 🚀 Getting Started

### 1. Clone the repository

```sh
git clone <YOUR_GIT_URL>
cd maternova
```

### 2. Set up environment variables

```sh
cp .env.example .env
# Fill in your API keys in .env
```

### 3. Install frontend dependencies & run

```sh
npm install
npm run dev
```

### 4. Install Python backend dependencies & run

```sh
pip install -r requirements.txt

# First time only: build the AI knowledge base
python ingest.py

# Start the AI backend
python main.py
```

> The frontend runs on `http://localhost:8080` and the AI backend on `http://localhost:8000`.

---

## 🏗️ Production Deployment

### Frontend (e.g. Vercel / Netlify)
1. Set all `VITE_*` environment variables in your hosting platform.
2. Set `VITE_API_URL` to your deployed backend URL (e.g. `https://api.maternova.com`).
3. Run `npm run build` — deploy the `dist/` folder.

### Backend (e.g. Railway / Render / VPS)
1. Set `GOOGLE_API_KEY` and `ALLOWED_ORIGINS` as environment variables on the server.
2. Upload `main.py`, `requirements.txt`, and the pre-built `maternova_db/` vector database.
3. Start with: `uvicorn main:app --host 0.0.0.0 --port 8000`

---

## 🛡️ Security Notes

- `.env` is **gitignored** — never commit it.
- `maternova_db/` is **gitignored** — re-generate on the server by running `python ingest.py`.
- CORS is restricted to specific origins defined in `ALLOWED_ORIGINS`.
- The AI backend validates all incoming requests and never exposes raw API keys.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| Backend | FastAPI, Uvicorn, Python 3.11+ |
| AI / RAG | LangChain, Google Gemini, ChromaDB |
| Database | Supabase (PostgreSQL + Realtime) |
| Styling | Glassmorphism, Animated Gradients, Radix UI |
