const checkAnomaly = async (temperature, threshold = 2.0) => {
  try {
    const response = await fetch('http://localhost:5000/check-temp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ temperature, threshold }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error checking anomaly:", error);
    return { error: error.message };
  }
};

export default checkAnomaly; 