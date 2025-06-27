const predictAnomalyTomorrow = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/predict-anomaly');
    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
};

export default predictAnomalyTomorrow; 