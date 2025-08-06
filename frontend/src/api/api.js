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
    console.log(`Requesting prediction for local: ${local}, visitante: ${visitante}`);
    const response = await axios.get(`${API_URL}/predict`, {
      params: { local, visitante },
    });
    console.log('Prediction response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Prediction error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });
    throw new Error(error.response?.data?.error || 'Error al conectar con el backend');
  }
};

/**
 * Llama al backend para obtener partidos con cuotas disponibles.
 * @returns {Promise<object[]>} Lista de partidos disponibles.
 */
export const fetchAvailableMatches = async () => {
  try {
    console.log('Requesting available matches');
    const response = await axios.get(`${API_URL}/available-matches`);
    console.log('Available matches response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Available matches error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });
    throw new Error(error.response?.data?.error || 'Error al conectar con el backend');
  }
};