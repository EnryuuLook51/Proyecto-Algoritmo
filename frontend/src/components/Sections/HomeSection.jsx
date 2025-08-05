import React from 'react';
import PredictionComponent from '../Prediction/PredictionComponent';
import { FiAward, FiSun, FiMoon } from 'react-icons/fi';
import './HomeSection.css';

const HomeSection = ({ matches, selectedMatch, setSelectedMatch, handleSubmit, prediction, isLoading, error, darkMode, setDarkMode }) => {
  return (
    <div className="prediction-card animate-fade-in">
      <div className="prediction-header">
        <h2>
          <FiAward className="header-icon" /> Predecir Partido
        </h2>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="theme-toggle"
          aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {darkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="prediction-form">
        <div className="form-group">
          <label>Seleccionar Partido</label>
          <select
            value={selectedMatch}
            onChange={(e) => setSelectedMatch(e.target.value)}
            aria-required="true"
          >
            <option value="">Selecciona un partido</option>
            {matches.map((match, index) => (
              <option key={index} value={`${match.homeTeam} vs ${match.awayTeam}`}>
                {match.homeTeam} vs {match.awayTeam} ({new Date(match.date).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="predict-button"
          aria-disabled={isLoading}
        >
          {isLoading ? 'Calculando...' : 'Predecir Partido'}
        </button>
      </form>

      <div className="result-area">
        <PredictionComponent
          localTeam={selectedMatch ? selectedMatch.split(' vs ')[0] : ''}
          awayTeam={selectedMatch ? selectedMatch.split(' vs ')[1] : ''}
          prediction={prediction}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};

export default HomeSection;