import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const register = async (username, password) => {
  return await axios.post(`${API_URL}/register`, { username, password });
};

export const login = async (username, password) => {
  return await axios.post(`${API_URL}/login`, { username, password });
};

export const getMessages = async (token) => {
  return await axios.get(`${API_URL}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const searchMessages = async (token, query) => {
  return await axios.get(`${API_URL}/search`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { query },
  });
};
