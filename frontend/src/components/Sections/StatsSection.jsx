import React from 'react';
import { FiBarChart2 } from 'react-icons/fi';
import './StatsSection.css';

const StatsSection = () => {
  return (
    <div className="prediction-card animate-fade-in">
      <div className="prediction-header">
        <h2>
          <FiBarChart2 className="header-icon" /> Estadísticas
        </h2>
      </div>
      <p>Selecciona una opción en el menú lateral para ver estadísticas detalladas.</p>
    </div>
  );
};

export default StatsSection;