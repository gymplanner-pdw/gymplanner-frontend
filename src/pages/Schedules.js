import { useState, useEffect } from 'react';
import { mockDatabase } from '../services/mockDataBase';
import '../styles/Schedules.css';

export default function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [users, setUsers] = useState([]);
  const [machines, setMachines] = useState([]);
  const [newSchedule, setNewSchedule] = useState({ 
    date: '', 
    time: '',
    userId: localStorage.getItem('userId'),
    machineId: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userFilter, setUserFilter] = useState('all');
  
  const userType = localStorage.getItem('userType');
  const isAdmin = userType === 'admin';
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        const allUsers = mockDatabase.users;
        const allMachines = mockDatabase.machines || [];
        setUsers(allUsers);
        setMachines(allMachines);
        
        const allSchedules = mockDatabase.schedules.map(schedule => {
          const user = allUsers.find(u => u.id === schedule.userId);
          const machine = allMachines.find(m => m.id === schedule.machineId);
          
          return {
            ...schedule,
            userName: user?.name || 'Não encontrado',
            machineName: machine?.name || 'Máquina não encontrada',
            machineStatus: machine?.status || 'Indisponível',
            formattedDate: formatDate(schedule.date)
          };
        });

        let filteredSchedules = isAdmin 
          ? allSchedules 
          : allSchedules.filter(s => s.userId === currentUserId);

        if (isAdmin && userFilter !== 'all') {
          filteredSchedules = filteredSchedules.filter(s => s.userId === userFilter);
        }

        setSchedules(filteredSchedules);
        setIsLoading(false);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Falha ao carregar agendamentos');
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentUserId, isAdmin, userFilter]);

  const availableMachines = machines.filter(machine => 
    machine.status === 'Disponível' || machine.status === 'available'
  );

  const handleAddSchedule = () => {
    if (!newSchedule.date || !newSchedule.time || (!isAdmin && !newSchedule.userId) || !newSchedule.machineId) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    try {
      const user = users.find(u => u.id === newSchedule.userId);
      const machine = machines.find(m => m.id === newSchedule.machineId);
      
      const scheduleData = {
        ...newSchedule,
        id: editingId || `s${Date.now()}`,
        userName: user?.name || 'Não encontrado',
        machineName: machine?.name || 'Máquina não encontrada',
        machineStatus: machine?.status || 'Indisponível',
        formattedDate: formatDate(newSchedule.date)
      };

      const index = mockDatabase.schedules.findIndex(s => s.id === editingId);
      if (index !== -1) {
        mockDatabase.schedules[index] = scheduleData;
      } else {
        mockDatabase.schedules.push(scheduleData);
      }

      setSchedules(prev => {
        if (editingId) {
          return prev.map(s => s.id === editingId ? scheduleData : s);
        }
        return [...prev, scheduleData];
      });

      setNewSchedule({ 
        date: '', 
        time: '',
        userId: currentUserId,
        machineId: ''
      });
      setEditingId(null);
    } catch (err) {
      console.error('Erro ao salvar agendamento:', err);
      alert('Erro ao salvar agendamento');
    }
  };

  const handleEdit = (schedule) => {
    setNewSchedule({
      date: schedule.date,
      time: schedule.time,
      userId: schedule.userId,
      machineId: schedule.machineId
    });
    setEditingId(schedule.id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      mockDatabase.schedules = mockDatabase.schedules.filter(s => s.id !== id);
      setSchedules(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewSchedule({ 
      date: '', 
      time: '',
      userId: currentUserId,
      machineId: ''
    });
  };

  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }

  if (isLoading) {
    return (
      <div className="page-container">
        <h1>Agendamentos</h1>
        <p>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <h1>Agendamentos</h1>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>Agendamentos</h1>

      {isAdmin && (
        <div className="filter-container" style={{ marginBottom: '20px' }}>
          <label>Filtrar por usuário: </label>
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="form-input"
          >
            <option value="all">Todos os usuários</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.type})
              </option>
            ))}
          </select>
        </div>
      )}
      
      <div className="form-container">
        <h2>{editingId ? 'Editar' : 'Adicionar'} Agendamento</h2>
        
        <div className="form-grid">
          <div className="form-group">
            <label>Data</label>
            <input
              type="date"
              value={newSchedule.date}
              onChange={(e) => setNewSchedule({...newSchedule, date: e.target.value})}
              min={new Date().toISOString().split('T')[0]}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Hora</label>
            <input
              type="time"
              value={newSchedule.time}
              onChange={(e) => setNewSchedule({...newSchedule, time: e.target.value})}
              required
              className="form-input"
            />
          </div>

          {isAdmin && (
            <div className="form-group">
              <label>Usuário</label>
              <select
                value={newSchedule.userId}
                onChange={(e) => setNewSchedule({...newSchedule, userId: e.target.value})}
                required
                className="form-input"
              >
                <option value="">Selecione um usuário...</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.type})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Máquina</label>
            <select
              value={newSchedule.machineId}
              onChange={(e) => setNewSchedule({...newSchedule, machineId: e.target.value})}
              required
              className="form-input"
              disabled={availableMachines.length === 0}
            >
              <option value="">Selecione uma máquina disponível...</option>
              {availableMachines.map(machine => (
                <option key={machine.id} value={machine.id}>
                  {machine.name} ({machine.type || 'Sem categoria'})
                </option>
              ))}
            </select>
            {availableMachines.length === 0 && (
              <p className="error-message">Nenhuma máquina disponível no momento</p>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button 
            onClick={handleAddSchedule} 
            className="submit-btn"
          >
            {editingId ? 'Atualizar' : 'Agendar'}
          </button>

          {editingId && (
            <button
              onClick={handleCancelEdit}
              className="cancel-btn"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      <div className="schedule-list-container">
        <h2>
          {isAdmin ? 'Todos os Agendamentos' : 'Meus Agendamentos'} 
          ({schedules.length})
        </h2>
        
        {schedules.length > 0 ? (
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Hora</th>
                {isAdmin && <th>Usuário</th>}
                <th>Máquina</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map(schedule => (
                <tr key={schedule.id}>
                  <td>{schedule.formattedDate}</td>
                  <td>{schedule.time}</td>
                  {isAdmin && <td>{schedule.userName}</td>}
                  <td>{schedule.machineName}</td>
                  <td>{schedule.machineStatus}</td>
                  <td className="actions">
                    <button 
                      onClick={() => handleEdit(schedule)}
                      className="edit-btn"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(schedule.id)}
                      className="delete-btn"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-results">
            {isAdmin
              ? 'Nenhum agendamento cadastrado'
              : 'Você não possui agendamentos cadastrados'}
          </p>
        )}
      </div>
    </div>
  );
}