import React, { useEffect, useState } from "react";
import checkAnomaly from "../api/checkAnomaly";

const AnomalyAlert = ({ temperature }) => {
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (temperature !== null && temperature !== undefined) {
      checkAnomaly(temperature).then(setResult);
    }
  }, [temperature]);

  if (!result || result.error) return null;
  if (!result.anomaly) return null;

  return (
    <div className="p-4 rounded-lg mt-4 bg-red-100 text-red-700 border border-red-400 shadow">
      <strong>🚨 Anomalie détectée !</strong>
      <div className="mt-2 text-sm">
        <div>Z-score : {result.z_score}</div>
        <div>Moyenne : {result.mean}°C</div>
        <div>Écart-type : {result.std}</div>
        <div>Seuil : {result.threshold}</div>
        <div>Raison : {result.reason}</div>
      </div>
    </div>
  );
};

export default AnomalyAlert; 