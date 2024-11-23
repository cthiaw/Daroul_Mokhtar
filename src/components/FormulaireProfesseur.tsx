import React, { useState, useEffect } from 'react';
import { Professeur, Classe } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface FormulaireProfesseurProps {
  professeur?: Professeur;
  classes: Classe[];
  onSubmit: (professeur: Omit<Professeur, 'id'>) => void;
  onCancel: () => void;
}

export const FormulaireProfesseur: React.FC<FormulaireProfesseurProps> = ({ 
  professeur, 
  classes, 
  onSubmit, 
  onCancel 
}) => {
  const [numeroImmatriculation, setNumeroImmatriculation] = useState(professeur?.numeroImmatriculation || '');
  const [nom, setNom] = useState(professeur?.nom || '');
  const [prenom, setPrenom] = useState(professeur?.prenom || '');
  const [matiere, setMatiere] = useState(professeur?.matiere || '');
  const [classeArabe, setClasseArabe] = useState<string>(professeur?.classeArabe || 'none');
  const [classeFrancais, setClasseFrancais] = useState<string>(professeur?.classeFrancais || 'none');

  useEffect(() => {
    if (professeur) {
      setNumeroImmatriculation(professeur.numeroImmatriculation);
      setNom(professeur.nom);
      setPrenom(professeur.prenom);
      setMatiere(professeur.matiere || '');
      setClasseArabe(professeur.classeArabe || 'none');
      setClasseFrancais(professeur.classeFrancais || 'none');
    }
  }, [professeur]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find the actual class objects
    const selectedClasseArabe = classes.find(c => c.id === classeArabe && c.type === 'Arabe');
    const selectedClasseFrancais = classes.find(c => c.id === classeFrancais && c.type === 'Français');

    onSubmit({
      numeroImmatriculation,
      nom,
      prenom,
      matiere: matiere || undefined,
      classeArabe: selectedClasseArabe?.id,
      classeFrancais: selectedClasseFrancais?.id
    });
  };

  const classesArabes = classes.filter(c => c.type === 'Arabe');
  const classesFrancaises = classes.filter(c => c.type === 'Français');

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label htmlFor="numeroImmatriculation" className="block text-sm font-medium text-gray-700">
          Numéro d'immatriculation
        </label>
        <input
          type="text"
          id="numeroImmatriculation"
          value={numeroImmatriculation}
          onChange={(e) => setNumeroImmatriculation(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
          Nom
        </label>
        <input
          type="text"
          id="nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
          Prénom
        </label>
        <input
          type="text"
          id="prenom"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label htmlFor="matiere" className="block text-sm font-medium text-gray-700">
          Matière
        </label>
        <input
          type="text"
          id="matiere"
          value={matiere}
          onChange={(e) => setMatiere(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label htmlFor="classeArabe" className="block text-sm font-medium text-gray-700">
          Classe Arabe
        </label>
        <Select value={classeArabe} onValueChange={setClasseArabe}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionnez une classe arabe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Aucune classe</SelectItem>
            {classesArabes.map((classe) => (
              <SelectItem key={classe.id} value={classe.id}>
                {classe.nom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="classeFrancais" className="block text-sm font-medium text-gray-700">
          Classe Français
        </label>
        <Select value={classeFrancais} onValueChange={setClasseFrancais}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionnez une classe française" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Aucune classe</SelectItem>
            {classesFrancaises.map((classe) => (
              <SelectItem key={classe.id} value={classe.id}>
                {classe.nom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {professeur ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
};

export default FormulaireProfesseur;