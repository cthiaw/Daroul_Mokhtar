import React from 'react';
import { DashboardItem, Paiement, Depense, Eleve, Classe } from '../types';
import { CreditCard, DollarSign, TrendingUp, TrendingDown, Users } from 'lucide-react';

export interface TableauBordProps {
  paiements: Paiement[];
  depenses: Depense[];
  eleves: Eleve[];
  classes: Classe[];
}

export const TableauBord: React.FC<TableauBordProps> = ({ paiements, depenses, eleves, classes }) => {
  const totalRecettes = paiements.reduce((sum, paiement) => sum + paiement.montant, 0);
  const totalDepenses = depenses.reduce((sum, depense) => sum + depense.montant, 0);
  const solde = totalRecettes - totalDepenses;

  const elevesParClasse = classes.map(classe => {
    const nombreEleves = eleves.filter(eleve => 
      eleve.classeArabe === classe.id || eleve.classeFrancais === classe.id
    ).length;
    return { ...classe, nombreEleves };
  });

  const dashboardItems: DashboardItem[] = [
    {
      title: 'Total Recettes',
      value: `${totalRecettes} FCFA`,
      icon: <TrendingUp className="h-8 w-8" />,
      color: 'bg-green-500',
    },
    {
      title: 'Total Dépenses',
      value: `${totalDepenses} FCFA`,
      icon: <TrendingDown className="h-8 w-8" />,
      color: 'bg-red-500',
    },
    {
      title: 'Solde',
      value: `${solde} FCFA`,
      icon: <DollarSign className="h-8 w-8" />,
      color: solde >= 0 ? 'bg-blue-500' : 'bg-yellow-500',
    },
    {
      title: 'Dernière Transaction',
      value: paiements.length > 0 || depenses.length > 0 ? 
        new Date(Math.max(
          ...paiements.map(p => new Date(p.date).getTime()),
          ...depenses.map(d => new Date(d.date).getTime())
        )).toLocaleDateString() : 
        'Aucune',
      icon: <CreditCard className="h-8 w-8" />,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tableau de Bord</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {dashboardItems.map((item, index) => (
          <div key={index} className={`${item.color} text-white p-4 rounded-lg shadow-md`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-2xl font-bold">{item.value}</p>
              </div>
              {item.icon}
            </div>
          </div>
        ))}
      </div>
      
      <h3 className="text-xl font-bold mb-4">Nombre d'élèves par classe</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {elevesParClasse.map((classe) => (
          <div key={classe.id} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{classe.nom} - {classe.type}</p>
                <p className="text-2xl font-bold">{classe.nombreEleves}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableauBord;