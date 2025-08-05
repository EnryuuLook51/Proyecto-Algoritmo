import React, { useState, useEffect } from 'react';
import { FiHome, FiClock, FiBarChart2, FiSettings, FiMenu, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = ({ darkMode, setDarkMode, setActiveSection, setSidebarActive }) => {
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarActive');
    return saved ? JSON.parse(saved) : window.innerWidth > 768;
  });
  const [subMenuOpen, setSubMenuOpen] = useState(null);
  const [activeItem, setActiveItem] = useState(localStorage.getItem('activeSection') || 'home');

  useEffect(() => {
    localStorage.setItem('sidebarActive', JSON.stringify(isOpen));
    setSidebarActive(isOpen);
  }, [isOpen, setSidebarActive]);

  useEffect(() => {
    localStorage.setItem('activeSection', activeItem);
    setActiveSection(activeItem);
  }, [activeItem, setActiveSection]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const toggleSubMenu = (section) => {
    setSubMenuOpen(subMenuOpen === section ? null : section);
  };

  const menuItems = [
    { name: 'Inicio', icon: <FiHome size={24} />, section: 'home', tooltip: 'Volver al formulario de predicción' },
    { name: 'Historial', icon: <FiClock size={24} />, section: 'history', tooltip: 'Ver predicciones anteriores', badge: 3 },
    {
      name: 'Estadísticas',
      icon: <FiBarChart2 size={24} />,
      section: 'stats',
      tooltip: 'Ver estadísticas de equipos y ligas',
      subMenu: [
        { name: 'Por Equipo', section: 'stats-team', tooltip: 'Estadísticas por equipo' },
        { name: 'Por Liga', section: 'stats-league', tooltip: 'Estadísticas por liga' },
      ],
    },
    { name: 'Configuración', icon: <FiSettings size={24} />, section: 'settings', tooltip: 'Ajustar preferencias' },
  ];

  return (
    <>
      <button
        className={`sidebar-toggle ${isOpen ? 'active' : ''}`}
        onClick={toggleSidebar}
        aria-label={isOpen ? 'Desactivar barra lateral' : 'Activar barra lateral'}
      >
        {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
      </button>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <FiHome size={32} />
            <h2>Prediccion Futbol</h2>
          </div>
        </div>
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.section} className="sidebar-item-wrapper">
              <div
                className={`sidebar-item ${activeItem === item.section ? 'active' : ''}`}
                onClick={() => {
                  if (item.subMenu) {
                    toggleSubMenu(item.section);
                  } else {
                    setActiveItem(item.section);
                    setActiveSection(item.section);
                    if (item.section === 'settings') setDarkMode(!darkMode);
                    if (window.innerWidth <= 768) setIsOpen(false);
                  }
                }}
                role="button"
                aria-label={item.tooltip}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span>{item.name}</span>
                {item.badge && <span className="sidebar-badge">{item.badge}</span>}
                {item.subMenu && (
                  <span className="sidebar-chevron">
                    {subMenuOpen === item.section ? <FiChevronUp size={22} /> : <FiChevronDown size={22} />}
                  </span>
                )}
              </div>
              {item.subMenu && subMenuOpen === item.section && (
                <ul className="sidebar-submenu">
                  {item.subMenu.map((subItem) => (
                    <li
                      key={subItem.section}
                      className={`sidebar-subitem ${activeItem === subItem.section ? 'active' : ''}`}
                      onClick={() => {
                        setActiveItem(subItem.section);
                        setActiveSection(subItem.section);
                        if (window.innerWidth <= 768) setIsOpen(false);
                      }}
                      role="button"
                      aria-label={subItem.tooltip}
                    >
                      <span>{subItem.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;