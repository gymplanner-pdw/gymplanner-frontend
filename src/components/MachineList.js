export default function MachineList({ machines, onEdit, onDelete }) {
    return (
      <div className="list-container">
        <h2>Lista de Máquinas</h2>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Status</th>
              <th>Última Manutenção</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {machines.map(machine => (
              <tr key={machine.id}>
                <td>{machine.name}</td>
                <td>{machine.category}</td>
                <td>
                  <span className={`status-badge ${machine.status.replace(/\s/g, '-').toLowerCase()}`}>
                    {machine.status}
                  </span>
                </td>
                <td>{new Date(machine.lastMaintenance).toLocaleDateString('pt-BR')}</td>
                <td>
                  <button 
                    onClick={() => onEdit(machine)}
                    className="edit-btn"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => onDelete(machine.id)}
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