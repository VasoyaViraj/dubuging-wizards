# FILE: SECURITY/ai_router.py
import numpy as np
import json
import os
from sklearn.metrics.pairwise import cosine_similarity

# Try importing AI libraries. If missing, we warn but don't crash.
try:
    from sentence_transformers import SentenceTransformer
    AI_AVAILABLE = True
except ImportError:
    print("⚠️ WARNING: sentence-transformers not installed. AI Router will be dumb.")
    AI_AVAILABLE = False

class IntelligentRouter:
    def __init__(self):
        self.model = None
        if AI_AVAILABLE:
            print("🧠 Loading AI Router Model... (This happens once)")
            # Using a smaller model for speed
            self.model = SentenceTransformer('all-MiniLM-L6-v2')

        # --- 1. Load Knowledge Base ---
        # We try to load from 'ai_config.json', but if missing, use this FALLBACK dictionary.
        self.services = self.load_services_config()
        
        # --- 2. Pre-compute Embeddings ---
        self.service_embeddings = {}
        if self.model:
            print("⚙️  Vectorizing Service Definitions...")
            for service, keywords in self.services.items():
                # We encode the keywords list directly to create semantic vectors
                self.service_embeddings[service] = self.model.encode(keywords)

    def load_services_config(self):
        """Loads keywords from JSON or returns default if file missing."""
        config_path = os.path.join(os.path.dirname(__file__), 'ai_config.json')
        
        if os.path.exists(config_path):
            try:
                with open(config_path, 'r') as f:
                    return json.load(f)
            except Exception as e:
                print(f"⚠️ Error reading ai_config.json: {e}")
        
        print("ℹ️  Using internal fallback keywords for Router.")
        # FALLBACK DICTIONARY (Safety Net)
        return {
             "agriculture": [
                "crop failure drought soil health farming low yield",
                "stagnant water in irrigation canals causing mosquito breeding and malaria",
                "pesticide runoff contaminating drinking water sources",
                "burning crop stubble causing air pollution and breathing issues"
            ],
            "urban": [
                "traffic congestion road blockage transport infrastructure",
                "heavy traffic jams blocking ambulance and emergency vehicle access to hospitals",
                "open drainage and sewage overflow causing dengue and typhoid outbreaks",
                "garbage dumps attracting pests and spreading infection",
                "industrial smog causing asthma and lung diseases"
            ],
            "health": [
                "hospital admission emergency ward doctor nurse",
                "outbreak of infectious disease virus bacteria",
                "shortage of medicines and vaccines patient care",
                "cardiac arrest respiratory failure trauma accident"
            ]
        }

    def route_query(self, query_text):
        """
        Input: "Traffic is stuck and ambulance cannot move"
        Output: List of services [Urban, Health] with confidence scores.
        """
        if not self.model:
            return [{"target_service": "error", "confidence": "0%", "reason": "AI Model missing"}]

        # 1. Vectorize the user's query
        query_vec = self.model.encode([query_text])
        results = []
        
        # 2. Compare against all departments
        for service, vectors in self.service_embeddings.items():
            # Calculate similarity (0 to 1)
            scores = cosine_similarity(query_vec, vectors)
            max_score = float(np.max(scores))
            
            # Threshold: Only return if > 25% match confidence
            if max_score > 0.25:  
                results.append({
                    "target_service": service,
                    "confidence": f"{int(max_score * 100)}%", 
                    "reason": f"Semantic match ({int(max_score*100)}%) with {service} domain."
                })
        
        # Sort by confidence (Highest first)
        return sorted(results, key=lambda x: int(x['confidence'].strip('%')), reverse=True)

# --- SINGLETON INSTANCE ---
# This executes immediately when you import this file.
router_instance = IntelligentRouter()