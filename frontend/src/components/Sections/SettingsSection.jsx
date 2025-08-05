import React from 'react';
import { FiSettings, FiSun, FiMoon } from 'react-icons/fi';
import './SettingsSection.css';

const SettingsSection = ({ username, setUsername, darkMode, setDarkMode }) => {
  const handleUsernameChange = (e) => {
    setUsername(e.target.value || 'Usuario');
  };

  return (
    <div className="prediction-card animate-fade-in">
      <div className="prediction-header">
        <h2>
          <FiSettings className="header-icon" /> Configuración
        </h2>
      </div>
      <div className="form-group">
        <label>Nombre de Usuario</label>
        <input
          type="text"
          value={username}
          onChange={handleUsernameChange}
          placeholder="Ingresa tu nombre"
          className="username-input"
          aria-label="Nombre de usuario"
        />
      </div>
      <div className="form-group">
        <label>Tema</label>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="theme-toggle theme-toggle-full"
          aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {darkMode ? (
            <>
              <FiSun size={24} /> Modo Claro
            </>
          ) : (
            <>
              <FiMoon size={24} /> Modo Oscuro
            </>
          )}
        </button>
      </div>
      <p>Usuario actual: {username}</p>
    </div>
  );
};

export default SettingsSection;