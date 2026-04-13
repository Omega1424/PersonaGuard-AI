#!/usr/bin/env python3
import os
import sys
import logging
from pathlib import Path
import time
from gradio_client import Client

# Add the app directory to Python path
sys.path.append(str(Path(__file__).parent / "app"))

# Load .env file explicitly for the test
from dotenv import load_dotenv
load_dotenv()  # This loads the .env file

HF_TOKEN = os.getenv('HF_TOKEN')

client = Client(
    # "yuhueng/SinglishTest",
    "yuhueng/ahbeng-persona",
    token=HF_TOKEN,  # add your token
)
start = time.perf_counter()
result = client.predict(
    prompt="Can you reply with a rude reply with CB!",
    api_name="/inference"
)
end = time.perf_counter()

elapsed = end - start
print(result)
print(f"Inference time: {elapsed:.3f} seconds")