import React, { useState, useEffect } from 'react';
import { Eleve, Classe } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface FormulaireProfesseurProps {
  eleve?: Eleve;
  classes: Classe[];
  onSubmit: (eleve: Omit<Eleve, 'id'>) => void;
  onCancel: () => void;
}

export const FormulaireEleve: React.FC<FormulaireProfesseurProps> = ({ 
  eleve, 
  classes, 
  onSubmit, 
  onCancel 
}) => {
  const [numeroImmatriculation, setNumeroImmatriculation] = useState(eleve?.numeroImmatriculation || '');
  const [nom, setNom] = useState(eleve?.nom || '');
  const [prenom, setPrenom] = useState(eleve?.prenom || '');
  const [dateNaissance, setDateNaissance] = useState(eleve?.dateNaissance || '');
  const [classeArabe, setClasseArabe] = useState<string>(eleve?.classeArabe || 'none');
  const [classeFrancais, setClasseFrancais] = useState<string>(eleve?.classeFrancais || 'none');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (eleve) {
      setNumeroImmatriculation(eleve.numeroImmatriculation);
      setNom(eleve.nom);
      setPrenom(eleve.prenom);
      setDateNaissance(eleve.dateNaissance);
      setClasseArabe(eleve.classeArabe || 'none');
      setClasseFrancais(eleve.classeFrancais || 'none');
    }
  }, [eleve]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!numeroImmatriculation.trim()) {
      newErrors.numeroImmatriculation = "Le numéro d'immatriculation est requis";
    }
    if (!nom.trim()) {
      newErrors.nom = "Le nom est requis";
    }
    if (!prenom.trim()) {
      newErrors.prenom = "Le prénom est requis";
    }
    if (!dateNaissance) {
      newErrors.dateNaissance = "La date de naissance est requise";
    }
    if (classeArabe === 'none' && classeFrancais === 'none') {
      newErrors.classe = "Au moins une classe (Arabe ou Français) doit être sélectionnée";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit({
      numeroImmatriculation,
      nom,
      prenom,
      dateNaissance,
      classeArabe: classeArabe === 'none' ? undefined : classeArabe,
      classeFrancais: classeFrancais === 'none' ? undefined : classeFrancais
    });
  };

  const classesArabes = classes.filter(c => c.type === 'Arabe');
  const classesFrancaises = classes.filter(c => c.type === 'Français');

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="numeroImmatriculation" className="block text-sm font-medium text-gray-700">
            Numéro d'immatriculation *
          </label>
          <input
            type="text"
            id="numeroImmatriculation"
            value={numeroImmatriculation}
            onChange={(e) => setNumeroImmatriculation(e.target.value)}
            className={`mt-1 block w-full rounded-md border ${
              errors.numeroImmatriculation ? 'border-red-500' : 'border-gray-300'
            } p-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
          />
          {errors.numeroImmatriculation && (
            <p className="mt-1 text-sm text-red-500">{errors.numeroImmatriculation}</p>
          )}
        </div>

        <div>
          <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
            Nom *
          </label>
          <input
            type="text"
            id="nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className={`mt-1 block w-full rounded-md border ${
              errors.nom ? 'border-red-500' : 'border-gray-300'
            } p-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
          />
          {errors.nom && (
            <p className="mt-1 text-sm text-red-500">{errors.nom}</p>
          )}
        </div>

        <div>
          <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
            Prénom *
          </label>
          <input
            type="text"
            id="prenom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            className={`mt-1 block w-full rounded-md border ${
              errors.prenom ? 'border-red-500' : 'border-gray-300'
            } p-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
          />
          {errors.prenom && (
            <p className="mt-1 text-sm text-red-500">{errors.prenom}</p>
          )}
        </div>

        <div>
          <label htmlFor="dateNaissance" className="block text-sm font-medium text-gray-700">
            Date de naissance *
          </label>
          <input
            type="date"
            id="dateNaissance"
            value={dateNaissance}
            onChange={(e) => setDateNaissance(e.target.value)}
            className={`mt-1 block w-full rounded-md border ${
              errors.dateNaissance ? 'border-red-500' : 'border-gray-300'
            } p-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
          />
          {errors.dateNaissance && (
            <p className="mt-1 text-sm text-red-500">{errors.dateNaissance}</p>
          )}
        </div>

        <div>
          <label htmlFor="classeArabe" className="block text-sm font-medium text-gray-700">
            Classe Arabe
          </label>
          <Select value={classeArabe} onValueChange={setClasseArabe}>
            <SelectTrigger className={`w-full ${errors.classe ? 'border-red-500' : ''}`}>
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
            <SelectTrigger className={`w-full ${errors.classe ? 'border-red-500' : ''}`}>
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
      </div>

      {errors.classe && (
        <p className="text-sm text-red-500">{errors.classe}</p>
      )}

      <div className="flex justify-end space-x-4 mt-6">
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
          {eleve ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
};

export default FormulaireEleve;