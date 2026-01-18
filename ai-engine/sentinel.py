# backend/app/services/sentinel.py
import joblib
import numpy as np
import os
import time

class SentinelGuard:
    def __init__(self):
        self.model_path = os.path.join(os.path.dirname(__file__), 'sentinel_model.pkl')
        self.model = None
        self.request_buffer = {} # Simple in-memory storage for demo: {ip: [timestamp, ...]}
        self.load_brain()

    def load_brain(self):
        if os.path.exists(self.model_path):
            self.model = joblib.load(self.model_path)
            print("🛡️ Sentinel Active: AI Brain Loaded.")
        else:
            print("⚠️ Sentinel Warning: Brain not found. Run train_sentinel.py!")

    def analyze_request(self, ip_address: str, latency_ms: float, error_status: bool):
        """
        Returns: (is_blocked: bool, confidence: float, reason: str)
        """
        if not self.model:
            return False, 0.0, "Model Offline"

        # 1. Update In-Memory Stats for this IP
        current_time = time.time()
        if ip_address not in self.request_buffer:
            self.request_buffer[ip_address] = []
        
        # Add current request (keep last 60 seconds of history)
        self.request_buffer[ip_address].append(current_time)
        self.request_buffer[ip_address] = [t for t in self.request_buffer[ip_address] if current_time - t < 60]
        
        # 2. Extract Features (Real-Time)
        rpm = len(self.request_buffer[ip_address]) # Requests per minute
        error_rate = 1.0 if error_status else 0.0 # Simplified for demo
        payload_size = 500 # Mock average payload
        
        # Feature Vector must match training: [rpm, latency, error_rate, payload]
        features = np.array([[rpm, latency_ms, error_rate, payload_size]])
        
        # 3. Predict (1 = Normal, -1 = Anomaly)
        prediction = self.model.predict(features)
        score = self.model.decision_function(features)[0] # Negative score = more anomalous
        
        if prediction[0] == -1:
            # It's an attack
            confidence = min(abs(score) * 2, 0.99) # Fake confidence scaling
            reason = "High Volumetric Traffic (DDoS Pattern)" if rpm > 50 else "Suspicious Scraping Behavior"
            return True, confidence, reason
            
        return False, 0.0, "Normal"

# Singleton
sentinel = SentinelGuard()
