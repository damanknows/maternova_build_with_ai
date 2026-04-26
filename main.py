import os
from dotenv import load_dotenv
import uvicorn
import re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma

# 1. Setup API Key
load_dotenv()
if not os.environ.get("GOOGLE_API_KEY"):
    raise RuntimeError("GOOGLE_API_KEY is not set. Please add it to your environment variables.")

app = FastAPI(
    title="Maternova AI Backend",
    description="RAG-powered AI assistant for the Maternova Healthcare Platform",
    version="1.0.0",
    docs_url=None,   # Disable Swagger UI in production
    redoc_url=None,  # Disable ReDoc in production
)

# 2. CORS Setup - Allows your frontend to talk to this backend
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "http://localhost:8080,http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type"],
)

# 3. Load Brain & LLM
# Using gemini-2.5-flash for higher daily quota (avoids 429 errors)
embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-2") 
db = Chroma(persist_directory="./maternova_db", embedding_function=embeddings)
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash")

class Query(BaseModel):
    question: str

@app.get("/health")
async def health_check():
    """Health check endpoint for uptime monitoring (Railway, Render, UptimeRobot)."""
    return {"status": "ok", "service": "Maternova AI Backend", "version": "1.0.0"}

@app.post("/ask")
async def ask_bot(item: Query):
    try:
        # Search the knowledge base for website-specific context
        docs = db.similarity_search(item.question, k=3)
        context = "\n".join([d.page_content for d in docs])
        
        # --- INTEGRATED OFFICIAL INSTRUCTIONS ---
        # This combines your persona requirements with the RAG context
        full_prompt = f"""
        You are the official virtual assistant for Maternova Healthcare.

        GOAL:
        Help users with information about services, appointments, and general healthcare guidance in a polite, clear, and professional way.

        TONE:
        - Friendly, calm, and respectful.
        - Simple language (avoid complex medical terms).
        - Short and helpful answers (Keep answers under 4-5 lines).

        STRICT MEDICAL SAFETY RULES:
        - Do NOT provide medical diagnosis or suggest medicines/treatments.
        - Do NOT act like a doctor.
        - ALWAYS recommend consulting a qualified doctor for medical concerns.
        - If symptoms are described: Respond with empathy and ALWAYS say: "It’s best to consult a qualified doctor for proper diagnosis and treatment."

        BOOKING SUPPORT:
        - If the user wants an appointment: Ask for their Name, Phone number, and Preferred date. Then guide them to contact the clinic.

        BEHAVIOR RULES:
        - If you don't know something: Say "I’m not fully sure about that. Please contact our clinic directly for accurate information."
        - Never generate fake information or guess details not in the context.
        - ALWAYS reply in English. Do not use Hinglish or any other language unless explicitly requested.
        
        CONTEXT FROM WEBSITE:
        {context}

        USER QUESTION:
        {item.question}
        """
        
        # 4. Get response from Gemini
        response = llm.invoke(full_prompt)
        
        # 5. Extract Text (Ensures clean string output for React)
        if hasattr(response, 'content'):
            final_answer = str(response.content)
        else:
            final_answer = str(response)

        # Handle edge cases where metadata might still leak into the string
        if "text': '" in final_answer:
            match = re.search(r"text': '(.*?)'", final_answer)
            if match:
                final_answer = match.group(1)

        print(f"Assistant Response: {final_answer}")
        return {"answer": final_answer}

    except Exception as e:
        print(f"Error Logged: {str(e)}")
        # User-friendly error message
        return {"answer": "I’m not fully sure about that. Please contact our clinic directly for accurate information."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)