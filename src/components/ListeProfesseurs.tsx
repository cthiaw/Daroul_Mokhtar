import React, { useState } from 'react';
import { Professeur, Classe, User } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { FormulaireProfesseur } from './FormulaireProfesseur';
import { Alert } from './ui/Alert';
import { Download, UserPlus } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ListeProfesseursProps {
  professeurs: Professeur[];
  classes: Classe[];
  user: User;
  onAddProfesseur: (professeur: Omit<Professeur, 'id'>) => void;
  onUpdateProfesseur: (id: string, professeur: Omit<Professeur, 'id'>) => void;
  onDeleteProfesseur: (id: string) => void;
}

export const ListeProfesseurs: React.FC<ListeProfesseursProps> = ({ 
  professeurs, 
  classes, 
  user,
  onAddProfesseur, 
  onUpdateProfesseur, 
  onDeleteProfesseur 
}) => {
  const [editingProfesseur, setEditingProfesseur] = useState<Professeur | null>(null);
  const [isAddingProfesseur, setIsAddingProfesseur] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canEdit = user?.role === 'admin' || user?.role === 'superadmin';

  const handleEdit = (professeur: Professeur) => {
    setEditingProfesseur(professeur);
    setIsAddingProfesseur(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce professeur ?')) {
      onDeleteProfesseur(id);
    }
  };

  const handleSubmit = async (professeur: Omit<Professeur, 'id'>) => {
    try {
      if (editingProfesseur) {
        await onUpdateProfesseur(editingProfesseur.id, professeur);
        setEditingProfesseur(null);
      } else {
        await onAddProfesseur(professeur);
        setIsAddingProfesseur(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Une erreur s'est produite lors de l'opération");
      }
    }
  };

  const handleCancel = () => {
    setIsAddingProfesseur(false);
    setEditingProfesseur(null);
  };

  const exportToExcel = () => {
    const data = professeurs.map(prof => ({
      'N° Immatriculation': prof.numeroImmatriculation,
      'Nom': prof.nom,
      'Prénom': prof.prenom,
      'Matière': prof.matiere || '-',
      'Classe Arabe': classes.find(c => c.id === prof.classeArabe)?.nom || '-',
      'Classe Français': classes.find(c => c.id === prof.classeFrancais)?.nom || '-'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Professeurs");
    XLSX.writeFile(wb, `liste_professeurs_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Liste des Professeurs</h2>
        {canEdit && (
          <div className="flex gap-2">
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <Download className="h-5 w-5" />
              Exporter
            </button>
            <button
              onClick={() => { setIsAddingProfesseur(true); setEditingProfesseur(null); }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <UserPlus className="h-5 w-5" />
              Ajouter un professeur
            </button>
          </div>
        )}
      </div>

      {error && (
        <Alert
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
      )}

      {(isAddingProfesseur || editingProfesseur) && (
        <FormulaireProfesseur
          professeur={editingProfesseur || undefined}
          classes={classes}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Immatriculation</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Prénom</TableHead>
              <TableHead>Matière</TableHead>
              <TableHead>Classe Arabe</TableHead>
              <TableHead>Classe Français</TableHead>
              {canEdit && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {professeurs.map((professeur) => (
              <TableRow key={professeur.id}>
                <TableCell>{professeur.numeroImmatriculation}</TableCell>
                <TableCell>{professeur.nom}</TableCell>
                <TableCell>{professeur.prenom}</TableCell>
                <TableCell>{professeur.matiere || '-'}</TableCell>
                <TableCell>{classes.find(c => c.id === professeur.classeArabe)?.nom || '-'}</TableCell>
                <TableCell>{classes.find(c => c.id === professeur.classeFrancais)?.nom || '-'}</TableCell>
                {canEdit && (
                  <TableCell>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(professeur)} 
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Modifier
                      </button>
                      <button 
                        onClick={() => handleDelete(professeur.id)} 
                        className="text-red-600 hover:text-red-800"
                      >
                        Supprimer
                      </button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ListeProfesseurs;