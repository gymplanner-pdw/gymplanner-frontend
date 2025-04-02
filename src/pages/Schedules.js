import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScheduleList from '../components/ScheduleList';

export default function Schedules() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([
    { 
      id: 1, 
      date: new Date().toISOString().split('T')[0], 
      time: '18:00', 
      activity: 'Musculação', 
      client: 'João Silva',
      instructor: 'Carlos' 
    },
    { 
      id: 2, 
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0], 
      time: '09:00', 
      activity: 'Aeróbico', 
      client: 'Maria Souza',
      instructor: 'Ana' 
    }
  ]);

  const [newSchedule, setNewSchedule] = useState({ 
    date: '', 
    time: '', 
    activity: '', 
    client: '',
    instructor: '' 
  });

  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('');

  const handleAddSchedule = () => {
    // Validação
    if (!newSchedule.date || !newSchedule.time || !newSchedule.activity || !newSchedule.client) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    // Verifica conflito de horário
    const hasConflict = schedules.some(sched => 
      sched.date === newSchedule.date && 
      sched.time === newSchedule.time && 
      sched.instructor === newSchedule.instructor &&
      sched.id !== editingId
    );

    if (hasConflict) {
      alert('Já existe um agendamento para este horário com este instrutor!');
      return;
    }

    // Adiciona/Atualiza
    if (editingId) {
      setSchedules(schedules.map(sched => 
        sched.id === editingId ? { ...newSchedule, id: editingId } : sched
      ));
      setEditingId(null);
    } else {
      setSchedules([...schedules, { ...newSchedule, id: Date.now() }]);
    }
    
    // Reseta o formulário
    setNewSchedule({ date: '', time: '', activity: '', client: '', instructor: '' });
  };

  const handleEdit = (schedule) => {
    setNewSchedule(schedule);
    setEditingId(schedule.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      setSchedules(schedules.filter(sched => sched.id !== id));
    }
  };

  const filteredSchedules = schedules.filter(sched =>
    sched.client.toLowerCase().includes(filter.toLowerCase()) ||
    sched.activity.toLowerCase().includes(filter.toLowerCase()) ||
    sched.instructor.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="page-container">
      <h1>Gerenciamento de Agendamentos</h1>
      
      <div className="crud-actions">
        <button 
          onClick={() => navigate('/home')}
          className="back-button"
        >
          Voltar
        </button>
        
        <input
          type="text"
          placeholder="Filtrar por cliente, atividade ou instrutor"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="form-container">
        <h2>{editingId ? 'Editar' : 'Novo'} Agendamento</h2>
        
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
              <option value="Crossfit">Crossfit</option>
              <option value="Yoga">Yoga</option>
              <option value="Pilates">Pilates</option>
            </select>
          </div>

          <div className="form-group">
            <label>Cliente*</label>
            <input
              type="text"
              placeholder="Nome completo"
              value={newSchedule.client}
              onChange={(e) => setNewSchedule({...newSchedule, client: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Instrutor*</label>
            <select
              value={newSchedule.instructor}
              onChange={(e) => setNewSchedule({...newSchedule, instructor: e.target.value})}
              required
            >
              <option value="">Selecione...</option>
              <option value="Carlos">Carlos</option>
              <option value="Ana">Ana</option>
              <option value="Pedro">Pedro</option>
              <option value="Mariana">Mariana</option>
            </select>
          </div>
        </div>

        <button 
          onClick={handleAddSchedule}
          className="submit-btn"
        >
          {editingId ? 'Atualizar' : 'Agendar'}
        </button>

        {editingId && (
          <button
            onClick={() => {
              setEditingId(null);
              setNewSchedule({ date: '', time: '', activity: '', client: '', instructor: '' });
            }}
            className="cancel-btn"
          >
            Cancelar Edição
          </button>
        )}
      </div>

      <ScheduleList 
        schedules={filteredSchedules} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />
    </div>
  );
}