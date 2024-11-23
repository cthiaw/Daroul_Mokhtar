import React, { useState, useEffect } from 'react';
import { Depense, User, Professeur } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface GestionDepensesProps {
  depenses: Depense[];
  users: User[];
  currentUser: User;
  professeurs: Professeur[]; // Ajout des professeurs
  ajouterDepense: (depense: Omit<Depense, 'id'>) => void;
}

export const GestionDepenses: React.FC<GestionDepensesProps> = ({ 
  depenses, 
  users, 
  currentUser,
  professeurs,
  ajouterDepense 
}) => {
  const [montant, setMontant] = useState<number>(0);
  const [categorie, setCategorie] = useState<Depense['categorie']>('Salaire');
  const [description, setDescription] = useState('');
  const [selectedProfId, setSelectedProfId] = useState<string>('');

  // Reset selectedProfId when category changes
  useEffect(() => {
    if (categorie !== 'Salaire') {
      setSelectedProfId('');
      setDescription('');
    }
  }, [categorie]);

  // Update description when professor is selected
  useEffect(() => {
    if (selectedProfId && categorie === 'Salaire') {
      const prof = professeurs.find(p => p.id === Number(selectedProfId));
      if (prof) {
        setDescription(`Salaire de ${prof.nom} ${prof.prenom}`);
      }
    }
  }, [selectedProfId, professeurs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nouvelleDepense: Omit<Depense, 'id'> = {
      date: new Date().toISOString().split('T')[0],
      montant,
      categorie,
      description,
      userId: currentUser.id
    };
    ajouterDepense(nouvelleDepense);
    // Réinitialiser le formulaire
    setMontant(0);
    setCategorie('Salaire');
    setDescription('');
    setSelectedProfId('');
  };

  // Sort expenses by date in descending order
  const sortedDepenses = [...depenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Gestion des Dépenses</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        <div>
          <label htmlFor="categorie" className="block text-sm font-medium text-gray-700">
            Catégorie
          </label>
          <select
            id="categorie"
            value={categorie}
            onChange={(e) => setCategorie(e.target.value as Depense['categorie'])}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="Salaire">Salaire</option>
            <option value="Electricité">Electricité</option>
            <option value="Eau">Eau</option>
            <option value="Personnel">Personnel</option>
            <option value="Autre">Autre</option>
          </select>
        </div>

        {categorie === 'Salaire' && (
          <div>
            <label htmlFor="professeur" className="block text-sm font-medium text-gray-700">
              Professeur
            </label>
            <select
              id="professeur"
              value={selectedProfId}
              onChange={(e) => setSelectedProfId(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Sélectionnez un professeur</option>
              {professeurs.map((prof) => (
                <option key={prof.id} value={prof.id}>
                  {prof.nom} {prof.prenom} - {prof.matiere || 'Sans matière'}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="montant" className="block text-sm font-medium text-gray-700">
            Montant
          </label>
          <input
            type="number"
            id="montant"
            value={montant}
            onChange={(e) => setMontant(Number(e.target.value))}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Ajouter la dépense
        </button>
      </form>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Historique des Dépenses</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Enregistré par</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedDepenses.map((depense) => {
              const user = users.find(u => u.id === depense.userId);
              return (
                <TableRow key={depense.id}>
                  <TableCell>{new Date(depense.date).toLocaleDateString()}</TableCell>
                  <TableCell>{depense.categorie}</TableCell>
                  <TableCell>{depense.description}</TableCell>
                  <TableCell>{depense.montant} FCFA</TableCell>
                  <TableCell>{user?.username || 'Utilisateur inconnu'}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};