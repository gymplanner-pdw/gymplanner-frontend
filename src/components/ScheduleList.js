export default function ScheduleList({ schedules, onEdit, onDelete }) {
    return (
      <div className="list-container">
        <h2>Lista de Agendamentos</h2>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Hora</th>
              <th>Atividade</th>
              <th>Cliente</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map(schedule => (
              <tr key={schedule.id}>
                <td>{new Date(schedule.date).toLocaleDateString('pt-BR')}</td>
                <td>{schedule.time}</td>
                <td>{schedule.activity}</td>
                <td>{schedule.client}</td>
                <td>
                  <button 
                    onClick={() => onEdit(schedule)}
                    className="edit-btn"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => onDelete(schedule.id)}
                    className="delete-btn"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }