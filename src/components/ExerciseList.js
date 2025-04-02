export default function ExerciseList({ exercises, onEdit, onDelete }) {
    return (
      <div className="list-container">
        <h2>Lista de Exercícios</h2>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Grupo Muscular</th>
              <th>Equipamento</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {exercises.map(exercise => (
              <tr key={exercise.id}>
                <td>{exercise.name}</td>
                <td>{exercise.muscleGroup}</td>
                <td>{exercise.equipment}</td>
                <td>
                  <button onClick={() => onEdit(exercise)}>Editar</button>
                  <button onClick={() => onDelete(exercise.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }