import React from 'react';
import { FiBarChart2 } from 'react-icons/fi';
import './StatsLeagueSection.css';

const StatsLeagueSection = ({ selectedLeague, setSelectedLeague }) => {
  const leagueStats = selectedLeague
    ? [
        { position: 1, team: 'Real Madrid', points: 95, played: 38, wins: 29, draws: 8, losses: 1 },
        { position: 2, team: 'Barcelona', points: 85, played: 38, wins: 26, draws: 7, losses: 5 },
        { position: 3, team: 'Atlético Madrid', points: 76, played: 38, wins: 24, draws: 4, losses: 10 },
        { position: 4, team: 'Sevilla', points: 70, played: 38, wins: 19, draws: 13, losses: 6 },
      ]
    : [];

  return (
    <div className="prediction-card animate-fade-in">
      <div className="prediction-header">
        <h2>
          <FiBarChart2 className="header-icon" /> Estadísticas por Liga
        </h2>
      </div>
      <div className="form-group">
        <label>Seleccionar Liga</label>
        <select value={selectedLeague} onChange={(e) => setSelectedLeague(e.target.value)} aria-required="true">
          <option value="">Selecciona una liga</option>
          {['La Liga'].map((liga) => (
            <option key={`league-${liga}`} value={liga}>
              {liga}
            </option>
          ))}
        </select>
      </div>
      {selectedLeague && leagueStats.length > 0 && (
        <div className="stats-table animate-slide-in">
          <h3>{selectedLeague}</h3>
          <table>
            <thead>
              <tr>
                <th>Posición</th>
                <th>Equipo</th>
                <th>Puntos</th>
                <th>Jugados</th>
                <th>Victorias</th>
                <th>Empates</th>
                <th>Derrotas</th>
              </tr>
            </thead>
            <tbody>
              {leagueStats.map((team) => (
                <tr key={team.position}>
                  <td>{team.position}</td>
                  <td>{team.team}</td>
                  <td>{team.points}</td>
                  <td>{team.played}</td>
                  <td>{team.wins}</td>
                  <td>{team.draws}</td>
                  <td>{team.losses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StatsLeagueSection;