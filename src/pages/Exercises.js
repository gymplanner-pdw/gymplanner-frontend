import { useState } from 'react';
import ExerciseList from '../components/ExerciseList';

export default function Exercises() {
  const [exercises, setExercises] = useState([
    { id: 1, name: 'Supino Reto', muscleGroup: 'Peito', equipment: 'Barra' },
    { id: 2, name: 'Agachamento Livre', muscleGroup: 'Pernas', equipment: 'Barra' }
  ]);
  const [newExercise, setNewExercise] = useState({ name: '', muscleGroup: '', equipment: '' });
  const [editingId, setEditingId] = useState(null);

  const handleAddExercise = () => {
    if (editingId) {
      setExercises(exercises.map(ex => 
        ex.id === editingId ? { ...newExercise, id: editingId } : ex
      ));
      setEditingId(null);
    } else {
      setExercises([...exercises, { ...newExercise, id: Date.now() }]);
    }
    setNewExercise({ name: '', muscleGroup: '', equipment: '' });
  };

  const handleEdit = (exercise) => {
    setNewExercise(exercise);
    setEditingId(exercise.id);
  };

  const handleDelete = (id) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  return (
    <div className="page-container">
      <h1>Gerenciar Exercícios</h1>
      
      <div className="form-container">
        <input
          type="text"
          placeholder="Nome do exercício"
          value={newExercise.name}
          onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}
        />
        <input
          type="text"
          placeholder="Grupo muscular"
          value={newExercise.muscleGroup}
          onChange={(e) => setNewExercise({...newExercise, muscleGroup: e.target.value})}
        />
        <input
          type="text"
          placeholder="Equipamento"
          value={newExercise.equipment}
          onChange={(e) => setNewExercise({...newExercise, equipment: e.target.value})}
        />
        <button onClick={handleAddExercise}>
          {editingId ? 'Atualizar' : 'Adicionar'} Exercício
        </button>
      </div>

      <ExerciseList 
        exercises={exercises} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />
    </div>
  );
}