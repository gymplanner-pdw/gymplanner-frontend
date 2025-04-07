import { useState, useEffect } from 'react';
import { mockDatabase } from '../services/mockDataBase';
import '../styles/Workouts.css';

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [machines, setMachines] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newWorkout, setNewWorkout] = useState({ name: '', exercises: [] });
  const [editingWorkoutId, setEditingWorkoutId] = useState(null);
  const currentUserId = localStorage.getItem('userId');
  const isAdmin = localStorage.getItem('userType') === 'admin';

  useEffect(() => {
    setMachines(mockDatabase.machines);
    loadWorkouts();
  }, [selectedUserId]);

  const loadWorkouts = () => {
    const userIdToLoad = isAdmin && selectedUserId ? selectedUserId : currentUserId;
    setWorkouts(mockDatabase.getUserWorkouts(userIdToLoad));
  };

  const handleAddExercise = (workoutId) => {
    const updatedWorkouts = workouts.map(workout => {
      if (workout.id === workoutId) {
        return {
          ...workout,
          exercises: [
            ...workout.exercises,
            {
              id: `e${Date.now()}`,
              name: '',
              machineId: '',
              sets: 3,
              reps: 12,
              restInterval: 60
            }
          ]
        };
      }
      return workout;
    });
    setWorkouts(updatedWorkouts);


    if (editingWorkoutId === workoutId) {
      const workoutBeingEdited = updatedWorkouts.find(w => w.id === workoutId);
      setNewWorkout(workoutBeingEdited);
    }
  };

  const handleRemoveExercise = (workoutId, exerciseId) => {
    const updatedWorkouts = workouts.map(workout => {
      if (workout.id === workoutId) {
        return {
          ...workout,
          exercises: workout.exercises.filter(ex => ex.id !== exerciseId)
        };
      }
      return workout;
    });
    setWorkouts(updatedWorkouts);
    

    if (editingWorkoutId === workoutId) {
      const workoutBeingEdited = updatedWorkouts.find(w => w.id === workoutId);
      setNewWorkout(workoutBeingEdited);
    }
  };

  const handleSaveWorkout = () => {
    if (!newWorkout.name) {
      alert('Nome do treino é obrigatório');
      return;
    }


    if (editingWorkoutId) {
      const currentWorkout = workouts.find(w => w.id === editingWorkoutId);
      if (currentWorkout) {
        setNewWorkout(currentWorkout);
      }
    }

    const workoutToSave = {
      ...newWorkout,
      id: newWorkout.id || `w${Date.now()}`,
      userId: isAdmin && selectedUserId ? selectedUserId : currentUserId
    };

    const index = mockDatabase.workouts.findIndex(w => w.id === workoutToSave.id);
    if (index !== -1) {
      mockDatabase.workouts[index] = workoutToSave;
    } else {
      mockDatabase.workouts.push(workoutToSave);
    }

    loadWorkouts();
    setNewWorkout({ name: '', exercises: [] });
    setEditingWorkoutId(null);
  };

// Adicione esta função no seu componente Workouts
const handleDeleteWorkout = (workoutId) => {
  if (window.confirm('Tem certeza que deseja excluir este treino?')) {
    // Chame a função do mockDatabase
    mockDatabase.workouts = mockDatabase.workouts.filter(w => w.id !== workoutId);
    
    // Atualize o estado local
    setWorkouts(prev => prev.filter(w => w.id !== workoutId));
    
    // Se estiver editando o workout que está sendo deletado, limpe o formulário
    if (editingWorkoutId === workoutId) {
      setNewWorkout({ name: '', exercises: [] });
      setEditingWorkoutId(null);
    }
  }
};

  const handleEditWorkout = (workout) => {
    setNewWorkout(workout);
    setEditingWorkoutId(workout.id);
  };

  const handleCancelEdit = () => {
    setNewWorkout({ name: '', exercises: [] });
    setEditingWorkoutId(null);
    loadWorkouts();
  };

  const handleExerciseChange = (workoutId, exerciseId, field, value) => {
    const updatedWorkouts = workouts.map(workout => {
      if (workout.id === workoutId) {
        return {
          ...workout,
          exercises: workout.exercises.map(ex => 
            ex.id === exerciseId ? { ...ex, [field]: value } : ex
          )
        };
      }
      return workout;
    });
    setWorkouts(updatedWorkouts);
    

    if (editingWorkoutId === workoutId) {
      const workoutBeingEdited = updatedWorkouts.find(w => w.id === workoutId);
      setNewWorkout(workoutBeingEdited);
    }
  };

  return (
    <div className="workouts-page">
      <h1>{isAdmin ? 'Gerenciamento de Treinos' : 'Meus Treinos'}</h1>
      
      {isAdmin && (
        <div className="user-selection">
          <h2>Visualizar Treinos de:</h2>
          <select
            value={selectedUserId || ''}
            onChange={(e) => setSelectedUserId(e.target.value || null)}
          >
            <option value="">Selecione um usuário</option>
            {mockDatabase.users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.type === 'admin' ? 'Admin' : 'Usuário'})
              </option>
            ))}
          </select>
        </div>
      )}
      

      <div className="workout-form-container">
        <h2>{editingWorkoutId ? 'Editar Treino' : 'Criar Novo Treino'}</h2>
        <input
          type="text"
          value={newWorkout.name}
          onChange={(e) => setNewWorkout({...newWorkout, name: e.target.value})}
          placeholder="Nome do treino (ex: Peito e Tríceps)"
        />
        
        <div className="form-actions">
          <button onClick={handleSaveWorkout} className="save-btn">
            {editingWorkoutId ? 'Atualizar Treino' : 'Salvar Treino'}
          </button>
          {editingWorkoutId && (
            <button onClick={handleCancelEdit} className="cancel-btn">
              Cancelar
            </button>
          )}
        </div>
      </div>
      

      <div className="workouts-list">
        {workouts.length > 0 ? (
          workouts.map(workout => (
            <div key={workout.id} className={`workout-card ${editingWorkoutId === workout.id ? 'editing' : ''}`}>
              <div className="workout-header">
                <h3>{workout.name}</h3>
                
                <div className="workout-actions">
                  {editingWorkoutId !== workout.id && (
                    <>
                      <button 
                        onClick={() => handleEditWorkout(workout)}
                        className="edit-btn"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteWorkout(workout.id)}
                        className="delete-btn"
                      >
                        Excluir
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="exercises-list">
                {workout.exercises.map(exercise => (
                  <div key={exercise.id} className="exercise-item">
                    {editingWorkoutId === workout.id ? (
                      <>
                        <input
                          type="text"
                          value={exercise.name}
                          onChange={(e) => handleExerciseChange(
                            workout.id,
                            exercise.id,
                            'name',
                            e.target.value
                          )}
                          placeholder="Nome do exercício"
                        />
                        
                        <select
                          value={exercise.machineId}
                          onChange={(e) => handleExerciseChange(
                            workout.id,
                            exercise.id,
                            'machineId',
                            e.target.value
                          )}
                        >
                          <option value="">Selecione a máquina</option>
                          {machines.map(machine => (
                            <option key={machine.id} value={machine.id}>
                              {machine.name}
                            </option>
                          ))}
                        </select>
                        
                        <div className="exercise-details">
                          <label>Séries:</label>
                          <input
                            type="number"
                            value={exercise.sets}
                            min="1"
                            max="10"
                            onChange={(e) => handleExerciseChange(
                              workout.id,
                              exercise.id,
                              'sets',
                              parseInt(e.target.value)
                            )}
                          />
                          
                          <label>Repetições:</label>
                          <input
                            type="number"
                            value={exercise.reps}
                            min="1"
                            max="20"
                            onChange={(e) => handleExerciseChange(
                              workout.id,
                              exercise.id,
                              'reps',
                              parseInt(e.target.value)
                            )}
                          />
                          
                          <button
                            onClick={() => handleRemoveExercise(workout.id, exercise.id)}
                            className="remove-btn"
                          >
                            Remover
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p><strong>{exercise.name || 'Exercício sem nome'}</strong></p>
                        <p>Máquina: {machines.find(m => m.id === exercise.machineId)?.name || 'Não selecionada'}</p>
                        <p>Séries: {exercise.sets} | Repetições: {exercise.reps}</p>
                      </>
                    )}
                  </div>
                ))}
                
                {editingWorkoutId === workout.id && (
                  <button 
                    onClick={() => handleAddExercise(workout.id)}
                    className="add-exercise-btn"
                  >
                    + Adicionar Exercício
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="no-workouts">
            {isAdmin
              ? selectedUserId
                ? 'Nenhum treino encontrado para este usuário'
                : 'Selecione um usuário para visualizar os treinos'
              : 'Você ainda não possui treinos cadastrados'}
          </p>
        )}
      </div>
    </div>
  );
}