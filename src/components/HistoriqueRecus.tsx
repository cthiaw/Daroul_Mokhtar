import React, { useState } from 'react';
import { Eleve, Paiement } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { X, Printer, Search } from 'lucide-react';

interface HistoriqueRecusProps {
  paiements: Paiement[];
  eleves: Eleve[];
  onClose: () => void;
  onSelectRecu: (paiement: Paiement) => void;
}

const HistoriqueRecus: React.FC<HistoriqueRecusProps> = ({
  paiements,
  eleves,
  onClose,
  onSelectRecu,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterDate, setFilterDate] = useState<string>('');

  const filteredPaiements = paiements.filter((paiement) => {
    const eleve = eleves.find((e) => e.id === paiement.eleveId);
    if (!eleve) return false;

    const matchesSearch = searchTerm === '' || 
      eleve.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eleve.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eleve.numeroImmatriculation.includes(searchTerm);

    const matchesType = filterType === '' || paiement.type === filterType;
    const matchesDate = filterDate === '' || paiement.date.includes(filterDate);

    return matchesSearch && matchesType && matchesDate;
  });

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl max-w-6xl w-full m-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Historique des Reçus</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, prénom ou numéro..."
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
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="p-2 border rounded-md"
            />
          </div>
        </div>

        <div className="overflow-auto max-h-[calc(100vh-300px)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>N° Reçu</TableHead>
                <TableHead>Élève</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPaiements.map((paiement) => {
                const eleve = eleves.find((e) => e.id === paiement.eleveId);
                if (!eleve) return null;

                return (
                  <TableRow key={paiement.id}>
                    <TableCell>{new Date(paiement.date).toLocaleDateString()}</TableCell>
                    <TableCell>{paiement.id}</TableCell>
                    <TableCell>
                      {eleve.nom} {eleve.prenom}
                      <br />
                      <span className="text-sm text-gray-500">
                        N° {eleve.numeroImmatriculation}
                      </span>
                    </TableCell>
                    <TableCell>{paiement.type}</TableCell>
                    <TableCell>{paiement.montant} FCFA</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onSelectRecu(paiement)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                        >
                          Voir
                        </button>
                        <button
                          onClick={() => {
                            onSelectRecu(paiement);
                            setTimeout(() => {
                              window.print();
                            }, 100);
                          }}
                          className="p-1 text-green-600 hover:text-green-800"
                        >
                          <Printer className="h-5 w-5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default HistoriqueRecus;