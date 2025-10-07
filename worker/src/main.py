import redis
import time

def fetch_job(r):
    # Simple Redis list pop simulation (blocking)
    job = r.blpop('job-queue', timeout=5)
    if job:
        print(f"Fetched job: {job[1].decode()}")
    else:
        print("No job found...")

def main():
    print("Worker started. Waiting for conversion jobs...")
    r = redis.Redis(host='redis', port=6379, db=0)  # 'redis' is docker-compose service name
    while True:
        try:
            fetch_job(r)
        except Exception as e:
            print(f"Worker error: {e}")
        time.sleep(2)

if __name__ == '__main__':
    main()