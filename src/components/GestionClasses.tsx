import React, { useState } from 'react';
import { Classe, Eleve, Professeur, User } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Alert } from './ui/Alert';
import { Download, UserPlus } from 'lucide-react';
import * as XLSX from 'xlsx';

interface GestionClassesProps {
  classes: Classe[];
  eleves: Eleve[];
  professeurs: Professeur[];
  user: User;
  onAddClasse: (classe: Omit<Classe, 'id'>) => void;
  onUpdateClasse: (id: string, updatedClasse: Partial<Classe>) => void;
  onDeleteClasse: (id: string) => void;
  onAddEleveToClasse: (classeId: string, eleveId: string) => void;
  onAssignProfesseurToClasse: (classeId: string, professeurId: string) => void;
}

export const GestionClasses: React.FC<GestionClassesProps> = ({
  classes,
  eleves,
  professeurs,
  user,
  onAddClasse,
  onUpdateClasse,
  onDeleteClasse,
  onAddEleveToClasse,
  onAssignProfesseurToClasse
}) => {
  const [selectedClasse, setSelectedClasse] = useState<Classe | null>(null);
  const [newClasse, setNewClasse] = useState<Omit<Classe, 'id'>>({ nom: '', type: 'Français' });
  const [selectedEleveId, setSelectedEleveId] = useState<string>('');
  const [selectedProfesseurId, setSelectedProfesseurId] = useState<string>('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canEdit = user?.role === 'admin' || user?.role === 'superadmin';

  const handleClasseSelect = (classeId: string) => {
    const classe = classes.find(c => c.id === classeId);
    if (classe) {
      setSelectedClasse(classe);
      setShowDeleteConfirmation(false);
    }
  };

  const handleAddClasse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    onAddClasse(newClasse);
    setNewClasse({ nom: '', type: 'Français' });
  };

  const handleUpdateClasse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit || !selectedClasse) return;
    onUpdateClasse(selectedClasse.id, selectedClasse);
    setSelectedClasse(null);
  };

  const handleDeleteClasse = () => {
    if (!canEdit || !selectedClasse) return;

    const elevesInClasse = eleves.filter(eleve => 
      eleve.classeArabe === selectedClasse.id || eleve.classeFrancais === selectedClasse.id
    );

    if (elevesInClasse.length > 0) {
      setError(`Impossible de supprimer cette classe car elle contient ${elevesInClasse.length} élève(s).`);
      return;
    }

    onDeleteClasse(selectedClasse.id);
    setSelectedClasse(null);
    setShowDeleteConfirmation(false);
  };

  const handleCancel = () => {
    setSelectedClasse(null);
    setShowDeleteConfirmation(false);
  };

  const handleAddEleveToClasse = () => {
    if (!canEdit || !selectedClasse || !selectedEleveId) return;
    onAddEleveToClasse(selectedClasse.id, selectedEleveId);
    setSelectedEleveId('');
  };

  const handleAssignProfesseurToClasse = () => {
    if (!canEdit || !selectedClasse || !selectedProfesseurId) return;
    onAssignProfesseurToClasse(selectedClasse.id, selectedProfesseurId);
    setSelectedProfesseurId('');
  };

  const getElevesForClasse = (classeId: string) => {
    return eleves.filter(eleve => 
      eleve.classeArabe === classeId || eleve.classeFrancais === classeId
    );
  };

  const getProfesseurForClasse = (classeId: string) => {
    return professeurs.find(prof => 
      prof.classeArabe === classeId || prof.classeFrancais === classeId
    );
  };

  const exportToExcel = () => {
    const data = classes.map(classe => ({
      'Nom': classe.nom,
      'Type': classe.type,
      'Nombre d\'élèves': getElevesForClasse(classe.id).length,
      'Professeur': (() => {
        const prof = getProfesseurForClasse(classe.id);
        return prof ? `${prof.nom} ${prof.prenom}` : '-';
      })()
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Classes");
    XLSX.writeFile(wb, `liste_classes_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Classes</h2>
        {canEdit && (
          <div className="flex gap-2">
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <Download className="h-5 w-5" />
              Exporter
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
      
      {canEdit && (
        <form onSubmit={handleAddClasse} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={newClasse.nom}
              onChange={(e) => setNewClasse({ ...newClasse, nom: e.target.value })}
              placeholder="Nom de la classe"
              className="p-2 border rounded"
              required
            />
            <select
              value={newClasse.type}
              onChange={(e) => setNewClasse({ ...newClasse, type: e.target.value as 'Arabe' | 'Français' })}
              className="p-2 border rounded"
              required
            >
              <option value="Français">Français</option>
              <option value="Arabe">Arabe</option>
            </select>
          </div>
          <button 
            type="submit" 
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center gap-2"
          >
            <UserPlus className="h-5 w-5" />
            Ajouter une classe
          </button>
        </form>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <select 
          onChange={(e) => handleClasseSelect(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          value={selectedClasse?.id || ''}
        >
          <option value="">Sélectionnez une classe</option>
          {classes.map((classe) => (
            <option key={classe.id} value={classe.id}>
              {classe.nom} - {classe.type}
            </option>
          ))}
        </select>

        {selectedClasse && (
          <div className="space-y-4">
            {canEdit ? (
              <form onSubmit={handleUpdateClasse} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={selectedClasse.nom}
                    onChange={(e) => setSelectedClasse({ ...selectedClasse, nom: e.target.value })}
                    className="p-2 border rounded"
                    required
                  />
                  <select
                    value={selectedClasse.type}
                    onChange={(e) => setSelectedClasse({ ...selectedClasse, type: e.target.value as 'Arabe' | 'Français' })}
                    className="p-2 border rounded"
                    required
                  >
                    <option value="Français">Français</option>
                    <option value="Arabe">Arabe</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Mettre à jour
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirmation(true)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                </div>
              </form>
            ) : (
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Détails de la classe</h3>
                <p>Nom: {selectedClasse.nom}</p>
                <p>Type: {selectedClasse.type}</p>
              </div>
            )}

            {showDeleteConfirmation && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
                <p className="text-red-700 mb-4">
                  Êtes-vous sûr de vouloir supprimer cette classe ? Cette action est irréversible.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowDeleteConfirmation(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleDeleteClasse}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Confirmer la suppression
                  </button>
                </div>
              </div>
            )}

            {canEdit && (
              <>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Ajouter un élève</h3>
                  <div className="flex space-x-4">
                    <select
                      value={selectedEleveId}
                      onChange={(e) => setSelectedEleveId(e.target.value)}
                      className="flex-1 p-2 border rounded"
                    >
                      <option value="">Sélectionnez un élève</option>
                      {eleves
                        .filter(e => e.classeArabe !== selectedClasse.id && e.classeFrancais !== selectedClasse.id)
                        .map((eleve) => (
                          <option key={eleve.id} value={eleve.id}>
                            {eleve.nom} {eleve.prenom}
                          </option>
                        ))}
                    </select>
                    <button
                      onClick={handleAddEleveToClasse}
                      className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                      disabled={!selectedEleveId}
                    >
                      Ajouter l'élève
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Affecter un professeur</h3>
                  <div className="flex space-x-4">
                    <select
                      value={selectedProfesseurId}
                      onChange={(e) => setSelectedProfesseurId(e.target.value)}
                      className="flex-1 p-2 border rounded"
                    >
                      <option value="">Sélectionnez un professeur</option>
                      {professeurs.map((prof) => (
                        <option key={prof.id} value={prof.id}>
                          {prof.nom} {prof.prenom} - {prof.matiere}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAssignProfesseurToClasse}
                      className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      disabled={!selectedProfesseurId}
                    >
                      Affecter le professeur
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Élèves de la classe</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Prénom</TableHead>
                    <TableHead>Numéro d'immatriculation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getElevesForClasse(selectedClasse.id).map((eleve) => (
                    <TableRow key={eleve.id}>
                      <TableCell>{eleve.nom}</TableCell>
                      <TableCell>{eleve.prenom}</TableCell>
                      <TableCell>{eleve.numeroImmatriculation}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Professeur de la classe</h3>
              {getProfesseurForClasse(selectedClasse.id) ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Prénom</TableHead>
                      <TableHead>Matière</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>{getProfesseurForClasse(selectedClasse.id)?.nom}</TableCell>
                      <TableCell>{getProfesseurForClasse(selectedClasse.id)?.prenom}</TableCell>
                      <TableCell>{getProfesseurForClasse(selectedClasse.id)?.matiere}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500 italic">Aucun professeur assigné à cette classe.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionClasses;