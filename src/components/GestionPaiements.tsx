import React, { useState } from 'react';
import { Eleve, Paiement } from '../types';
import RecuPaiement from './RecuPaiement';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Alert } from './ui/Alert';
import { Search, Filter } from 'lucide-react';

export const GestionPaiements: React.FC<{
  eleves: Eleve[];
  paiements: Paiement[];
  ajouterPaiement: (eleveId: string, paiement: Omit<Paiement, 'id'>) => Promise<void>;
}> = ({ eleves, paiements, ajouterPaiement }) => {
  const [eleveSelectionne, setEleveSelectionne] = useState<string>('');
  const [typePaiement, setTypePaiement] = useState<'Inscription' | 'Mensualité' | 'Tenue'>('Mensualité');
  const [montant, setMontant] = useState<number>(0);
  const [mois, setMois] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [recuPaiement, setRecuPaiement] = useState<Paiement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('');

  const validateForm = () => {
    if (!eleveSelectionne) {
      throw new Error("Veuillez sélectionner un élève");
    }

    if (montant <= 0) {
      throw new Error("Le montant doit être supérieur à 0");
    }

    if (typePaiement === 'Mensualité' && !mois) {
      throw new Error("Veuillez sélectionner un mois pour le paiement mensuel");
    }

    if (typePaiement === 'Tenue' && !description.trim()) {
      throw new Error("Veuillez ajouter une description pour la tenue");
    }
  };

  const resetForm = () => {
    setEleveSelectionne('');
    setTypePaiement('Mensualité');
    setMontant(0);
    setMois('');
    setDescription('');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      validateForm();

      const nouvellePaiement: Omit<Paiement, 'id'> = {
        eleveId: eleveSelectionne,
        date: new Date().toISOString().split('T')[0],
        montant,
        type: typePaiement,
        mois: typePaiement === 'Mensualité' ? mois : undefined,
        description: typePaiement === 'Tenue' ? description : undefined
      };

      await ajouterPaiement(eleveSelectionne, nouvellePaiement);
      
      // Générer le reçu de paiement avec l'ID temporaire
      setRecuPaiement({ ...nouvellePaiement, id: Date.now().toString() });
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur s'est produite lors de l'enregistrement du paiement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEleveInfo = (eleveId: string) => {
    const eleve = eleves.find(e => e.id === eleveId);
    if (!eleve) return { nom: 'Élève inconnu', details: '' };
    return {
      nom: `${eleve.nom} ${eleve.prenom}`,
      details: `N° ${eleve.numeroImmatriculation}`
    };
  };

  const formatPaiementDetails = (paiement: Paiement) => {
    if (paiement.type === 'Mensualité' && paiement.mois) {
      return new Date(paiement.mois + '-01').toLocaleString('default', { 
        month: 'long', 
        year: 'numeric' 
      });
    }
    if (paiement.type === 'Tenue' && paiement.description) {
      return paiement.description;
    }
    return '-';
  };

  // Filtrer et trier les paiements
  const filteredPaiements = paiements
    .filter(paiement => {
      const eleve = eleves.find(e => e.id === paiement.eleveId);
      if (!eleve) return false;

      const matchesSearch = searchTerm === '' || 
        eleve.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eleve.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eleve.numeroImmatriculation.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filterType === '' || paiement.type === filterType;

      return matchesSearch && matchesType;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gestion des Paiements</h2>
      
      {error && (
        <Alert
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        <div>
          <label htmlFor="eleve" className="block text-sm font-medium text-gray-700">
            Élève
          </label>
          <select
            id="eleve"
            value={eleveSelectionne}
            onChange={(e) => setEleveSelectionne(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Sélectionnez un élève</option>
            {eleves.map((eleve) => (
              <option key={eleve.id} value={eleve.id}>
                {eleve.nom} {eleve.prenom} - {eleve.numeroImmatriculation}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="typePaiement" className="block text-sm font-medium text-gray-700">
            Type de paiement
          </label>
          <select
            id="typePaiement"
            value={typePaiement}
            onChange={(e) => setTypePaiement(e.target.value as 'Inscription' | 'Mensualité' | 'Tenue')}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="Mensualité">Mensualité</option>
            <option value="Inscription">Inscription</option>
            <option value="Tenue">Tenue</option>
          </select>
        </div>

        {typePaiement === 'Mensualité' && (
          <div>
            <label htmlFor="mois" className="block text-sm font-medium text-gray-700">
              Mois
            </label>
            <input
              type="month"
              id="mois"
              value={mois}
              onChange={(e) => setMois(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        )}

        {typePaiement === 'Tenue' && (
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description de la tenue"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
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
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${isSubmitting 
              ? 'bg-indigo-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            }`}
        >
          {isSubmitting ? 'Enregistrement...' : 'Enregistrer le paiement'}
        </button>
      </form>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Historique des Paiements</h3>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher par nom d'élève ou numéro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full p-2 border rounded-md"
              />
            </div>
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="">Tous les types</option>
            <option value="Inscription">Inscription</option>
            <option value="Mensualité">Mensualité</option>
            <option value="Tenue">Tenue</option>
          </select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Élève</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Détails</TableHead>
              <TableHead>Montant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPaiements.map((paiement) => {
              const eleveInfo = getEleveInfo(paiement.eleveId);
              return (
                <TableRow key={paiement.id}>
                  <TableCell>{new Date(paiement.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="font-medium">{eleveInfo.nom}</div>
                    <div className="text-sm text-gray-500">{eleveInfo.details}</div>
                  </TableCell>
                  <TableCell>{paiement.type}</TableCell>
                  <TableCell>{formatPaiementDetails(paiement)}</TableCell>
                  <TableCell>{paiement.montant} FCFA</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {recuPaiement && (
        <RecuPaiement
          paiement={recuPaiement}
          eleve={eleves.find(e => e.id === recuPaiement.eleveId)}
          onClose={() => setRecuPaiement(null)}
        />
      )}
    </div>
  );
};

export default GestionPaiements;