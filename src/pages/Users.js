import { useState, useEffect } from 'react';
import { mockDatabase } from '../services/mockDataBase';
import '../styles/Users.css';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    type: 'user'
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    setUsers(mockDatabase.users);
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    if (editingId) {
      const updatedUsers = users.map(user =>
        user.id === editingId ? { ...newUser, id: editingId } : user
      );
      setUsers(updatedUsers);
      mockDatabase.users = updatedUsers; 
    } else {
      const newUserWithId = { 
        ...newUser, 
        id: `u${Date.now()}`,
        workouts: [] 
      };
      setUsers([...users, newUserWithId]);
      mockDatabase.users.push(newUserWithId); 
    }

    setNewUser({ name: '', email: '', password: '', type: 'user' });
    setEditingId(null);
  };

  const handleEdit = (user) => {
    setNewUser(user);
    setEditingId(user.id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      const updatedUsers = users.filter(user => user.id !== id);
      setUsers(updatedUsers);
      mockDatabase.users = updatedUsers; 
      

      mockDatabase.workouts = mockDatabase.workouts.filter(
        workout => workout.userId !== id
      );
      

      mockDatabase.schedules = mockDatabase.schedules.filter(
        schedule => schedule.userId !== id
      );
    }
  };

  const handleTypeChange = (userId, newType) => {
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, type: newType } : user
    );
    setUsers(updatedUsers);
    mockDatabase.users = updatedUsers;
  };

  return (
    <div className="users-container">
      <h1>Gerenciamento de Usuários</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar usuários..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="user-form">
        <h2>{editingId ? 'Editar' : 'Adicionar'} Usuário</h2>
        
        <div className="form-grid">
          <div className="form-group">
            <label>Nome*</label>
            <input
              type="text"
              placeholder="Nome completo"
              value={newUser.name}
              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Email*</label>
            <input
              type="email"
              placeholder="email@exemplo.com"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Senha* (mínimo 6 caracteres)</label>
            <input
              type="password"
              placeholder="••••••••"
              value={newUser.password}
              onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              minLength="6"
              required
            />
          </div>

          <div className="form-group">
            <label>Tipo*</label>
            <select
              value={newUser.type}
              onChange={(e) => setNewUser({...newUser, type: e.target.value})}
              required
            >
              <option value="user">Usuário</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button onClick={handleAddUser} className="submit-btn">
            {editingId ? 'Atualizar' : 'Adicionar'} Usuário
          </button>

          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setNewUser({ name: '', email: '', password: '', type: 'user' });
              }}
              className="cancel-btn"
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
              <th>Email</th>
              <th>Tipo</th>
              <th>Treinos</th>
              <th>Agendamentos</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => {
              const userWorkouts = mockDatabase.workouts.filter(
                workout => workout.userId === user.id
              ).length;
              
              const userSchedules = mockDatabase.schedules.filter(
                schedule => schedule.userId === user.id
              ).length;
              
              return (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      value={user.type}
                      onChange={(e) => handleTypeChange(user.id, e.target.value)}
                      className={`type-select ${user.type}`}
                      disabled={user.email === 'admin@academia.com'}
                    >
                      <option value="user">Usuário</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </td>
                  <td>{userWorkouts}</td>
                  <td>{userSchedules}</td>
                  <td className="actions">
                    <button 
                      onClick={() => handleEdit(user)}
                      className="edit-btn"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="delete-btn"
                      disabled={user.email === 'admin@academia.com'}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}