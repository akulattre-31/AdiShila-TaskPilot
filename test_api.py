import requests
import time

BASE_URL = "http://localhost:8000"

def test_api():
    print("Testing Session Authentication...")
    try:
        # Create session
        res = requests.post(f"{BASE_URL}/api/session", json={"team_id": "1234", "name": "John Doe"})
        print(f"Session creation status: {res.status_code}")
        if res.status_code == 200:
            token = res.json().get("token") # FIX: "token" not "access_token"
            print(f"Token received: {token[:10]}...")
            
            headers = {"Authorization": f"Bearer {token}"}
            
            # Use token for /api/recommend
            res2 = requests.post(f"{BASE_URL}/api/recommend", json={
                "profile": {"teamId": "1234", "name": "John Doe", "skills": [], "track": "Tech", "cohort": "I", "hoursPerWeek": 10, "experience": "Beginner", "preferHighGbp": True, "preferLowTime": False, "preferNewTasks": True},
                "completed_task_ids": [],
                "skipped_task_ids": []
            }, headers=headers)
            print(f"Auth request status: {res2.status_code}")
            if res2.status_code != 200:
                print(f"Auth error: {res2.text}")
                
            print("\nTesting Rate Limit on /api/tip...")
            # Send 6 requests quickly (limit is 2/hour per IP according to tip.py)
            for i in range(5):
                try:
                    res_tip = requests.get(f"{BASE_URL}/api/tip", headers=headers)
                    print(f"Req {i+1}: Status {res_tip.status_code}")
                    if res_tip.status_code == 429:
                        print("Rate limit triggered successfully!")
                        break
                except Exception as e:
                    print(f"Error: {e}")
                time.sleep(0.1)
                
        else:
            print("Failed to create session.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_api()
