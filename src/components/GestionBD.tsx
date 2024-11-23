import React, { useState } from 'react';
import { collections } from '../db/firebase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { getDocs } from 'firebase/firestore';
import { Alert } from './ui/Alert';
import { Download } from 'lucide-react';

export const GestionBD: React.FC = () => {
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [collectionData, setCollectionData] = useState<any[]>([]);
  const [classesData, setClassesData] = useState<any[]>([]);
  const [elevesData, setElevesData] = useState<any[]>([]);
  const [usersData, setUsersData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const collectionNames = Object.keys(collections);

  const loadCollectionData = async (collectionName: string) => {
    setLoading(true);
    setError(null);
    try {
      // Load reference data first
      const classesSnapshot = await getDocs(collections.classes);
      const classes = classesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setClassesData(classes);

      const elevesSnapshot = await getDocs(collections.eleves);
      const eleves = elevesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setElevesData(eleves);

      const usersSnapshot = await getDocs(collections.users);
      const users = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsersData(users);

      // Load selected collection data
      const snapshot = await getDocs(collections[collectionName as keyof typeof collections]);
      let data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Transform data based on collection type
      if (collectionName === 'professeurs' || collectionName === 'eleves') {
        data = data.map(item => ({
          ...item,
          classeArabe: classes.find(c => c.id === item.classeArabe && c.type === 'Arabe')?.nom || '-',
          classeFrancais: classes.find(c => c.id === item.classeFrancais && c.type === 'Français')?.nom || '-'
        }));
      } else if (collectionName === 'paiements') {
        data = data.map(paiement => {
          const eleve = eleves.find(e => e.id === paiement.eleveId);
          return {
            ...paiement,
            eleveId: eleve ? `${eleve.numeroImmatriculation} - ${eleve.nom} ${eleve.prenom}` : 'Élève inconnu'
          };
        });
      } else if (collectionName === 'depenses') {
        data = data.map(depense => {
          const user = users.find(u => u.id === depense.userId);
          return {
            ...depense,
            userId: user ? user.username : 'Utilisateur inconnu'
          };
        });
      }

      setCollectionData(data);
      setSelectedCollection(collectionName);
    } catch (err) {
      console.error('Error loading collection:', err);
      setError('Error loading collection data. Please try again.');
      setCollectionData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const allData: Record<string, any[]> = {};
      
      // Export all collections with original data (not transformed)
      for (const collectionName of collectionNames) {
        const snapshot = await getDocs(collections[collectionName as keyof typeof collections]);
        allData[collectionName] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      }

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `database_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
      setError('Failed to export database');
    }
  };

  const renderTableData = () => {
    if (!collectionData.length) return null;

    const columns = Object.keys(collectionData[0]).filter(key => key !== 'password');

    return (
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(column => (
              <TableHead key={column}>{column}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {collectionData.map((row, index) => (
            <TableRow key={row.id || index}>
              {columns.map(column => (
                <TableCell key={column}>
                  {typeof row[column] === 'object' 
                    ? JSON.stringify(row[column]) 
                    : String(row[column])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion de la Base de Données</h2>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <Download className="h-5 w-5" />
          Exporter la base de données
        </button>
      </div>

      {error && (
        <Alert
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
      )}

      <div className="flex flex-wrap gap-4 mb-6">
        {collectionNames.map(name => (
          <button
            key={name}
            onClick={() => loadCollectionData(name)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCollection === name
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : selectedCollection ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">
              Collection: {selectedCollection}
            </h3>
          </div>
          <div className="p-6 overflow-x-auto">
            {renderTableData()}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">
          Select a collection to view its data
        </p>
      )}
    </div>
  );
};

export default GestionBD;