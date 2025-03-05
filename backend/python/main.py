import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import uvicorn

# Load environment variables from .env file
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Grok Chatbot API",
    description="A simple chatbot backend using Grok API and FastAPI",
    version="1.0.0"
)

# Get xAI API key from environment variables
XAI_API_KEY = os.getenv("XAI_API_KEY")

# Initialize the OpenAI client for xAI API
client = OpenAI(
    api_key=XAI_API_KEY,
    base_url="https://api.x.ai/v1",
)

# Define request model
class ChatRequest(BaseModel):
    message: str

# Define response model
class ChatResponse(BaseModel):
    reply: str

@app.get("/")
async def root():
    return {"message": "Welcome to the Grok Chatbot API"}

@app.post("/chat", response_model=ChatResponse)
async def chat_with_grok(request: ChatRequest):
    """
    Endpoint to send a message to the Grok chatbot and get a response.
    """
    try:
        # Make a request to the xAI Grok API based on the curl example
        completion = client.chat.completions.create(
            model="grok-2-latest",  # Updated to match the curl example
            messages=[
                {"role": "system", "content": "You are Grok, a helpful AI assistant created by xAI."},
                {"role": "user", "content": request.message},
            ],
            stream=False,  # Match the curl example
            temperature=0,  # Match the curl example
        )
        
        # Extract the response
        reply = completion.choices[0].message.content
        
        return ChatResponse(reply=reply)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error communicating with Grok API: {str(e)}")

# Run the FastAPI app
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)