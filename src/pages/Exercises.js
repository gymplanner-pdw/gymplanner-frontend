import { useState, useEffect } from 'react';
import ExerciseList from '../components/ExerciseList';
import { fetchAllUsers } from '../services/api'; // You'll need to implement this API call

export default function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [newExercise, setNewExercise] = useState({ 
    name: '', 
    muscleGroup: '', 
    equipment: '',
    userId: localStorage.getItem('userId') || '001'
  });
  const [editingId, setEditingId] = useState(null);
  const isAdmin = localStorage.getItem('userType') === 'admin';

  useEffect(() => {
    // Mock users data
    if (isAdmin) {
      setUsers([
        { id: '001', name: 'Admin', type: 'admin' },
        { id: '002', name: 'Usuário Padrão', type: 'user' }
      ]);
    }
    
    loadExercises();
  }, [selectedUserId]);

  const loadExercises = () => {
    // Replace with your actual API call
    const mockExercises = [
      { id: 1, name: 'Supino Reto', muscleGroup: 'Peito', equipment: 'Barra', userId: '001' },
      { id: 2, name: 'Agachamento Livre', muscleGroup: 'Pernas', equipment: 'Barra', userId: '002' }
    ];
    
    let filtered = mockExercises;
    if (!isAdmin) {
      filtered = mockExercises.filter(ex => ex.userId === localStorage.getItem('userId'));
    } else if (selectedUserId) {
      filtered = mockExercises.filter(ex => ex.userId === selectedUserId);
    }
    
    setExercises(filtered);
  };

  const handleAddExercise = () => {
    if (!newExercise.name || !newExercise.muscleGroup) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    const exerciseData = {
      ...newExercise,
      userId: isAdmin && selectedUserId ? selectedUserId : localStorage.getItem('userId')
    };

    if (editingId) {
      setExercises(exercises.map(ex => 
        ex.id === editingId ? { ...exerciseData, id: editingId } : ex
      ));
      setEditingId(null);
    } else {
      setExercises([...exercises, { ...exerciseData, id: Date.now() }]);
    }
    
    setNewExercise({ name: '', muscleGroup: '', equipment: '', userId: '' });
  };

  const handleEdit = (exercise) => {
    setNewExercise(exercise);
    setEditingId(exercise.id);
    if (isAdmin) setSelectedUserId(exercise.userId);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este exercício?')) {
      setExercises(exercises.filter(ex => ex.id !== id));
    }
  };

  return (
    <div className="page-container">
      <h1>Gerenciamento de Exercícios</h1>
      
      {isAdmin && (
        <div className="user-filter">
          <label>Filtrar por usuário:</label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            <option value="">Todos os usuários</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.type === 'admin' ? 'Admin' : 'Usuário'})
              </option>
            ))}
          </select>
        </div>
      )}
      
      <div className="form-container">
        <h2>{editingId ? 'Editar' : 'Adicionar'} Exercício</h2>
        
        <div className="form-grid">
          <div className="form-group">
            <label>Nome*</label>
            <input
              type="text"
              placeholder="Nome do exercício"
              value={newExercise.name}
              onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Grupo Muscular*</label>
            <select
              value={newExercise.muscleGroup}
              onChange={(e) => setNewExercise({...newExercise, muscleGroup: e.target.value})}
              required
            >
              <option value="">Selecione...</option>
              <option value="Peito">Peito</option>
              <option value="Costas">Costas</option>
              <option value="Pernas">Pernas</option>
              <option value="Braços">Braços</option>
              <option value="Abdômen">Abdômen</option>
            </select>
          </div>

          <div className="form-group">
            <label>Equipamento</label>
            <input
              type="text"
              placeholder="Equipamento necessário"
              value={newExercise.equipment}
              onChange={(e) => setNewExercise({...newExercise, equipment: e.target.value})}
            />
          </div>
        </div>

        <button onClick={handleAddExercise} className="submit-btn">
          {editingId ? 'Atualizar' : 'Adicionar'} Exercício
        </button>

        {editingId && (
          <button
            onClick={() => {
              setEditingId(null);
              setNewExercise({ name: '', muscleGroup: '', equipment: '', userId: '' });
              if (isAdmin) setSelectedUserId('');
            }}
            className="cancel-btn"
          >
            Cancelar
          </button>
        )}
      </div>

      <ExerciseList 
        exercises={exercises} 
        onEdit={handleEdit} 
        onDelete={handleDelete}
        showUser={isAdmin && !selectedUserId}
        users={users}
      />
    </div>
  );
}