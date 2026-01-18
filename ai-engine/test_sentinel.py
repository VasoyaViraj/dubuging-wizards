import requests
import time
import sys

# CONFIGURATION
BASE_URL = "http://localhost:8000"  # Ensure your FastAPI server is running here
TARGET_ENDPOINT = f"{BASE_URL}/api/health" # We hit a simple endpoint

def run_test():
    print("🛡️  INITIALIZING SECURITY SYSTEM TEST...")
    print(f"Target: {TARGET_ENDPOINT}\n")

    # PHASE 1: NORMAL TRAFFIC TEST
    print("--- PHASE 1: Simulating NORMAL User Behavior ---")
    print("Sending 5 requests with 1-second delay...")
    
    for i in range(5):
        try:
            response = requests.get(TARGET_ENDPOINT)
            status = response.status_code
            
            # Check for Sentinel Headers (if you implemented the header flag)
            sentinel_alert = response.headers.get("X-Sentinel-Alert", "False")
            
            if status == 200 and sentinel_alert == "False":
                print(f"✅ Request {i+1}: Passed (Status 200)")
            else:
                print(f"⚠️ Request {i+1}: Warning! Unexpected Status {status}")
            
            time.sleep(1) # Wait 1 second between requests (Human behavior)
        except Exception as e:
            print(f"❌ Connection Error: {e}")
            sys.exit(1)

    print("\nPhase 1 Complete: System accepts normal traffic.\n")
    time.sleep(2)

    # --- PHASE 2: ATTACK SIMULATION ---
    print("--- PHASE 2: Simulating DDoS / BOT Attack ---")
    print("🚀 Firing 50 requests with NO DELAY (Spamming)...")
    
    blocked_count = 0
    success_count = 0
    
    for i in range(50):
        try:
            # NO SLEEP HERE - This simulates a machine-gun attack
            response = requests.get(TARGET_ENDPOINT)
            
            # We look for 403 Forbidden OR the Alert Header
            if response.status_code == 403:
                print(f"⛔ Request {i+1}: BLOCKED BY SENTINEL (Status 403)")
                blocked_count += 1
            elif response.headers.get("X-Sentinel-Alert") == "True":
                print(f"🚩 Request {i+1}: FLAGGED AS SUSPICIOUS (Header Detected)")
                blocked_count += 1
            else:
                print(f"✅ Request {i+1}: Still passing...")
                success_count += 1
                
        except Exception as e:
            print(f"❌ Request failed: {e}")

    # --- FINAL REPORT ---
    print("\n" + "="*40)
    print("📊 SECURITY TEST REPORT")
    print("="*40)
    print(f"Total Attack Requests: 50")
    print(f"Successful (Bypassed): {success_count}")
    print(f"Blocked/Flagged:       {blocked_count}")
    
    if blocked_count > 0:
        print("\n✅ RESULT: SUCCESS. The Sentinel AI is active and defending.")
    else:
        print("\n❌ RESULT: FAIL. The AI did not block any requests.")
        print("Tip: Check if 'sentinel_model.pkl' exists or lower your threshold.")
    print("="*40)

if __name__ == "__main__":
    run_test()