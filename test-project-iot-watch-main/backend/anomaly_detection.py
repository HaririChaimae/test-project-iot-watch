import numpy as np
import json
from datetime import datetime, timedelta

def is_anomaly(temperature, threshold=2.0):
    """
    Check if a temperature is anomalous using Z-score method
    """
    try:
        # Load historical temperatures
        with open('data/temperatures.jsonl', 'r') as f:
            lines = f.readlines()
        
        if len(lines) < 10:  # Need at least 10 data points
            return False, 0
        
        # Extract temperatures from last 24 hours
        temperatures = []
        for line in lines[-24:]:  # Last 24 entries
            try:
                data = json.loads(line.strip())
                if 'temperature' in data:
                    temperatures.append(data['temperature'])
            except:
                continue
        
        if len(temperatures) < 5:  # Need at least 5 data points
            return False, 0
        
        # Calculate Z-score
        mean_temp = np.mean(temperatures)
        std_temp = np.std(temperatures)
        
        if std_temp == 0:
            return False, 0
        
        z_score = abs(temperature - mean_temp) / std_temp
        
        return z_score > threshold, z_score
        
    except Exception as e:
        print(f"Error in anomaly detection: {e}")
        return False, 0

def detect_anomalies_with_details(temperatures, threshold=2.0):
    """
    Detect anomalies in a list of temperatures with detailed information
    """
    if len(temperatures) < 5:
        return []
    
    mean_temp = np.mean(temperatures)
    std_temp = np.std(temperatures)
    
    if std_temp == 0:
        return []
    
    anomalies = []
    for i, temp in enumerate(temperatures):
        z_score = abs(temp - mean_temp) / std_temp
        if z_score > threshold:
            anomalies.append({
                'index': i,
                'temperature': temp,
                'z_score': z_score,
                'severity': 'high' if z_score > 3.0 else 'medium' if z_score > 2.5 else 'low'
            })
    
    return anomalies

def get_anomaly_severity(z_score):
    """
    Get anomaly severity based on Z-score
    """
    if z_score > 3.0:
        return 'high'
    elif z_score > 2.5:
        return 'medium'
    elif z_score > 2.0:
        return 'low'
    else:
        return 'normal' 