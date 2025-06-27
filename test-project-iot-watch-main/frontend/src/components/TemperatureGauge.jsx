import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const TemperatureGauge = ({ temperature, unit = "°C" }) => {
  const [isDark, setIsDark] = useState(false);

  // Helper to get initial dark mode state
  const getInitialDark = () => {
    if (localStorage.getItem("theme")) {
      return localStorage.getItem("theme") === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  // Listen for changes to the body's class (dark mode toggle)
  useEffect(() => {
    setIsDark(getInitialDark());
    const observer = new MutationObserver(() => {
      setIsDark(document.body.classList.contains('dark'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Définir les couleurs basées sur la température
  const getTemperatureColor = (temp) => {
    if (temp < 15) return '#3B82F6'; // Bleu froid
    if (temp < 20) return '#10B981'; // Vert frais
    if (temp < 25) return '#F59E0B'; // Orange chaud
    if (temp < 30) return '#EF4444'; // Rouge très chaud
    return '#7C3AED'; // Violet extrême
  };

  const getTemperatureLabel = (temp) => {
    if (temp < 15) return 'Froid';
    if (temp < 20) return 'Frais';
    if (temp < 25) return 'Chaud';
    if (temp < 30) return 'Très chaud';
    return 'Extrême';
  };

  const getTemperatureEmoji = (temp) => {
    if (temp < 15) return '❄️';
    if (temp < 20) return '🌿';
    if (temp < 25) return '☀️';
    if (temp < 30) return '🔥';
    return '🌋';
  };

  const tempColor = getTemperatureColor(temperature);
  const tempLabel = getTemperatureLabel(temperature);
  const tempEmoji = getTemperatureEmoji(temperature);

  // Calculer l'angle pour la jauge (de -135° à 135°, soit 270° total)
  const minTemp = 0;
  const maxTemp = 50;
  const clampedTemp = Math.max(minTemp, Math.min(maxTemp, temperature));
  const percentage = (clampedTemp - minTemp) / (maxTemp - minTemp);
  const angle = -135 + (percentage * 270);

  return (
    <div className="flex flex-col gap-6 lg:col-span-1 py-8 px-6 rounded-xl border-[0.5px] border-gray-300 shadow-lg bg-white">
      <div className="w-full flex flex-col gap-2 text-left">
        <h2 className="text-2xl font-bold leading-none flex items-center gap-2">
          {tempEmoji} Jauge de Température
        </h2>
        <p className="font-light text-gray-500 text-base leading-none">
          {temperature}{unit} - {tempLabel}
        </p>
      </div>
      
      <div className="flex flex-col items-center justify-center py-6">
        <div className="relative w-64 h-32">
          {/* Jauge de fond */}
          <svg width="256" height="128" viewBox="0 0 256 128" className="absolute">
            {/* Arc de fond */}
            <path
              d="M 20 100 A 80 80 0 0 1 236 100"
              fill="none"
              stroke={isDark ? "#374151" : "#E5E7EB"}
              strokeWidth="12"
              strokeLinecap="round"
            />
            
            {/* Arc de température */}
            <path
              d={`M 20 100 A 80 80 0 0 1 ${20 + 216 * percentage} ${100 - 80 * Math.sin(percentage * Math.PI)}`}
              fill="none"
              stroke={tempColor}
              strokeWidth="12"
              strokeLinecap="round"
            />
            
            {/* Aiguille */}
            <line
              x1="128"
              y1="100"
              x2={128 + 60 * Math.cos((angle - 90) * Math.PI / 180)}
              y2={100 - 60 * Math.sin((angle - 90) * Math.PI / 180)}
              stroke={tempColor}
              strokeWidth="3"
              strokeLinecap="round"
            />
            
            {/* Point central */}
            <circle cx="128" cy="100" r="6" fill={tempColor} />
          </svg>
          
          {/* Température au centre */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-3xl font-bold mb-1" style={{ color: tempColor }}>
              {temperature}{unit}
            </div>
            <div className="text-sm font-medium text-gray-600">
              {tempLabel}
            </div>
          </div>
        </div>
      </div>
      
      {/* Échelle de température */}
      <div className="flex justify-between items-center px-4">
        <div className="text-xs text-gray-500">0°C</div>
        <div className="text-xs text-gray-500">25°C</div>
        <div className="text-xs text-gray-500">50°C</div>
      </div>
      
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-600">Statut:</span>
          <span className="text-sm font-bold" style={{ color: tempColor }}>
            {tempEmoji} {tempLabel}
          </span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-600">Pourcentage:</span>
          <span className="text-sm font-bold" style={{ color: tempColor }}>
            {(percentage * 100).toFixed(1)}%
          </span>
        </div>
        
        <div className="flex justify-center pt-2">
          <div className="text-xs text-gray-400 text-center">
            Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}
          </div>
        </div>
      </div>
    </div>
  );
};

TemperatureGauge.propTypes = {
  temperature: PropTypes.number.isRequired,
  unit: PropTypes.string,
};

export default TemperatureGauge; 