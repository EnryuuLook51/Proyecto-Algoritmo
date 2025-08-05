import React, { useState, useEffect } from 'react';
import { fetchPrediction, fetchAvailableMatches } from '../api/api.js';
import Sidebar from '../components/Sidebar/Sidebar';
import HomeSection from '../components/Sections/HomeSection';
import HistorySection from '../components/Sections/HistorySection';
import StatsSection from '../components/Sections/StatsSection';
import StatsTeamSection from '../components/Sections/StatsTeamSection';
import StatsLeagueSection from '../components/Sections/StatsLeagueSection';
import SettingsSection from '../components/Sections/SettingsSection';
import '../components/Sections/CommonStyles.css';

const teamNameMapping = {
  'Real Madrid': 'Real Madrid CF',
  'FC Barcelona': 'Barcelona',
  'Atlético Madrid': 'Club Atlético de Madrid',
  'Sevilla FC': 'Sevilla FC',
  'Valencia CF': 'Valencia',
  'Villarreal CF': 'Villarreal',
  'Athletic Club': 'Athletic Club',
  'Real Sociedad': 'Real Sociedad',
  'Getafe CF': 'Getafe',
  'RC Celta': 'RC Celta de Vigo',
  'RCD Espanyol': 'Espanyol',
  'RCD Mallorca': 'Mallorca',
  'Deportivo Alavés': 'Deportivo Alavés',
  'Rayo Vallecano': 'Rayo Vallecano',
  'CA Osasuna': 'CA Osasuna',
  'Girona FC': 'Girona FC',
  'Real Betis': 'Real Betis',
  'UD Las Palmas': 'UD Las Palmas',
  'Cádiz CF': 'Cádiz CF',
  'UD Almería': 'UD Almería',
  'Granada CF': 'Granada CF'
};

const PredictionForm = () => {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState(localStorage.getItem('activeSection') || 'home');
  const [sidebarActive, setSidebarActive] = useState(() => {
    const saved = localStorage.getItem('sidebarActive');
    return saved ? JSON.parse(saved) : window.innerWidth > 768;
  });
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('predictionHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [username, setUsername] = useState(localStorage.getItem('username') || 'Usuario');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('');
  const [teamStats, setTeamStats] = useState(null);
  const [teamStatsError, setTeamStatsError] = useState('');

  useEffect(() => {
    const loadMatches = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAvailableMatches();
        setMatches(data);
        setError('');
      } catch (err) {
        setError(err.message || 'Error al cargar partidos disponibles');
      } finally {
        setIsLoading(false);
      }
    };
    loadMatches();
  }, []);

  useEffect(() => {
    localStorage.setItem('activeSection', activeSection);
  }, [activeSection]);

  useEffect(() => {
    localStorage.setItem('sidebarActive', JSON.stringify(sidebarActive));
  }, [sidebarActive]);

  useEffect(() => {
    localStorage.setItem('predictionHistory', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('username', username);
  }, [username]);

  useEffect(() => {
    if (selectedTeam) {
      const fetchTeamStats = async () => {
        try {
          setIsLoading(true);
          setTeamStatsError('');
          const response = await fetch(`http://localhost:5001/api/team-stats/${selectedTeam}`);
          const data = await response.json();
          if (data.error) throw new Error(data.error);
          setTeamStats(data);
        } catch (err) {
          setTeamStatsError(err.message || 'Error al obtener estadísticas');
          setTeamStats(null);
        } finally {
          setIsLoading(false);
        }
      };
      fetchTeamStats();
    } else {
      setTeamStats(null);
      setTeamStatsError('');
    }
  }, [selectedTeam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMatch) {
      setError('Por favor, selecciona un partido.');
      return;
    }
    const [local, visitante] = selectedMatch.split(' vs ');
    setIsLoading(true);
    setError('');
    setPrediction(null);
    try {
      const result = await fetchPrediction(local, visitante);
      setPrediction(result);
      setHistory((prev) => [
        {
          id: Date.now(),
          local,
          visitante,
          prediccion: result.prediccion,
          confianza: result.confianza,
          cuotas: result.cuotas,
          stats: result.stats,
          date: new Date().toLocaleString(),
        },
        ...prev,
      ]);
    } catch (err) {
      setError(err.message || 'Error al obtener la predicción');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePrediction = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const uniqueTeams = [...new Set(matches.flatMap(match => [
    teamNameMapping[match.homeTeam] || match.homeTeam,
    teamNameMapping[match.awayTeam] || match.awayTeam
  ]))];

  return (
    <div className={`prediction-container ${darkMode ? 'dark' : ''}`}>
      <Sidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        setActiveSection={setActiveSection}
        setSidebarActive={setSidebarActive}
      />
      <div className="main-content" style={{ marginLeft: sidebarActive ? '280px' : '0' }}>
        {activeSection === 'home' && (
          <HomeSection
            matches={matches}
            selectedMatch={selectedMatch}
            setSelectedMatch={setSelectedMatch}
            handleSubmit={handleSubmit}
            prediction={prediction}
            isLoading={isLoading}
            error={error}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        )}
        {activeSection === 'history' && (
          <HistorySection
            history={history}
            handleDeletePrediction={handleDeletePrediction}
          />
        )}
        {activeSection === 'stats' && <StatsSection />}
        {activeSection === 'stats-team' && (
          <StatsTeamSection
            uniqueTeams={uniqueTeams}
            selectedTeam={selectedTeam}
            setSelectedTeam={setSelectedTeam}
            teamStats={teamStats}
            teamStatsError={teamStatsError}
            isLoading={isLoading}
          />
        )}
        {activeSection === 'stats-league' && (
          <StatsLeagueSection
            selectedLeague={selectedLeague}
            setSelectedLeague={setSelectedLeague}
          />
        )}
        {activeSection === 'settings' && (
          <SettingsSection
            username={username}
            setUsername={setUsername}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        )}
      </div>
    </div>
  );
};

export default PredictionForm;