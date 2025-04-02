import { useState, useEffect } from 'react';
import ScheduleList from '../components/ScheduleList';
import { fetchAllUsers } from '../services/api'; // You'll need to implement this API call

export default function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [newSchedule, setNewSchedule] = useState({ 
    date: '', 
    time: '', 
    activity: '', 
    client: '',
    userId: localStorage.getItem('userId') // Default to current user
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
    
    loadSchedules();
  }, [selectedUserId]);

  const loadSchedules = () => {
    // Replace with your actual API call
    const mockSchedules = [
      { id: 1, date: '2023-06-01', time: '09:00', activity: 'Musculação', client: 'João', userId: '001' },
      { id: 2, date: '2023-06-02', time: '14:00', activity: 'Aeróbico', client: 'Maria', userId: '002' }
    ];
    
    let filtered = mockSchedules;
    if (!isAdmin) {
      filtered = mockSchedules.filter(sched => sched.userId === localStorage.getItem('userId'));
    } else if (selectedUserId) {
      filtered = mockSchedules.filter(sched => sched.userId === selectedUserId);
    }
    
    setSchedules(filtered);
  };

  const handleAddSchedule = () => {
    if (!newSchedule.date || !newSchedule.time || !newSchedule.activity) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    const scheduleData = {
      ...newSchedule,
      userId: isAdmin && selectedUserId ? selectedUserId : localStorage.getItem('userId')
    };

    if (editingId) {
      setSchedules(schedules.map(sched => 
        sched.id === editingId ? { ...scheduleData, id: editingId } : sched
      ));
      setEditingId(null);
    } else {
      setSchedules([...schedules, { ...scheduleData, id: Date.now() }]);
    }
    
    setNewSchedule({ date: '', time: '', activity: '', client: '', userId: '' });
  };

  const handleEdit = (schedule) => {
    setNewSchedule(schedule);
    setEditingId(schedule.id);
    if (isAdmin) setSelectedUserId(schedule.userId);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      setSchedules(schedules.filter(sched => sched.id !== id));
    }
  };

  return (
    <div className="page-container">
      <h1>Gerenciamento de Agendamentos</h1>
      
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
        <h2>{editingId ? 'Editar' : 'Adicionar'} Agendamento</h2>
        
        <div className="form-grid">
          <div className="form-group">
            <label>Data*</label>
            <input
              type="date"
              value={newSchedule.date}
              onChange={(e) => setNewSchedule({...newSchedule, date: e.target.value})}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="form-group">
            <label>Hora*</label>
            <input
              type="time"
              value={newSchedule.time}
              onChange={(e) => setNewSchedule({...newSchedule, time: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Atividade*</label>
            <select
              value={newSchedule.activity}
              onChange={(e) => setNewSchedule({...newSchedule, activity: e.target.value})}
              required
            >
              <option value="">Selecione...</option>
              <option value="Musculação">Musculação</option>
              <option value="Aeróbico">Aeróbico</option>
              <option value="Alongamento">Alongamento</option>
              <option value="Avaliação Física">Avaliação Física</option>
            </select>
          </div>

          <div className="form-group">
            <label>Cliente*</label>
            <input
              type="text"
              placeholder="Nome do cliente"
              value={newSchedule.client}
              onChange={(e) => setNewSchedule({...newSchedule, client: e.target.value})}
              required
            />
          </div>
        </div>

        <button onClick={handleAddSchedule} className="submit-btn">
          {editingId ? 'Atualizar' : 'Agendar'}
        </button>

        {editingId && (
          <button
            onClick={() => {
              setEditingId(null);
              setNewSchedule({ date: '', time: '', activity: '', client: '', userId: '' });
              if (isAdmin) setSelectedUserId('');
            }}
            className="cancel-btn"
          >
            Cancelar
          </button>
        )}
      </div>

      <ScheduleList 
        schedules={schedules} 
        onEdit={handleEdit} 
        onDelete={handleDelete}
        showUser={isAdmin && !selectedUserId}
        users={users}
      />
    </div>
  );
}