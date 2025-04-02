// Mock API functions - replace with real API calls
export const fetchAllUsers = async () => {
    // In a real app, this would be: return fetch('/api/users').then(res => res.json());
    return [
      { id: '001', name: 'Admin', email: 'admin@academia.com', type: 'admin' },
      { id: '002', name: 'Usuário Padrão', email: 'user@academia.com', type: 'user' }
    ];
  };
  
  export const fetchExercises = async (userId = null) => {
    // Mock data - replace with actual API call
    const mockExercises = [
      { id: 1, name: 'Supino Reto', muscleGroup: 'Peito', equipment: 'Barra', userId: '001' },
      { id: 2, name: 'Agachamento Livre', muscleGroup: 'Pernas', equipment: 'Barra', userId: '002' }
    ];
    
    if (userId) {
      return mockExercises.filter(ex => ex.userId === userId);
    }
    return mockExercises;
  };
  
  export const fetchSchedules = async (userId = null) => {
    // Mock data - replace with actual API call
    const mockSchedules = [
      { id: 1, date: '2023-06-01', time: '09:00', activity: 'Musculação', client: 'João', userId: '001' },
      { id: 2, date: '2023-06-02', time: '14:00', activity: 'Aeróbico', client: 'Maria', userId: '002' }
    ];
    
    if (userId) {
      return mockSchedules.filter(sched => sched.userId === userId);
    }
    return mockSchedules;
  };