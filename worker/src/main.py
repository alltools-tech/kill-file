import redis
import time
import json

def fetch_job(r):
    job = r.blpop('job-queue', timeout=5)
    if job:
        job_data = json.loads(job[1].decode())
        print(f"Fetched job: {job_data}")
        # Job processing simulation
        job_id = job_data.get("jobId")
        # Status update in Redis: job:<job_id> = processed
        r.set(f"job:{job_id}", "processed")
        print(f"Set status 'processed' for {job_id}")
    else:
        print("No job found...")

def main():
    print("Worker started. Waiting for conversion jobs...")
    r = redis.Redis(host='redis', port=6379, db=0)
    while True:
        try:
            fetch_job(r)
        except Exception as e:
            print(f"Worker error: {e}")
        time.sleep(2)

if __name__ == '__main__':
    main()