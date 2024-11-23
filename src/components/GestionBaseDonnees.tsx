import React, { useState } from 'react';
import { collections } from '../db/database';
import { getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from '../db/firebase';
import { Alert } from './ui/Alert';

const GestionBaseDonnees: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const data: Record<string, any[]> = {};

      // Export data from all collections
      for (const [collectionName, collectionRef] of Object.entries(collections)) {
        const snapshot = await getDocs(collectionRef);
        data[collectionName] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      }

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `daroul_mokhtar_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setMessage('Export completed successfully!');
    } catch (err) {
      console.error('Export error:', err);
      setError('Failed to export data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      const batch = writeBatch(db);

      // Import data to all collections
      for (const [collectionName, documents] of Object.entries(data)) {
        if (!Array.isArray(documents)) continue;

        for (const document of documents) {
          const { id, ...docData } = document;
          const docRef = doc(collections[collectionName as keyof typeof collections], id);
          batch.set(docRef, docData);
        }
      }

      await batch.commit();
      setMessage('Import completed successfully!');
    } catch (err) {
      console.error('Import error:', err);
      setError('Failed to import data. Please check the file format and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gestion de la Base de Données</h2>

      {message && (
        <Alert
          message={message}
          type="success"
          onClose={() => setMessage(null)}
        />
      )}

      {error && (
        <Alert
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleExport}
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-white ${
            loading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Processing...' : 'Export Database'}
        </button>

        <label
          className={`px-4 py-2 rounded-lg text-white text-center cursor-pointer ${
            loading
              ? 'bg-green-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? 'Processing...' : 'Import Database'}
          <input
            type="file"
            onChange={handleImport}
            accept=".json"
            disabled={loading}
            className="hidden"
          />
        </label>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}
    </div>
  );
};

export default GestionBaseDonnees;