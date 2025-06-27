import json
import os
from datetime import datetime
from typing import List, Dict, Any

DATA_FILE = "data/temperatures.jsonl"

def ensure_data_directory():
    os.makedirs("data", exist_ok=True)

def save_temperature(value: float) -> Dict[str, Any]:
    ensure_data_directory()
    entry = {
        "timestamp": datetime.now().isoformat(),
        "temperature": value
    }
    with open(DATA_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry) + "\n")
    return entry

def read_all_temperatures() -> List[float]:
    ensure_data_directory()
    temperatures = []
    if not os.path.exists(DATA_FILE):
        return temperatures
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                try:
                    entry = json.loads(line)
                    temperatures.append(entry["temperature"])
                except (json.JSONDecodeError, KeyError):
                    continue
    return temperatures 