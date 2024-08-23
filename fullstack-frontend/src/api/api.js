import axios from 'axios';

const API_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = async (
  firstName,
  lastName,
  username,
  email,
  password
) => {
  try {
    const res = await api.post('/register', {
      firstName,
      lastName,
      username,
      email,
      password,
      role: 'ADMIN',
    });
    return res;
  } catch (error) {
    throw error;
  }
};
