import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Schedules.css';
import api from '../services/api';

export default function Schedules() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [maquinas, setMaquinas] = useState([]);
  const [novoAgendamento, setNovoAgendamento] = useState({
    id_maquina: '',
    data_inicio: '',
    data_fim: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('todos');
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('userType') === 'admin';

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [agendamentosRes, maquinasRes] = await Promise.all([
          api.get('/agendamentos'),
          api.get('/machines')
        ]);
        
        setAgendamentos(agendamentosRes.data);
        setMaquinas(maquinasRes.data.filter(m => m.status === 'disponivel'));
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredAgendamentos = agendamentos.filter(agendamento => {
    const hoje = new Date();
    const dataFim = new Date(agendamento.data_fim);
    
    if (filter === 'ativos') return dataFim >= hoje;
    if (filter === 'passados') return dataFim < hoje;
    return true;
  });

  const handleCreateOrUpdateAgendamento = async () => {
    if (!novoAgendamento.id_maquina || !novoAgendamento.data_inicio || !novoAgendamento.data_fim) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    setIsLoading(true);
    try {
      if (editingId) {
        await api.put(`/agendamentos/${editingId}`, {
          data_inicio: novoAgendamento.data_inicio,
          data_fim: novoAgendamento.data_fim
        });
      } else {
        await api.post('/agendamentos', novoAgendamento);
      }

      const response = await api.get('/agendamentos');
      setAgendamentos(response.data);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      alert(err.response?.data?.message || 'Erro ao salvar agendamento');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAgendamento = async (id) => {
    if (window.confirm('Tem certeza que deseja cancelar este agendamento?')) {
      setIsLoading(true);
      try {
        await api.delete(`/agendamentos/${id}`);
        setAgendamentos(agendamentos.filter(a => a.id !== id));
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEditAgendamento = (agendamento) => {
    setNovoAgendamento({
      id_maquina: agendamento.id_maquina,
      data_inicio: agendamento.data_inicio.split('.')[0],
      data_fim: agendamento.data_fim.split('.')[0]
    });
    setEditingId(agendamento.id);
  };

  const resetForm = () => {
    setNovoAgendamento({
      id_maquina: '',
      data_inicio: '',
      data_fim: ''
    });
    setEditingId(null);
  };

  const formatDateTime = (dateTimeString) => {
    const options = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateTimeString).toLocaleString('pt-BR', options);
  };

  if (isLoading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">Erro: {error}</div>;

  return (
    <div className="schedules-container">
      <h1>Gerenciamento de Agendamentos</h1>

      <div className="schedule-form">
        <h2>{editingId ? 'Editar' : 'Novo'} Agendamento</h2>
        
        <div className="form-grid">
          <div className="form-group">
            <label>Máquina*</label>
            <select
              value={novoAgendamento.id_maquina}
              onChange={(e) => setNovoAgendamento({...novoAgendamento, id_maquina: e.target.value})}
              required
              disabled={isLoading || editingId}
            >
              <option value="">Selecione uma máquina</option>
              {maquinas.map(maquina => (
                <option key={maquina.id} value={maquina.id}>
                  {maquina.nome} ({maquina.grupo_muscular})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Data/Hora Início*</label>
            <input
              type="datetime-local"
              value={novoAgendamento.data_inicio}
              onChange={(e) => setNovoAgendamento({...novoAgendamento, data_inicio: e.target.value})}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Data/Hora Fim*</label>
            <input
              type="datetime-local"
              value={novoAgendamento.data_fim}
              onChange={(e) => setNovoAgendamento({...novoAgendamento, data_fim: e.target.value})}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            onClick={handleCreateOrUpdateAgendamento}
            className="submit-btn"
            disabled={isLoading}
          >
            {editingId ? 'Atualizar' : 'Agendar'}
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

      <div className="schedule-list">
        <div className="filter-controls">
          <h2>Meus Agendamentos ({filteredAgendamentos.length})</h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            disabled={isLoading}
          >
            <option value="todos">Todos</option>
            <option value="ativos">Ativos</option>
            <option value="passados">Passados</option>
          </select>
        </div>

        {filteredAgendamentos.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Máquina</th>
                <th>Início</th>
                <th>Fim</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgendamentos.map(agendamento => {
                const maquina = maquinas.find(m => m.id === agendamento.id_maquina);
                const hoje = new Date();
                const dataFim = new Date(agendamento.data_fim);
                const status = dataFim >= hoje ? 'Ativo' : 'Concluído';

                return (
                  <tr key={agendamento.id}>
                    <td>{maquina?.nome || 'Máquina não encontrada'}</td>
                    <td>{formatDateTime(agendamento.data_inicio)}</td>
                    <td>{formatDateTime(agendamento.data_fim)}</td>
                    <td className={`status ${status.toLowerCase()}`}>{status}</td>
                    <td className="actions">
                      <button
                        onClick={() => handleEditAgendamento(agendamento)}
                        className="edit-btn"
                        disabled={isLoading || status === 'Concluído'}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteAgendamento(agendamento.id)}
                        className="delete-btn"
                        disabled={isLoading}
                      >
                        Cancelar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="no-schedules">Nenhum agendamento encontrado</p>
        )}
      </div>
    </div>
  );
}