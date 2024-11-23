import React, { useState } from 'react';
import { Eleve, Classe, User } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { FormulaireEleve } from './FormulaireEleve';
import { Alert } from './ui/Alert';
import { Download, UserPlus } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ListeElevesProps {
  eleves: Eleve[];
  classes: Classe[];
  user: User;
  onAddEleve: (eleve: Omit<Eleve, 'id'>) => void;
  onUpdateEleve: (id: string, eleve: Omit<Eleve, 'id'>) => void;
  onDeleteEleve: (id: string) => void;
}

export const ListeEleves: React.FC<ListeElevesProps> = ({ 
  eleves, 
  classes, 
  user,
  onAddEleve, 
  onUpdateEleve, 
  onDeleteEleve 
}) => {
  const [editingEleve, setEditingEleve] = useState<Eleve | null>(null);
  const [isAddingEleve, setIsAddingEleve] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = (eleve: Eleve) => {
    setEditingEleve(eleve);
    setIsAddingEleve(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élève ?')) {
      onDeleteEleve(id);
    }
  };

  const handleSubmit = async (eleve: Omit<Eleve, 'id'>) => {
    try {
      if (editingEleve) {
        await onUpdateEleve(editingEleve.id, eleve);
        setEditingEleve(null);
      } else {
        await onAddEleve(eleve);
        setIsAddingEleve(false);
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
    setIsAddingEleve(false);
    setEditingEleve(null);
  };

  const exportToExcel = () => {
    const data = eleves.map(eleve => ({
      'N° Immatriculation': eleve.numeroImmatriculation,
      'Nom': eleve.nom,
      'Prénom': eleve.prenom,
      'Date de naissance': eleve.dateNaissance,
      'Classe Arabe': classes.find(c => c.id === eleve.classeArabe)?.nom || '-',
      'Classe Français': classes.find(c => c.id === eleve.classeFrancais)?.nom || '-'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Elèves");
    XLSX.writeFile(wb, `liste_eleves_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const getClasseName = (classeId: string | undefined, type: 'Arabe' | 'Français') => {
    if (!classeId) return '-';
    const classe = classes.find(c => c.id === classeId && c.type === type);
    return classe ? classe.nom : '-';
  };

  const canEdit = user?.role === 'admin' || user?.role === 'superadmin';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Liste des Élèves</h2>
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
              onClick={() => { setIsAddingEleve(true); setEditingEleve(null); }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <UserPlus className="h-5 w-5" />
              Ajouter un élève
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

      {(isAddingEleve || editingEleve) && (
        <FormulaireEleve
          eleve={editingEleve || undefined}
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
              <TableHead>Date de naissance</TableHead>
              <TableHead>Classe Arabe</TableHead>
              <TableHead>Classe Français</TableHead>
              {canEdit && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {eleves.map((eleve) => (
              <TableRow key={eleve.id}>
                <TableCell>{eleve.numeroImmatriculation}</TableCell>
                <TableCell>{eleve.nom}</TableCell>
                <TableCell>{eleve.prenom}</TableCell>
                <TableCell>{eleve.dateNaissance}</TableCell>
                <TableCell>{getClasseName(eleve.classeArabe, 'Arabe')}</TableCell>
                <TableCell>{getClasseName(eleve.classeFrancais, 'Français')}</TableCell>
                {canEdit && (
                  <TableCell>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(eleve)} 
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Modifier
                      </button>
                      <button 
                        onClick={() => handleDelete(eleve.id)} 
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

export default ListeEleves;