import { useState, useEffect } from 'react';

export default function Machines() {
  const [machines, setMachines] = useState([]);
  const [newMachine, setNewMachine] = useState({ 
    name: '', 
    category: '',
    status: 'Disponível',
    lastMaintenance: new Date().toISOString().split('T')[0]
  });
  const [editingId, setEditingId] = useState(null);

  // Mock data - substitua por API real
  useEffect(() => {
    const mockMachines = [
      { id: 1, name: 'Leg Press', category: 'Pernas', status: 'Disponível', lastMaintenance: '2023-05-01' },
      { id: 2, name: 'Supino Máquina', category: 'Peito', status: 'Em manutenção', lastMaintenance: '2023-04-15' }
    ];
    setMachines(mockMachines);
  }, []);

  const handleAddMachine = () => {
    if (!newMachine.name || !newMachine.category) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    if (editingId) {
      setMachines(machines.map(machine => 
        machine.id === editingId ? { ...newMachine, id: editingId } : machine
      ));
    } else {
      setMachines([...machines, { ...newMachine, id: Date.now() }]);
    }

    setNewMachine({ 
      name: '', 
      category: '',
      status: 'Disponível',
      lastMaintenance: new Date().toISOString().split('T')[0]
    });
    setEditingId(null);
  };

  const handleEdit = (machine) => {
    setNewMachine(machine);
    setEditingId(machine.id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta máquina?')) {
      setMachines(machines.filter(machine => machine.id !== id));
    }
  };

  return (
    <div className="page-container">
      <h1>Gerenciamento de Máquinas</h1>
      
      <div className="form-container">
        <h2>{editingId ? 'Editar' : 'Adicionar'} Máquina</h2>
        
        <div className="form-grid">
          <div className="form-group">
            <label>Nome*</label>
            <input
              type="text"
              placeholder="Nome da máquina"
              value={newMachine.name}
              onChange={(e) => setNewMachine({...newMachine, name: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Categoria*</label>
            <select
              value={newMachine.category}
              onChange={(e) => setNewMachine({...newMachine, category: e.target.value})}
              required
            >
              <option value="">Selecione...</option>
              <option value="Pernas">Pernas</option>
              <option value="Peito">Peito</option>
              <option value="Costas">Costas</option>
              <option value="Braços">Braços</option>
              <option value="Abdômen">Abdômen</option>
              <option value="Cardio">Cardio</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={newMachine.status}
              onChange={(e) => setNewMachine({...newMachine, status: e.target.value})}
            >
              <option value="Disponível">Disponível</option>
              <option value="Em manutenção">Em manutenção</option>
              <option value="Desativada">Desativada</option>
            </select>
          </div>

          <div className="form-group">
            <label>Última Manutenção</label>
            <input
              type="date"
              value={newMachine.lastMaintenance}
              onChange={(e) => setNewMachine({...newMachine, lastMaintenance: e.target.value})}
            />
          </div>
        </div>

        <button onClick={handleAddMachine} className="submit-btn">
          {editingId ? 'Atualizar' : 'Adicionar'} Máquina
        </button>

        {editingId && (
          <button
            onClick={() => {
              setEditingId(null);
              setNewMachine({ 
                name: '', 
                category: '',
                status: 'Disponível',
                lastMaintenance: new Date().toISOString().split('T')[0]
              });
            }}
            className="cancel-btn"
          >
            Cancelar
          </button>
        )}
      </div>

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
                    onClick={() => handleEdit(machine)}
                    className="edit-btn"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(machine.id)}
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
    </div>
  );
}