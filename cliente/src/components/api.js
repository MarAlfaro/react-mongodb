import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000', // Reemplaza esto con la URL de tu servidor
});

export default instance;
