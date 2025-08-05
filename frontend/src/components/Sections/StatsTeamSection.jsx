import React from 'react';
import { FiBarChart2, FiAlertTriangle } from 'react-icons/fi';
import { ClipLoader } from 'react-spinners';
import './StatsTeamSection.css';

const StatsTeamSection = ({ uniqueTeams, selectedTeam, setSelectedTeam, teamStats, teamStatsError, isLoading }) => {
  return (
    <div className="prediction-card animate-fade-in">
      <div className="prediction-header">
        <h2>
          <FiBarChart2 className="header-icon" /> Estadísticas por Equipo
        </h2>
      </div>
      <div className="form-group">
        <label>Seleccionar Equipo</label>
        <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)} aria-required="true">
          <option value="">Selecciona un equipo</option>
          {uniqueTeams.map((team, index) => (
            <option key={`team-${index}`} value={team}>
              {team}
            </option>
          ))}
        </select>
      </div>
      {isLoading && (
        <div className="spinner-container">
          <ClipLoader size={48} color="#3b82f6" />
        </div>
      )}
      {teamStatsError && (
        <p className="error">
          <FiAlertTriangle size={24} /> {teamStatsError}
        </p>
      )}
      {teamStats && (
        <div className="stats-table animate-slide-in">
          <h3>{teamStats.name}</h3>
          <table>
            <tbody>
              <tr>
                <td>Partidos Jugados</td>
                <td>{teamStats.matchesPlayed}</td>
              </tr>
              <tr>
                <td>Victorias</td>
                <td>{teamStats.wins}</td>
              </tr>
              <tr>
                <td>Empates</td>
                <td>{teamStats.draws}</td>
              </tr>
              <tr>
                <td>Derrotas</td>
                <td>{teamStats.losses}</td>
              </tr>
              <tr>
                <td>Goles a Favor</td>
                <td>{teamStats.goalsFor}</td>
              </tr>
              <tr>
                <td>Goles en Contra</td>
                <td>{teamStats.goalsAgainst}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StatsTeamSection;