import React from 'react';
import { FiClock, FiTrash2 } from 'react-icons/fi';
import './HistorySection.css';

const HistorySection = ({ history, handleDeletePrediction }) => {
  return (
    <div className="prediction-card animate-fade-in">
      <div className="prediction-header">
        <h2>
          <FiClock className="header-icon" /> Historial de Predicciones
        </h2>
      </div>
      {history.length === 0 ? (
        <p>No hay predicciones recientes. ¡Realiza una predicción para empezar!</p>
      ) : (
        <ul className="history-list">
          {history.map((item) => (
            <li key={item.id} className="history-item animate-slide-in">
              <div>
                <p>
                  <strong>{item.local}</strong> vs <strong>{item.visitante}</strong>
                </p>
                <p>Resultado: {item.prediccion}</p>
                <p>Confianza: {item.confianza}</p>
                <p>Cuotas: Local {item.cuotas.local}, Empate {item.cuotas.empate}, Visitante {item.cuotas.visitante}</p>
                <p>Estadísticas: Puntos Local {item.stats.local_points}, Puntos Visitante {item.stats.visitante_points}</p>
                <p>Fecha: {item.date}</p>
              </div>
              <button
                className="delete-button"
                onClick={() => handleDeletePrediction(item.id)}
                aria-label="Eliminar predicción"
              >
                <FiTrash2 size={20} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistorySection;