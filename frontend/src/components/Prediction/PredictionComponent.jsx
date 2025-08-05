import React from 'react';
import { ClipLoader } from 'react-spinners';
import { FiAlertTriangle, FiCheckCircle, FiDollarSign, FiAward } from 'react-icons/fi';
import './PredictionComponent.css';

function PredictionComponent({ localTeam, awayTeam, prediction, isLoading, error }) {
  return (
    <div className="prediction-component">
      <h3>
        <FiAward className="header-icon" /> Partido a Predecir
      </h3>
      <p className="teams">
        {localTeam || 'Equipo local no seleccionado'} vs{' '}
        {awayTeam || 'Equipo visitante no seleccionado'}
      </p>

      {isLoading && (
        <div className="spinner-container">
          <ClipLoader size={48} color="#3b82f6" />
        </div>
      )}
      {error && (
        <p className="error">
          <FiAlertTriangle size={24} /> {error}
        </p>
      )}
      {prediction && (
        <div className="result animate-slide-in">
          <h2>
            <FiCheckCircle size={28} /> Resultado: {prediction.prediccion || prediction.error}
          </h2>
          {prediction.confianza && (
            <p className="confidence">Confianza: {prediction.confianza}</p>
          )}
          {prediction.cuotas && (
            <div className="odds-container">
              <div className="odds-card">
                <p className="odds-title">
                  <FiDollarSign size={20} /> Victoria Local
                </p>
                <p className="odds-value">{prediction.cuotas.local}</p>
              </div>
              <div className="odds-card">
                <p className="odds-title">
                  <FiDollarSign size={20} /> Empate
                </p>
                <p className="odds-value">{prediction.cuotas.empate}</p>
              </div>
              <div className="odds-card">
                <p className="odds-title">
                  <FiDollarSign size={20} /> Victoria Visitante
                </p>
                <p className="odds-value">{prediction.cuotas.visitante}</p>
              </div>
            </div>
          )}
          {prediction.stats && (
            <div className="stats-table animate-slide-in">
              <h3>Estadísticas</h3>
              <table>
                <tbody>
                  <tr>
                    <td>Puntos Local</td>
                    <td>{prediction.stats.local_points}</td>
                  </tr>
                  <tr>
                    <td>Puntos Visitante</td>
                    <td>{prediction.stats.visitante_points}</td>
                  </tr>
                  <tr>
                    <td>Diferencia de Goles Local</td>
                    <td>{prediction.stats.local_goal_diff}</td>
                  </tr>
                  <tr>
                    <td>Diferencia de Goles Visitante</td>
                    <td>{prediction.stats.visitante_goal_diff}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PredictionComponent;