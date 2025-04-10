import { useState, useEffect } from 'react';
import '../styles/Users.css';
import api from '../services/api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    nome: '',
    senha: '',
    tipo_usuario: 'usuario'
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentUserType = localStorage.getItem('userType');

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        console.error('Error fetching users:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (currentUserType === 'admin') {
      fetchUsers();
    }
  }, [currentUserType]);

  const filteredUsers = users.filter(user =>
    user.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = async () => {
    if (!newUser.nome || !newUser.senha) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    setIsLoading(true);
    try {
      if (editingId) {
        await api.put(`/users/${editingId}`, {
          nome: newUser.nome,
          senha: newUser.senha
        });
      } else {
        await api.post('/users/register', newUser);
      }

      const response = await api.get('/users');
      setUsers(response.data);
      
      setNewUser({ nome: '', senha: '', tipo_usuario: 'usuario' });
      setEditingId(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
        (err.response?.status === 403 
          ? 'Apenas administradores podem criar outros administradores' 
          : 'Erro ao salvar usuário');
      
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user) => {
    setNewUser({
      nome: user.nome,
      senha: '',
      tipo_usuario: user.tipo_usuario
    });
    setEditingId(user.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      setIsLoading(true);
      try {
        await api.delete(`/users/${id}`);
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        alert(err.response?.data?.message || 'Erro ao excluir usuário');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleTypeChange = async (userId, newType) => {
    if (currentUserType !== 'admin') {
      alert('Apenas administradores podem alterar tipos de usuário');
      return;
    }

    setIsLoading(true);
    try {
      await api.patch(`/users/${userId}`, { 
        tipo_usuario: newType 
      });
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (currentUserType !== 'admin') {
    return <div className="error">Acesso restrito a administradores</div>;
  }

  if (isLoading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">Erro: {error}</div>;

  return (
    <div className="users-container">
      <h1>Gerenciamento de Usuários</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar usuários por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="user-form">
        <h2>{editingId ? 'Editar' : 'Adicionar'} Usuário</h2>
        
        <div className="form-grid">
          <div className="form-group">
            <label>Nome*</label>
            <input
              type="text"
              placeholder="Nome de usuário"
              value={newUser.nome}
              onChange={(e) => setNewUser({...newUser, nome: e.target.value})}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Senha*{editingId && ' (deixe em branco para manter a atual)'}</label>
            <input
              type="password"
              placeholder="••••••••"
              value={newUser.senha}
              onChange={(e) => setNewUser({...newUser, senha: e.target.value})}
              required={!editingId}
              minLength="6"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Tipo*</label>
            <select
              value={newUser.tipo_usuario}
              onChange={(e) => setNewUser({...newUser, tipo_usuario: e.target.value})}
              required
              disabled={isLoading || currentUserType !== 'admin'}
            >
              <option value="usuario">Usuário</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button onClick={handleAddUser} className="submit-btn" disabled={isLoading}>
            {editingId ? 'Atualizar' : 'Adicionar'} Usuário
          </button>

          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setNewUser({ nome: '', senha: '', tipo_usuario: 'usuario' });
              }}
              className="cancel-btn"
              disabled={isLoading}
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      <div className="user-list">
        <h2>Lista de Usuários ({filteredUsers.length})</h2>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.nome}</td>
                <td>
                  <select
                    value={user.tipo_usuario}
                    onChange={(e) => handleTypeChange(user.id, e.target.value)}
                    className={`type-select ${user.tipo_usuario}`}
                    disabled={isLoading || currentUserType !== 'admin'}
                  >
                    <option value="usuario">Usuário</option>
                    <option value="admin">Administrador</option>
                  </select>
                </td>
                <td className="actions">
                  <button 
                    onClick={() => handleEdit(user)}
                    className="edit-btn"
                    disabled={isLoading}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(user.id)}
                    className="delete-btn"
                    disabled={isLoading || (user.tipo_usuario === 'admin' && currentUserType !== 'admin')}
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