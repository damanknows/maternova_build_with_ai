import os
from dotenv import load_dotenv
from langchain_community.document_loaders import WebBaseLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma

# 1. Load API Key
load_dotenv()
if not os.environ.get("GOOGLE_API_KEY"):
    print("Warning: GOOGLE_API_KEY not found in environment. Please add it to your .env file.")

def build_brain():
    print("🚀 Connecting to maternovahealthcare.vercel.app...")
    
    # Load the website data
    loader = WebBaseLoader("https://maternovahealthcare.vercel.app/")
    data = loader.load()

    # Split the long text into small pieces
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    chunks = text_splitter.split_documents(data)

    # Convert text to vector math (Embeddings)
    print("🧠 Creating the knowledge base (this might take a minute)...")
    embeddings =GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-2")
    
    # Save it to a folder called 'maternova_db'
    vector_db = Chroma.from_documents(
        documents=chunks, 
        embedding=embeddings, 
        persist_directory="./maternova_db"
    )
    print("✅ Done! Your 'maternova_db' folder is ready.")

if __name__ == "__main__":
    build_brain()