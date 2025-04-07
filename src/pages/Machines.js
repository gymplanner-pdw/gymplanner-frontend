import { useState, useEffect } from 'react';
import { mockDatabase } from '../services/mockDataBase';
import '../styles/Machines.css';

export default function Machines() {
  const [machines, setMachines] = useState([]);
  const [newMachine, setNewMachine] = useState({
    name: '',
    category: '',
    status: 'Disponível',
    lastMaintenance: new Date().toISOString().split('T')[0]
  });
  const [editingMachine, setEditingMachine] = useState(null);
  const [activeFilter, setActiveFilter] = useState('Todas');
  const isAdmin = localStorage.getItem('userType') === 'admin';

  useEffect(() => {
    setMachines(mockDatabase.machines);
  }, []);

  const handleAddMachine = () => {
    const machineToAdd = {
      ...newMachine,
      id: editingMachine?.id || `m${Date.now()}`
    };
    
    if (editingMachine) {
      const index = mockDatabase.machines.findIndex(m => m.id === editingMachine.id);
      mockDatabase.machines[index] = machineToAdd;
    } else {
      mockDatabase.machines.push(machineToAdd);
    }
    
    setMachines([...mockDatabase.machines]);
    resetForm();
  };

  const handleEditMachine = (machine) => {
    setEditingMachine(machine);
    setNewMachine({
      name: machine.name,
      category: machine.category,
      status: machine.status,
      lastMaintenance: machine.lastMaintenance || new Date().toISOString().split('T')[0]
    });
  };

  const resetForm = () => {
    setNewMachine({
      name: '',
      category: '',
      status: 'Disponível',
      lastMaintenance: new Date().toISOString().split('T')[0]
    });
    setEditingMachine(null);
  };

  const filterMachines = (status) => {
    setActiveFilter(status);
    if (status === 'Todas') {
      setMachines(mockDatabase.machines);
    } else {
      setMachines(mockDatabase.machines.filter(m => m.status === status));
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gerenciamento de Máquinas</h1>
        <h2>{editingMachine ? 'Editar Máquina' : 'Adicionar Máquina'}</h2>
      </div>
      {isAdmin && (
        <div className="form-container">
          <div className="form-group">
            <label>Nome:</label>
            <input
              value={newMachine.name}
              onChange={(e) => setNewMachine({...newMachine, name: e.target.value})}
              placeholder="Nome da máquina"
            />
          </div>
          
          <div className="form-group">
            <label>Categoria:</label>
            <select
              value={newMachine.category}
              onChange={(e) => setNewMachine({...newMachine, category: e.target.value})}
            >
              <option value="">Selecione a Categoria</option>
              <option value="Peito">Peito</option>
              <option value="Pernas">Pernas</option>
              <option value="Costas">Costas</option>
              <option value="Braços">Braços</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Status:</label>
            <select
              value={newMachine.status}
              onChange={(e) => setNewMachine({...newMachine, status: e.target.value})}
            >
              <option value="Disponível">Disponível</option>
              <option value="Manutenção">Manutenção</option>
              <option value="Indisponível">Indisponível</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Última Manutenção:</label>
            <input
              type="date"
              value={newMachine.lastMaintenance}
              onChange={(e) => setNewMachine({...newMachine, lastMaintenance: e.target.value})}
            />
          </div>
          
          <div className="form-actions">
            <button onClick={handleAddMachine} className="save-btn">
              {editingMachine ? 'Atualizar' : 'Adicionar'}
            </button>
            {editingMachine && (
              <button onClick={resetForm} className="cancel-btn">
                Cancelar
              </button>
            )}
          </div>
        </div>
      )}
      
      <div className="machine-list">
        <h2>Máquinas</h2>
        
        <div className="status-filters">
          <button 
            onClick={() => filterMachines('Todas')}
            className={activeFilter === 'Todas' ? 'active' : ''}
          >
            Todas
          </button>
          <button 
            onClick={() => filterMachines('Disponível')}
            className={activeFilter === 'Disponível' ? 'active' : ''}
          >
            Disponíveis
          </button>
          <button 
            onClick={() => filterMachines('Manutenção')}
            className={activeFilter === 'Manutenção' ? 'active' : ''}
          >
            Em Manutenção
          </button>
          <button 
            onClick={() => filterMachines('Indisponível')}
            className={activeFilter === 'Indisponível' ? 'active' : ''}
          >
            Indisponíveis
          </button>
        </div>
        
        {machines.map(machine => (
          <div key={machine.id} className="machine-card">
            <div className="machine-header">
              <h3>{machine.name} <span className={`status-badge ${machine.status.toLowerCase()}`}>{machine.status}</span></h3>
              {isAdmin && (
                <button 
                  onClick={() => handleEditMachine(machine)}
                  className="edit-btn"
                >
                  Editar
                </button>
              )}
            </div>
            <p>Categoria: {machine.category}</p>
            <p>Última manutenção: {
              machine.lastMaintenance && !isNaN(new Date(machine.lastMaintenance))
                ? new Date(machine.lastMaintenance).toLocaleDateString('pt-BR')
                : 'Nunca'
            }</p>
          </div>
        ))}
      </div>
    </div>
  );
}