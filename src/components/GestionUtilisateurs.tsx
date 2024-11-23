import React, { useState } from 'react';
import { User } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

export const GestionUtilisateurs: React.FC<{
  users: User[];
  onAddUser: (user: Omit<User, 'id'>) => void;
  onUpdateUser: (id: number, user: Partial<User>) => void;
  onDeleteUser: (id: number) => void;
}> = ({ users, onAddUser, onUpdateUser, onDeleteUser }) => {
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({ username: '', password: '', role: 'user' });
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    onAddUser(newUser);
    setNewUser({ username: '', password: '', role: 'user' });
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      onUpdateUser(editingUser.id, editingUser);
      setEditingUser(null);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gestion des Utilisateurs</h2>
      
      <form onSubmit={handleAddUser} className="mb-4">
        <input
          type="text"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          placeholder="Nom d'utilisateur"
          className="mr-2 p-2 border rounded"
        />
        <input
          type="password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          placeholder="Mot de passe"
          className="mr-2 p-2 border rounded"
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value as User['role'] })}
          className="mr-2 p-2 border rounded"
        >
          <option value="user">Utilisateur</option>
          <option value="admin">Admin</option>
          <option value="superadmin">Super Admin</option>
        </select>
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">Ajouter</button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom d'utilisateur</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <button onClick={() => setEditingUser(user)} className="mr-2 text-blue-600">Modifier</button>
                <button onClick={() => onDeleteUser(user.id)} className="text-red-600">Supprimer</button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingUser && (
        <form onSubmit={handleUpdateUser} className="mt-4">
          <input
            type="text"
            value={editingUser.username}
            onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
            className="mr-2 p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
            className="mr-2 p-2 border rounded"
          />
          <select
            value={editingUser.role}
            onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as User['role'] })}
            className="mr-2 p-2 border rounded"
          >
            <option value="user">Utilisateur</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
          </select>
          <button type="submit" className="p-2 bg-green-500 text-white rounded">Mettre à jour</button>
          <button type="button" onClick={() => setEditingUser(null)} className="ml-2 p-2 bg-gray-500 text-white rounded">Annuler</button>
        </form>
      )}
    </div>
  );
};

export default GestionUtilisateurs;