import React from 'react';
import { Eleve, Paiement } from '../types';
import { X, Printer } from 'lucide-react';

interface RecuPaiementProps {
  paiement: Paiement;
  eleve?: Eleve;
  onClose: () => void;
}

const RecuPaiement: React.FC<RecuPaiementProps> = ({ paiement, eleve, onClose }) => {
  if (!eleve) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center print:bg-white">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full m-4 print:shadow-none print:m-0">
        <div className="flex justify-between items-start mb-6 print:hidden">
          <button
            onClick={handlePrint}
            className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2"
          >
            <Printer className="h-5 w-5" />
            Imprimer
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">DAROUL MOKHTAR</h2>
          <p className="text-lg font-semibold">Reçu de Paiement</p>
        </div>
        
        <div className="space-y-2 mb-6">
          <p><strong>N° Reçu:</strong> {paiement.id}</p>
          <p><strong>Date:</strong> {new Date(paiement.date).toLocaleDateString()}</p>
          <p><strong>Élève:</strong> {eleve.nom} {eleve.prenom}</p>
          <p><strong>N° Immatriculation:</strong> {eleve.numeroImmatriculation}</p>
          <p><strong>Type de paiement:</strong> {paiement.type}</p>
          {paiement.type === 'Mensualité' && paiement.mois && (
            <p><strong>Mois:</strong> {new Date(paiement.mois + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
          )}
          {paiement.type === 'Tenue' && paiement.description && (
            <p><strong>Description:</strong> {paiement.description}</p>
          )}
          <p className="text-lg font-bold mt-4">
            <strong>Montant:</strong> {paiement.montant} FCFA
          </p>
        </div>
        
        <div className="mt-8 pt-4 border-t">
          <p className="text-center text-sm text-gray-600">Signature et cachet</p>
        </div>
      </div>
    </div>
  );
};

export default RecuPaiement;