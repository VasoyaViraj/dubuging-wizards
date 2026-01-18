from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import time
import uvicorn

# --- 1. IMPORTS (Unified) ---
from sentinel import sentinel  # Your Security Logic
try:
    from ai_router import router_instance # Your Navigation Logic
except ImportError:
    print("⚠️ Warning: ai_router.py not found. AI Routing will be disabled.")
    router_instance = None

app = FastAPI(title="NEXUS | Unified AI Microservice")

# --- 2. SECURITY MIDDLEWARE ---
# This protects the AI server itself from attacks
@app.middleware("http")
async def sentinel_middleware(request: Request, call_next):
    start_time = time.time()
    client_ip = request.client.host
    
    try:
        response = await call_next(request)
        process_time = (time.time() - start_time) * 1000 # in ms
        is_error = response.status_code >= 400
        
        # Analyze request internally using Sentinel
        is_blocked, conf, reason = sentinel.analyze_request(client_ip, process_time, is_error)
        
        # If Sentinel is very sure (> 50%) it's an attack, block it.
        if is_blocked and conf > 0.5: 
            print(f"🚫 BLOCKED {client_ip} | Reason: {reason}")
            return JSONResponse(status_code=403, content={"error": "Blocked by AI Sentinel", "reason": reason})

        return response
    except Exception as e:
        # Fail safe: If checking fails, let the request through
        return await call_next(request)

# --- 3. DATA MODELS ---
class SecurityCheck(BaseModel):
    ip: str
    latency: float = 0.0
    is_error: bool = False

class QueryRequest(BaseModel):
    description: str
    source: str = "Web"

# --- 4. ENDPOINTS ---

# Endpoint A: Security (Called by Node.js middleware)
@app.post("/api/security/validate")
async def check_security(data: SecurityCheck):
    is_blocked, conf, reason = sentinel.analyze_request(data.ip, data.latency, data.is_error)
    return {
        "blocked": is_blocked,
        "confidence": conf,
        "reason": reason
    }

# Endpoint B: Navigation (Called by Node.js Service Controller)
@app.post("/api/route-query")
async def route_query(query: QueryRequest):
    if not router_instance:
        return {"analysis": "general", "error": "Router not loaded"}

    # Ask the Brain
    matches = router_instance.route_query(query.description)

    # If no matches, default to General
    if not matches:
        return {
            "analysis": "general",
            "confidence": "0%",
            "reason": "No clear match found"
        }
    
    # Return the best match so Node.js can read it easily
    top_match = matches[0]
    return {
        "analysis": top_match["target_service"],
        "confidence": top_match["confidence"],
        "reason": top_match["reason"]
    }

# Endpoint C: Health Check
@app.get("/api/health")
async def health_check():
    return {"status": "AI System Online", "sentinel": "Active", "router": "Active"}

# Run with: uvicorn app:app --port 8000
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)