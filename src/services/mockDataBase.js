export const mockDatabase = {
    users: [
      {
        id: '001',
        name: 'Admin',
        email: 'admin@gym.com',
        type: 'admin',
        password: '123'
      },
      {
        id: '002',
        name: 'João Silva',
        email: 'joao@gym.com',
        type: 'user',
        password: '123'
      }
    ],
    
    machines: [
      { id: 'm1', name: 'Supino Máquina', category: 'Peito', status: 'Disponível' },
      { id: 'm2', name: 'Leg Press', category: 'Pernas', status: 'Disponível' }
    ],
    
    workouts: [
      {
        id: 'w1',
        userId: '002',
        name: 'Treino de Peito',
        exercises: [
          {
            id: 'e1',
            name: 'Supino Reto',
            machineId: 'm1',
            sets: 3,
            reps: 12,
            restInterval: 60
          }
        ]
      }
    ],
    
    schedules: [
        {
            id: 's1',
            userId: '002',
            userName: 'João Silva', 
            machineId: 'm1',
            workoutId: 'w1',
            date: '2023-06-15',
            time: '09:00',
            duration: 30
          },
    ],
  
    getUserWorkouts(userId) {
        return this.workouts.filter(workout => workout.userId === userId);
      },
      
    getMachineSchedules(machineId) {
      return this.schedules.filter(schedule => schedule.machineId === machineId);
    },
    
    getUserSchedules(userId) {
      return this.schedules.filter(schedule => schedule.userId === userId);
    },

    getUserWorkoutsCount(userId) {
        return this.workouts.filter(workout => workout.userId === userId).length;
      },
  
    getUserSchedulesCount(userId) {
      return this.schedules.filter(schedule => schedule.userId === userId).length;
    },

    
    getUserWorkouts(userId) {
      return this.workouts.filter(workout => workout.userId === userId);
    },
    
    getMachineSchedules(machineId) {
      return this.schedules.filter(schedule => schedule.machineId === machineId);
    },
    
    getUserSchedules(userId) {
      return this.schedules.filter(schedule => schedule.userId === userId);
    },
    
    getFullScheduleInfo() {
        return this.schedules.map(schedule => ({
          id: schedule.id,
          date: schedule.date,
          time: schedule.time,
          client: schedule.userName 
        }));
      }
  };
  
  export const saveSchedule = (newSchedule) => {
    mockDatabase.schedules.push({
      ...newSchedule,
      id: `s${Date.now()}`
    });
    return newSchedule;
  };
  
  export const saveWorkout = (newWorkout) => {
    mockDatabase.workouts.push({
      ...newWorkout,
      id: `w${Date.now()}`
    });
    return newWorkout;
  };

