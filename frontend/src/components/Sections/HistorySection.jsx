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
          {history.map((item) => {
            // Extraer local y visitante desde partido o usar homeTeam/awayTeam como fallback
            const [local, visitante] = item.partido ? item.partido.split(' vs ') : [item.homeTeam || 'N/A', item.awayTeam || 'N/A'];
            return (
              <li key={item.id} className="history-item animate-slide-in">
                <div>
                  <p>
                    <strong>{local}</strong> vs <strong>{visitante}</strong>
                  </p>
                  <p>Resultado: {item.prediccion || 'No disponible'}</p>
                  <p>Confianza: {item.confianza || 'N/A'}</p>
                  <p>
                    Cuotas: Local {item.cuotas?.local || 'N/A'}, Empate {item.cuotas?.empate || 'N/A'}, Visitante{' '}
                    {item.cuotas?.visitante || 'N/A'}
                  </p>
                  <p>
                    Estadísticas: Puntos Local {item.stats?.local_points || 0}, Puntos Visitante{' '}
                    {item.stats?.visitante_points || 0}
                  </p>
                  <p>Fecha: {item.date || 'N/A'}</p>
                </div>
                <button
                  className="delete-button"
                  onClick={() => handleDeletePrediction(item.id)}
                  aria-label="Eliminar predicción"
                >
                  <FiTrash2 size={20} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default HistorySection;