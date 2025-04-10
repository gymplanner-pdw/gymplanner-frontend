import { useState, useEffect } from 'react';
import '../styles/Machines.css';
import api from '../services/api';

export default function Machines() {
  const [machines, setMachines] = useState([]);
  const [newMachine, setNewMachine] = useState({
    nome: '',
    grupo_muscular: '',
    status: 'disponivel',
    ultima_manutencao: new Date().toISOString().split('T')[0]
  });
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('todas');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentUserType = localStorage.getItem('userType');
  const isAdmin = currentUserType === 'admin';

  useEffect(() => {
    const fetchMachines = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/machines');
        setMachines(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMachines();
  }, []);

  const filteredMachines = machines.filter(machine => 
    filter === 'todas' || machine.status === filter
  );

  const handleCreateOrUpdateMachine = async () => {
    if (!newMachine.nome || !newMachine.grupo_muscular) {
      alert('Nome e grupo muscular são obrigatórios!');
      return;
    }

    setIsLoading(true);
    try {
      if (editingId) {
        await api.put(`/machines/${editingId}`, newMachine);
      } else {
        await api.post('/machines', newMachine);
      }

      const response = await api.get('/machines');
      setMachines(response.data);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      alert(err.response?.data?.message || 'Erro ao salvar máquina');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMachine = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta máquina?')) {
      setIsLoading(true);
      try {
        await api.delete(`/machines/${id}`);
        setMachines(machines.filter(m => m.id !== id));
      } catch (err) {
        const errorMsg = err.response?.data?.message || 
          (err.response?.status === 409 
            ? 'Não é possível excluir máquinas com agendamentos futuros' 
            : 'Erro ao excluir máquina');
        
        setError(errorMsg);
        alert(errorMsg);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEditMachine = (machine) => {
    setNewMachine({
      nome: machine.nome,
      grupo_muscular: machine.grupo_muscular,
      status: machine.status,
      ultima_manutencao: machine.ultima_manutencao || new Date().toISOString().split('T')[0]
    });
    setEditingId(machine.id);
  };

  const resetForm = () => {
    setNewMachine({
      nome: '',
      grupo_muscular: '',
      status: 'disponivel',
      ultima_manutencao: new Date().toISOString().split('T')[0]
    });
    setEditingId(null);
  };

  const muscleGroups = [
    'Peito', 'Costas', 'Ombro', 'Braço', 'Perna', 'Abdômen', 'Cardio'
  ];

  if (isLoading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">Erro: {error}</div>;

  return (
    <div className="machines-container">
      <h1>Gerenciamento de Máquinas</h1>

      {isAdmin && (
        <div className="machine-form">
          <h2>{editingId ? 'Editar' : 'Adicionar'} Máquina</h2>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Nome*</label>
              <input
                type="text"
                placeholder="Nome da máquina"
                value={newMachine.nome}
                onChange={(e) => setNewMachine({...newMachine, nome: e.target.value})}
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>Grupo Muscular*</label>
              <select
                value={newMachine.grupo_muscular}
                onChange={(e) => setNewMachine({...newMachine, grupo_muscular: e.target.value})}
                required
                disabled={isLoading}
              >
                <option value="">Selecione o grupo</option>
                {muscleGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Status*</label>
              <select
                value={newMachine.status}
                onChange={(e) => setNewMachine({...newMachine, status: e.target.value})}
                required
                disabled={isLoading}
              >
                <option value="disponivel">Disponível</option>
                <option value="indisponivel">Indisponível</option>
                <option value="em manutencao">Em Manutenção</option>
              </select>
            </div>

            <div className="form-group">
              <label>Última Manutenção</label>
              <input
                type="date"
                value={newMachine.ultima_manutencao}
                onChange={(e) => setNewMachine({...newMachine, ultima_manutencao: e.target.value})}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              onClick={handleCreateOrUpdateMachine}
              className="submit-btn"
              disabled={isLoading}
            >
              {editingId ? 'Atualizar' : 'Adicionar'} Máquina
            </button>

            {editingId && (
              <button
                onClick={resetForm}
                className="cancel-btn"
                disabled={isLoading}
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      )}

      <div className="machine-list">
        <div className="filter-controls">
          <h2>Lista de Máquinas ({filteredMachines.length})</h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            disabled={isLoading}
          >
            <option value="todas">Todas</option>
            <option value="disponivel">Disponíveis</option>
            <option value="indisponivel">Indisponíveis</option>
            <option value="em manutencao">Em Manutenção</option>
          </select>
        </div>

        {filteredMachines.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Grupo Muscular</th>
                <th>Status</th>
                <th>Última Manutenção</th>
                {isAdmin && <th>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {filteredMachines.map(machine => (
                <tr key={machine.id}>
                  <td>{machine.nome}</td>
                  <td>{machine.grupo_muscular}</td>
                  <td className={`status ${machine.status.replace(' ', '-')}`}>
                    {machine.status === 'disponivel' && 'Disponível'}
                    {machine.status === 'indisponivel' && 'Indisponível'}
                    {machine.status === 'em manutencao' && 'Em Manutenção'}
                  </td>
                  <td>
                    {machine.ultima_manutencao 
                      ? new Date(machine.ultima_manutencao).toLocaleDateString('pt-BR')
                      : 'Nunca'}
                  </td>
                  {isAdmin && (
                    <td className="actions">
                      <button
                        onClick={() => handleEditMachine(machine)}
                        className="edit-btn"
                        disabled={isLoading}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteMachine(machine.id)}
                        className="delete-btn"
                        disabled={isLoading}
                      >
                        Excluir
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-machines">Nenhuma máquina encontrada</p>
        )}
      </div>
    </div>
  );
}