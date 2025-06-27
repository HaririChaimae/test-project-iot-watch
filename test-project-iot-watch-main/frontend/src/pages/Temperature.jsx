import React, { useState, useEffect } from 'react';

/* Components */
import Content from '../components/Content';
import Header from '../components/Header';
import TemperaturePieChart from '../components/TemperaturePieChart';
import TemperatureGauge from '../components/TemperatureGauge';
import AnomalyChatbot from '../components/AnomalyChatbot';
// import TemperaturePrediction from '../components/TemperaturePrediction';
// import WeeklyStats from '../components/WeeklyStats';

/* API */
import fetchLatestTemperature from "../api/latest";

function Temperature(){
    const [currentTemperature, setCurrentTemperature] = useState(22.0); // Valeur par défaut

    // Fonction pour récupérer la température actuelle
    const getCurrentTemperature = async () => {
        try {
            const data = await fetchLatestTemperature();
            setCurrentTemperature(data.temperature);
        } catch (error) {
            console.error("Error getting current temperature: ", error);
        }
    };

    // Mise à jour automatique toutes les 10 secondes
    useEffect(() => {
        getCurrentTemperature();
        
        const interval = setInterval(() => {
            getCurrentTemperature();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return(
        <div className="w-screen max-w-screen min-h-screen bg-zinc-50">
            <Header />
            <Content />
            
            {/* Section des visualisations */}
            <div className="flex flex-col gap-8 py-12 px-6">
                <div className="w-full flex flex-col gap-2 text-left">
                    <h1 className="font-bold text-3xl">
                        Visualisations Température
                    </h1>
                    <p className="text-sm font-light text-gray-400">
                        Représentations graphiques de la température actuelle
                    </p>
                </div>
                
                {/* Grille des visualisations */}
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                    <TemperaturePieChart 
                        temperature={currentTemperature} 
                        unit="°C" 
                    />
                    <TemperatureGauge 
                        temperature={currentTemperature} 
                        unit="°C" 
                    />
                </div>
                
                {/* Informations supplémentaires */}
                <div className="mt-8 p-6 bg-white rounded-xl border-[0.5px] border-gray-300 shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Informations sur la température</h3>
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{currentTemperature}°C</div>
                            <div className="text-sm text-gray-600">Température actuelle</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                                {currentTemperature < 15 ? '❄️ Froid' : 
                                 currentTemperature < 20 ? '🌿 Frais' : 
                                 currentTemperature < 25 ? '☀️ Chaud' : 
                                 currentTemperature < 30 ? '🔥 Très chaud' : '🌋 Extrême'}
                            </div>
                            <div className="text-sm text-gray-600">Statut</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">
                                {((currentTemperature / 50) * 100).toFixed(1)}%
                            </div>
                            <div className="text-sm text-gray-600">Pourcentage max</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <AnomalyChatbot />
            {/* <TemperaturePrediction />
            <WeeklyStats /> */}
        </div>
    )
}

export default Temperature;