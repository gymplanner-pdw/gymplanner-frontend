import axios from 'axios';


const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  timeout: 10000,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

api.interceptors.response.use(response => response, error => {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        localStorage.removeItem('token');
        window.location.href = '/login';
        break;
      case 403:
        return Promise.reject(new Error('Acesso negado: você não tem permissão para esta ação'));
      case 404:
        return Promise.reject(new Error('Recurso não encontrado'));
      default:
        return Promise.reject(error);
    }
  }
  return Promise.reject(error);
});

export const UserAPI = {
  login: (credentials) => api.post('/users/login', credentials),
  register: (userData) => api.post('/users/register', userData),
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
};

export const WorkoutAPI = {
  getAll: () => api.get('/treinos'),
  getById: (id) => api.get(`/treinos/${id}`),
  create: (workoutData) => api.post('/treinos', workoutData),
  update: (id, workoutData) => api.put(`/treinos/${id}`, workoutData),
  delete: (id) => api.delete(`/treinos/${id}`),
  getExercises: (workoutId) => api.get(`/treinos/${workoutId}/exercicios`),
  addExercise: (workoutId, exerciseData) => api.post(`/treinos/${workoutId}/exercicios`, exerciseData),
};

export const ExerciseAPI = {
  getAll: () => api.get('/exercicios'),
  getById: (id) => api.get(`/exercicios/${id}`),
  create: (exerciseData) => api.post('/exercicios', exerciseData),
  update: (id, exerciseData) => api.put(`/exercicios/${id}`, exerciseData),
  delete: (id) => api.delete(`/exercicios/${id}`),
};

export const MachineAPI = {
  getAll: () => api.get('/machines'),
  getById: (id) => api.get(`/machines/${id}`),
  create: (machineData) => api.post('/machines', machineData),
  update: (id, machineData) => api.put(`/machines/${id}`, machineData),
  delete: (id) => api.delete(`/machines/${id}`),
};

export const ScheduleAPI = {
  getAll: () => api.get('/agendamentos'),
  getById: (id) => api.get(`/agendamentos/${id}`),
  create: (scheduleData) => api.post('/agendamentos', scheduleData),
  update: (id, scheduleData) => api.put(`/agendamentos/${id}`, scheduleData),
  delete: (id) => api.delete(`/agendamentos/${id}`),
};

export default api;