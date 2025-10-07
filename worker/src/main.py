import time

def main():
    print("Worker started. Waiting for conversion jobs...")
    while True:
        # TODO: Connect to Redis queue, fetch job, process file
        time.sleep(10)

if __name__ == '__main__':
    main()