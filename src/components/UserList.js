import React from 'react';
import { useState } from 'react';

export default function UserList({ users, onEdit, onDelete, onUserTypeChange }) {
  const [localUsers, setLocalUsers] = useState(users);

  const handleTypeChange = (userId, newType) => {
    const updatedUsers = localUsers.map(user => 
      user.id === userId ? { ...user, type: newType } : user
    );
    setLocalUsers(updatedUsers);
    onUserTypeChange(userId, newType);
  };

  return (
    <div className="list-container">
      <h2>Lista de Usuários</h2>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Tipo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {localUsers.map(user => (
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
              <td className="actions">
                <button 
                  onClick={() => onEdit(user)}
                  className="edit-btn"
                >
                  Editar
                </button>
                <button 
                  onClick={() => onDelete(user.id)}
                  className="delete-btn"
                  disabled={user.email === 'admin@academia.com'}
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