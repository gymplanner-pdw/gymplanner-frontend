import React from 'react';

const ScheduleList = ({ schedules, onEdit, onDelete, showUser }) => {
  return (
    <table className="schedule-table">
      <thead>
        <tr>
          <th>Data</th>
          <th>Hora</th>
          {showUser && <th>Usuário</th>}
          <th>Cliente</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {schedules.map(schedule => (
          <tr key={schedule.id}>
            <td>{formatDate(schedule.date)}</td>
            <td>{schedule.time}</td>
            {showUser && <td>{schedule.userName}</td>}
            <td>{schedule.clientName}</td>
            <td>
              <button onClick={() => onEdit(schedule)}>Editar</button>
              <button onClick={() => onDelete(schedule.id)}>Excluir</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}

export default ScheduleList;