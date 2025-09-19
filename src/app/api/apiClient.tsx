import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_HOST,
  timeout: 1000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export default instance;
