import { ReactNode } from 'react';

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'superadmin' | 'admin' | 'user';
}

export interface Eleve {
  id: string;
  numeroImmatriculation: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  classeArabe?: string;
  classeFrancais?: string;
}

export interface Classe {
  id: string;
  nom: string;
  type: 'Arabe' | 'Français';
}

export interface Professeur {
  id: string;
  numeroImmatriculation: string;
  nom: string;
  prenom: string;
  matiere?: string;
  classeArabe?: string;
  classeFrancais?: string;
}

export interface Paiement {
  id: string;
  eleveId: string;
  date: string;
  montant: number;
  type: 'Inscription' | 'Mensualité' | 'Tenue';
  mois?: string;
  description?: string;
}

export interface Depense {
  id: string;
  date: string;
  montant: number;
  categorie: 'Salaire' | 'Electricité' | 'Eau' | 'Personnel' | 'Autre';
  description: string;
  userId: string;
}

export interface DashboardItem {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
}