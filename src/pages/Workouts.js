import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Workouts.css';
import api from '../services/api';

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [machines, setMachines] = useState([]);
  const [newWorkout, setNewWorkout] = useState({
    nome: '',
    data_inicio: '',
    data_fim: '',
    duracao: 30
  });
  const [newExercise, setNewExercise] = useState({
    id_maquina: '',
    nome: '',
    repeticoes: 12,
    peso: 0
  });
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);
  const [editingWorkoutId, setEditingWorkoutId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [workoutsRes, machinesRes] = await Promise.all([
          api.get('/treinos'),
          api.get('/machines')
        ]);
        
        setWorkouts(workoutsRes.data);
        setMachines(machinesRes.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedWorkoutId) {
      fetchExercisesForWorkout(selectedWorkoutId);
    }
  }, [selectedWorkoutId]);

  const fetchExercisesForWorkout = async (workoutId) => {
    setIsLoading(true);
    try {
      const response = await api.get(`/treinos/${workoutId}/exercicios`);
      setExercises(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWorkout = async () => {
    if (!newWorkout.nome || !newWorkout.data_inicio) {
      alert('Nome e data de início são obrigatórios!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/treinos', newWorkout);
      setWorkouts([...workouts, response.data]);
      setNewWorkout({
        nome: '',
        data_inicio: '',
        data_fim: '',
        duracao: 30
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateWorkout = async () => {
    if (!editingWorkoutId || !newWorkout.nome) {
      alert('Selecione um treino para editar e preencha o nome!');
      return;
    }

    setIsLoading(true);
    try {
      await api.put(`/treinos/${editingWorkoutId}`, newWorkout);
      const updatedWorkouts = workouts.map(w => 
        w.id === editingWorkoutId ? { ...w, ...newWorkout } : w
      );
      setWorkouts(updatedWorkouts);
      setEditingWorkoutId(null);
      setNewWorkout({
        nome: '',
        data_inicio: '',
        data_fim: '',
        duracao: 30
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWorkout = async (workoutId) => {
    if (window.confirm('Tem certeza que deseja excluir este treino?')) {
      setIsLoading(true);
      try {
        await api.delete(`/treinos/${workoutId}`);
        setWorkouts(workouts.filter(w => w.id !== workoutId));
        if (selectedWorkoutId === workoutId) {
          setSelectedWorkoutId(null);
          setExercises([]);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddExercise = async () => {
    if (!selectedWorkoutId || !newExercise.nome || !newExercise.id_maquina) {
      alert('Selecione um treino e preencha os campos do exercício!');
      return;
    }

    setIsLoading(true);
    try {
      await api.post(`/treinos/${selectedWorkoutId}/exercicios`, newExercise);
      await fetchExercisesForWorkout(selectedWorkoutId);
      setNewExercise({
        id_maquina: '',
        nome: '',
        repeticoes: 12,
        peso: 0
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditWorkout = (workout) => {
    setEditingWorkoutId(workout.id);
    setNewWorkout({
      nome: workout.nome,
      data_inicio: workout.data_inicio,
      data_fim: workout.data_fim,
      duracao: workout.duracao
    });
  };

  if (isLoading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">Erro: {error}</div>;

  return (
    <div className="workouts-container">
      <h1>Meus Treinos</h1>

      <div className="workout-form">
        <h2>{editingWorkoutId ? 'Editar' : 'Criar'} Treino</h2>
        
        <div className="form-group">
          <label>Nome do Treino*</label>
          <input
            type="text"
            value={newWorkout.nome}
            onChange={(e) => setNewWorkout({...newWorkout, nome: e.target.value})}
            placeholder="Ex: Treino de Peito"
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Data Início*</label>
            <input
              type="date"
              value={newWorkout.data_inicio}
              onChange={(e) => setNewWorkout({...newWorkout, data_inicio: e.target.value})}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Data Fim</label>
            <input
              type="date"
              value={newWorkout.data_fim}
              onChange={(e) => setNewWorkout({...newWorkout, data_fim: e.target.value})}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Duração (min)</label>
            <input
              type="number"
              value={newWorkout.duracao}
              onChange={(e) => setNewWorkout({...newWorkout, duracao: parseInt(e.target.value) || 0})}
              min="1"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            onClick={editingWorkoutId ? handleUpdateWorkout : handleCreateWorkout}
            className="submit-btn"
            disabled={isLoading}
          >
            {editingWorkoutId ? 'Atualizar' : 'Criar'} Treino
          </button>
          {editingWorkoutId && (
            <button
              onClick={() => {
                setEditingWorkoutId(null);
                setNewWorkout({
                  nome: '',
                  data_inicio: '',
                  data_fim: '',
                  duracao: 30
                });
              }}
              className="cancel-btn"
              disabled={isLoading}
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      <div className="workouts-list">
        <h2>Lista de Treinos ({workouts.length})</h2>
        {workouts.length > 0 ? (
          <div className="workout-cards">
            {workouts.map(workout => (
              <div 
                key={workout.id} 
                className={`workout-card ${selectedWorkoutId === workout.id ? 'selected' : ''}`}
                onClick={() => setSelectedWorkoutId(workout.id)}
              >
                <div className="workout-header">
                  <h3>{workout.nome}</h3>
                  <div className="workout-dates">
                    <span>{new Date(workout.data_inicio).toLocaleDateString('pt-BR')}</span>
                    {workout.data_fim && (
                      <span> - {new Date(workout.data_fim).toLocaleDateString('pt-BR')}</span>
                    )}
                  </div>
                </div>
                <div className="workout-meta">
                  <span>{workout.duracao} minutos</span>
                </div>
                <div className="workout-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditWorkout(workout);
                    }}
                    className="edit-btn"
                    disabled={isLoading}
                  >
                    Editar
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteWorkout(workout.id);
                    }}
                    className="delete-btn"
                    disabled={isLoading}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-workouts">Nenhum treino cadastrado ainda</p>
        )}
      </div>

      {selectedWorkoutId && (
        <div className="exercises-section">
          <h2>Exercícios do Treino</h2>
          
          <div className="exercise-form">
            <h3>Adicionar Exercício</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Nome*</label>
                <input
                  type="text"
                  value={newExercise.nome}
                  onChange={(e) => setNewExercise({...newExercise, nome: e.target.value})}
                  placeholder="Nome do exercício"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label>Máquina*</label>
                <select
                  value={newExercise.id_maquina}
                  onChange={(e) => setNewExercise({...newExercise, id_maquina: e.target.value})}
                  required
                  disabled={isLoading}
                >
                  <option value="">Selecione uma máquina</option>
                  {machines.map(machine => (
                    <option key={machine.id} value={machine.id}>
                      {machine.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Repetições</label>
                <input
                  type="number"
                  value={newExercise.repeticoes}
                  onChange={(e) => setNewExercise({...newExercise, repeticoes: parseInt(e.target.value) || 0})}
                  min="1"
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label>Peso (kg)</label>
                <input
                  type="number"
                  value={newExercise.peso}
                  onChange={(e) => setNewExercise({...newExercise, peso: parseFloat(e.target.value) || 0})}
                  min="0"
                  step="0.5"
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              onClick={handleAddExercise}
              className="submit-btn"
              disabled={isLoading}
            >
              Adicionar Exercício
            </button>
          </div>

          <div className="exercises-list">
            <h3>Exercícios ({exercises.length})</h3>
            {exercises.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Máquina</th>
                    <th>Repetições</th>
                    <th>Peso</th>
                  </tr>
                </thead>
                <tbody>
                  {exercises.map(exercise => (
                    <tr key={exercise.id}>
                      <td>{exercise.nome}</td>
                      <td>
                        {machines.find(m => m.id === exercise.id_maquina)?.nome || 'N/A'}
                      </td>
                      <td>{exercise.repeticoes}</td>
                      <td>{exercise.peso} kg</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-exercises">Nenhum exercício neste treino</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}