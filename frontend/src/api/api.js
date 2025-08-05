import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Llama al backend para obtener una predicción del modelo.
 * @param {string} local - Nombre del equipo local.
 * @param {string} visitante - Nombre del equipo visitante.
 * @returns {Promise<object>} La predicción del backend.
 */
export const fetchPrediction = async (local, visitante) => {
  try {
    const response = await axios.get(`${API_URL}/predict`, {
      params: { local, visitante },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener la predicción:', error);
    throw new Error(error.response?.data?.error || 'Error al conectar con el backend');
  }
};

/**
 * Llama al backend para obtener partidos con cuotas disponibles.
 * @returns {Promise<object[]>} Lista de partidos disponibles.
 */
export const fetchAvailableMatches = async () => {
  try {
    const response = await axios.get(`${API_URL}/available-matches`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener partidos disponibles:', error);
    throw new Error(error.response?.data?.error || 'Error al conectar con el backend');
  }
};