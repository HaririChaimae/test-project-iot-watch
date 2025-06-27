import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);
import { Pie } from "react-chartjs-2";

// Helper to get initial dark mode state
const getInitialDark = () => {
  if (localStorage.getItem("theme")) {
    return localStorage.getItem("theme") === "dark";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

const TemperaturePieChart = ({ temperature, unit = "°C" }) => {
  const [isDark, setIsDark] = useState(getInitialDark());
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Listen for changes to the body's class (dark mode toggle)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.body.classList.contains('dark'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Mettre à jour le timestamp quand la température change
  useEffect(() => {
    setLastUpdate(new Date());
  }, [temperature]);

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

  // Calculer les segments du pie chart avec une approche différente
  const maxTemp = 50; // Température maximale pour la normalisation
  const tempPercentage = Math.min((temperature / maxTemp) * 100, 100);
  const remaining = 100 - tempPercentage;

  const data = {
    labels: [`${tempEmoji} ${tempLabel}`, 'Échelle'],
    datasets: [
      {
        data: [tempPercentage, remaining],
        backgroundColor: [
          tempColor,
          isDark ? '#374151' : '#F3F4F6'
        ],
        borderColor: [
          tempColor,
          isDark ? '#4B5563' : '#E5E7EB'
        ],
        borderWidth: 3,
        hoverBorderWidth: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: isDark ? "#f1f5f9" : "#1f2937",
          font: {
            size: 14,
            weight: 'bold'
          },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: isDark ? "#23272a" : "#fff",
        titleColor: isDark ? "#f1f5f9" : "#1f2937",
        bodyColor: isDark ? "#f1f5f9" : "#1f2937",
        borderColor: isDark ? "#444" : "#e5e7eb",
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          title: function(context) {
            return `${tempEmoji} Température Actuelle`;
          },
          label: function(context) {
            if (context.label.includes(tempLabel)) {
              return `${tempLabel}: ${temperature}${unit} (${tempPercentage.toFixed(1)}%)`;
            }
            return `Échelle: ${remaining.toFixed(1)}%`;
          }
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 lg:col-span-1 py-8 px-6 rounded-xl border-[0.5px] border-gray-300 shadow-lg bg-white">
      <div className="w-full flex flex-col gap-2 text-left">
        <h2 className="text-2xl font-bold leading-none flex items-center gap-2">
          {tempEmoji} Température Actuelle
        </h2>
        <p className="font-light text-gray-500 text-base leading-none">
          {temperature}{unit} - {tempLabel}
        </p>
      </div>
      
      <div className="flex flex-col items-center justify-center py-6">
        <div className="relative w-56 h-56">
          <Pie
            data={data}
            options={options}
            className="w-full h-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: tempColor }}>
                {temperature}{unit}
              </div>
              <div className="text-lg font-medium text-gray-600 mb-1">
                {tempLabel}
              </div>
              <div className="text-sm text-gray-400">
                {tempEmoji}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-600">Statut:</span>
          <span className="text-sm font-bold" style={{ color: tempColor }}>
            {tempLabel}
          </span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-600">Pourcentage:</span>
          <span className="text-sm font-bold" style={{ color: tempColor }}>
            {tempPercentage.toFixed(1)}%
          </span>
        </div>
        
        <div className="flex justify-center pt-2">
          <div className="text-xs text-gray-400 text-center">
            Dernière mise à jour: {lastUpdate.toLocaleTimeString('fr-FR')}
          </div>
        </div>
      </div>
    </div>
  );
};

TemperaturePieChart.propTypes = {
  temperature: PropTypes.number.isRequired,
  unit: PropTypes.string,
};

export default TemperaturePieChart; 