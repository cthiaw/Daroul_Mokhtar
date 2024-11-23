import React from 'react';
import { X } from 'lucide-react';

interface AlertProps {
  message: string;
  type?: 'error' | 'success' | 'warning';
  onClose: () => void;
}

export const Alert: React.FC<AlertProps> = ({ message, type = 'error', onClose }) => {
  const bgColor = {
    error: 'bg-red-100 border-red-400 text-red-700',
    success: 'bg-green-100 border-green-400 text-green-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
  }[type];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className={`relative p-4 rounded-lg border ${bgColor} max-w-md w-full mx-4`}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="text-lg font-semibold mb-2">
              {type === 'error' ? 'Erreur' : type === 'success' ? 'Succès' : 'Attention'}
            </p>
            <p>{message}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-gray-600 hover:text-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};