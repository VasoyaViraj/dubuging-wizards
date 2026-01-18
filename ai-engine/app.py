from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import time

# --- 1. CORRECT IMPORTS (For your flat folder structure) ---
# Since sentinel.py is right next to app.py, we just import it directly
from sentinel import sentinel

# NOTE: If you haven't created 'ai_router.py' in this folder yet, 
# comment out the next line until you create it.
try:
    from ai_router import router_instance
except ImportError:
    print("⚠️ Warning: ai_router.py not found. AI Routing will be disabled.")
    router_instance = None

app = FastAPI(title="NEXUS | AI Microservice")

# --- 2. The Middleware (Protects this Python API) ---
@app.middleware("http")
async def sentinel_middleware(request: Request, call_next):
    start_time = time.time()
    client_ip = request.client.host
    
    try:
        response = await call_next(request)
        process_time = (time.time() - start_time) * 1000 # in ms
        is_error = response.status_code >= 400
        
        # Analyze request internally
        is_blocked, conf, reason = sentinel.analyze_request(client_ip, process_time, is_error)
        
        # If confidence is high (> 0.8), we block it.
        # In your screenshot, it blocked with 0.19 confidence because 
        # the model might be sensitive or trained on different data. 
        # You can adjust this threshold (e.g. > 0.5) if it's too aggressive.
        if is_blocked and conf > 0.5: 
            print(f"🚫 BLOCKED {client_ip} | Reason: {reason} | Conf: {conf:.2f}")
            return JSONResponse(status_code=403, content={"error": "Blocked by AI", "reason": reason})

        return response
    except Exception as e:
        return await call_next(request)

# --- 3. The Endpoints (The API) ---

# A. Security Endpoint (CALLED BY NODE.JS)
class SecurityCheck(BaseModel):
    ip: str
    latency: float = 0.0
    is_error: bool = False

@app.post("/api/security/validate")
async def check_security(data: SecurityCheck):
    is_blocked, conf, reason = sentinel.analyze_request(data.ip, data.latency, data.is_error)
    return {
        "blocked": is_blocked,
        "confidence": conf,
        "reason": reason
    }

# B. AI Routing Endpoint (CALLED BY NODE.JS)
class QueryRequest(BaseModel):
    description: str
    source: str = "Web"

@app.post("/api/route-query")
async def route_query(query: QueryRequest):
    if router_instance:
        analysis = router_instance.route_query(query.description)
        return {"analysis": analysis}
    else:
        return {"error": "AI Router not loaded (ai_router.py missing)"}

# C. Health Check
@app.get("/api/health")
async def health_check():
    return {"status": "AI System Online", "sentinel": "Active"}