
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib
import os

def generate_synthetic_data(n_samples=5000):
    """
    Creates a dataset of 5000 requests.
    Features:
    1. requests_per_minute (RPM): High = Bad
    2. avg_latency_ms: Very low (bot) or Very high (DoS) = Bad
    3. error_rate: High 4xx/5xx = Bad
    4. payload_size: Anomalous sizes = Bad
    """
    np.random.seed(42)
    
    # Generate NORMAL Traffic 
    # Normal users click 5-20 times a minute, take 200ms, rarely error
    n_normal = int(n_samples * 0.90)
    normal_data = pd.DataFrame({
        'requests_per_min': np.random.normal(15, 5, n_normal),
        'avg_latency': np.random.normal(200, 50, n_normal),
        'error_rate': np.random.beta(1, 20, n_normal), # Skewed towards 0
        'payload_size': np.random.normal(500, 100, n_normal)
    })
        
    # Generate ATTACK Traffic (The Bad Guys)
    n_attack = n_samples - n_normal
    
    # Type A: DDoS Volumetric (High RPM, High Errors)
    ddos_data = pd.DataFrame({
        'requests_per_min': np.random.normal(200, 50, n_attack // 2),
        'avg_latency': np.random.normal(1000, 200, n_attack // 2),
        'error_rate': np.random.uniform(0.5, 1.0, n_attack // 2),
        'payload_size': np.random.normal(500, 100, n_attack // 2)
    })

    # Type B: Scraper Bot (Fast, Low Latency, Precise)
    scraper_data = pd.DataFrame({
        'requests_per_min': np.random.normal(60, 10, n_attack - len(ddos_data)),
        'avg_latency': np.random.normal(10, 5, n_attack - len(ddos_data)), # Inhumanly fast
        'error_rate': np.random.uniform(0.0, 0.1, n_attack - len(ddos_data)),
        'payload_size': np.random.normal(2000, 10, n_attack - len(ddos_data)) # Always scraping big pages
    })

    # Combine
    data = pd.concat([normal_data, ddos_data, scraper_data]).reset_index(drop=True)
    return data

def train_and_save():
    print("🤖 Generative Synthetic Traffic Logs...")
    data = generate_synthetic_data()
    
    # Use only the features for training
    X = data.values

    print("🧠 Training Isolation Forest Model...")
    # contamination=0.1 means we expect roughly 10% of traffic to be malicious
    model = IsolationForest(n_estimators=100, contamination=0.1, random_state=42)
    model.fit(X)
    
    # Save the model
    save_path = os.path.join(os.path.dirname(__file__), 'sentinel_model.pkl')
    joblib.dump(model, save_path)
    print(f"✅ Sentinel Model saved to {save_path}")

if __name__ == "__main__":
    train_and_save()