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

  // Listen for changes to the body's class (dark mode toggle)
  useEffect(() => {
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

  const tempColor = getTemperatureColor(temperature);
  const tempLabel = getTemperatureLabel(temperature);

  // Calculer les segments du pie chart
  const remaining = 100 - (temperature / 50 * 100); // Normaliser sur 50°C max
  const data = {
    labels: [tempLabel, 'Restant'],
    datasets: [
      {
        data: [temperature, Math.max(0, remaining)],
        backgroundColor: [
          tempColor,
          isDark ? '#374151' : '#E5E7EB'
        ],
        borderColor: [
          tempColor,
          isDark ? '#4B5563' : '#D1D5DB'
        ],
        borderWidth: 2,
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
            size: 12
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: isDark ? "#23272a" : "#fff",
        titleColor: isDark ? "#f1f5f9" : "#1f2937",
        bodyColor: isDark ? "#f1f5f9" : "#1f2937",
        borderColor: isDark ? "#444" : "#e5e7eb",
        callbacks: {
          label: function(context) {
            if (context.label === tempLabel) {
              return `${context.label}: ${temperature}${unit}`;
            }
            return context.label;
          }
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 lg:col-span-1 py-8 px-6 rounded-xl border-[0.5px] border-gray-300">
      <div className="w-full flex flex-col gap-2 text-left">
        <h2 className="text-xl font-medium leading-none">
          Température Actuelle
        </h2>
        <p className="font-light text-gray-400 text-base leading-none">
          {temperature}{unit} - {tempLabel}
        </p>
      </div>
      <div className="flex flex-col items-center justify-center py-6">
        <div className="relative w-48 h-48">
          <Pie
            data={data}
            options={options}
            className="w-full h-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: tempColor }}>
                {temperature}{unit}
              </div>
              <div className="text-sm text-gray-500">
                {tempLabel}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="text-sm text-gray-500">
          Dernière mise à jour: {new Date().toLocaleTimeString()}
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