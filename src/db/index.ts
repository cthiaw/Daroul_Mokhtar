import { User, Eleve, Professeur, Classe, Paiement, Depense } from '../types';

class Database {
  // ... (previous code remains unchanged)

  initializeStudents() {
    const newStudents: Omit<Eleve, 'id'>[] = [
      { numeroImmatriculation: '001', nom: 'Diop', prenom: 'Mouhamed A.', dateNaissance: '', classeArabe: 3, classeFrancais: 4 },
      { numeroImmatriculation: '002', nom: 'Diallo', prenom: 'Oumou A.', dateNaissance: '', classeArabe: 9, classeFrancais: 10 },
      { numeroImmatriculation: '003', nom: 'Diallo', prenom: 'Fatima Z.', dateNaissance: '', classeArabe: 9, classeFrancais: 10 },
      { numeroImmatriculation: '004', nom: 'Faye', prenom: 'Maimouna', dateNaissance: '', classeArabe: 7, classeFrancais: 8 },
      { numeroImmatriculation: '005', nom: 'Faye', prenom: 'Astou', dateNaissance: '', classeArabe: 3, classeFrancais: 4 },
      { numeroImmatriculation: '006', nom: 'Dia', prenom: 'Souleymane', dateNaissance: '', classeArabe: 7, classeFrancais: 8 },
      { numeroImmatriculation: '007', nom: 'Diouf', prenom: 'Ibrahima', dateNaissance: '', classeArabe: 9, classeFrancais: 11 },
      { numeroImmatriculation: '008', nom: 'Diouf', prenom: 'Daba', dateNaissance: '', classeArabe: 1, classeFrancais: 2 },
      { numeroImmatriculation: '009', nom: 'Diouf', prenom: 'Moustapha', dateNaissance: '', classeArabe: 1, classeFrancais: 2 },
      { numeroImmatriculation: '010', nom: 'Mbaye', prenom: 'Thiaba', dateNaissance: '', classeArabe: 1, classeFrancais: 2 },
      { numeroImmatriculation: '011', nom: 'Sow', prenom: 'Marième', dateNaissance: '', classeArabe: 9, classeFrancais: 10 },
      { numeroImmatriculation: '012', nom: 'Sow', prenom: 'Ouleye', dateNaissance: '', classeArabe: 5, classeFrancais: 6 },
      { numeroImmatriculation: '013', nom: 'Diouf', prenom: 'Mama Saly', dateNaissance: '', classeArabe: 9, classeFrancais: 10 },
      { numeroImmatriculation: '014', nom: 'Diouf', prenom: 'Madjiguène', dateNaissance: '', classeArabe: 3, classeFrancais: 4 },
      { numeroImmatriculation: '015', nom: 'Diouf', prenom: 'Djiby', dateNaissance: '', classeArabe: 9, classeFrancais: 11 },
      { numeroImmatriculation: '016', nom: 'Ciss', prenom: 'Binta', dateNaissance: '', classeArabe: 11, classeFrancais: 12 },
      { numeroImmatriculation: '017', nom: 'Diouf', prenom: 'Amy', dateNaissance: '', classeArabe: 11, classeFrancais: 12 },
      { numeroImmatriculation: '018', nom: 'Ciss', prenom: 'Maimouna', dateNaissance: '', classeArabe: 5, classeFrancais: 6 },
      { numeroImmatriculation: '019', nom: 'Ba', prenom: 'Thierno Sadou', dateNaissance: '', classeArabe: 9, classeFrancais: 10 },
      { numeroImmatriculation: '020', nom: 'Diabaté', prenom: 'Ibrahima', dateNaissance: '', classeArabe: 5, classeFrancais: 6 },
      { numeroImmatriculation: '021', nom: 'Ciss', prenom: 'Khoudja', dateNaissance: '', classeArabe: 3, classeFrancais: 4 },
      { numeroImmatriculation: '022', nom: 'Ciss', prenom: 'Ibrahima', dateNaissance: '', classeArabe: 9, classeFrancais: 10 },
      { numeroImmatriculation: '023', nom: 'Ciss', prenom: 'Ibrahima', dateNaissance: '', classeArabe: 1, classeFrancais: 2 },
      { numeroImmatriculation: '024', nom: 'Ba', prenom: 'Aminata', dateNaissance: '', classeArabe: 5, classeFrancais: 6 },
      { numeroImmatriculation: '025', nom: 'Bah', prenom: 'Mamadou Lami', dateNaissance: '', classeArabe: 7, classeFrancais: 8 },
      { numeroImmatriculation: '026', nom: 'Souare', prenom: 'Mouhamed', dateNaissance: '', classeArabe: 7, classeFrancais: 8 },
      { numeroImmatriculation: '027', nom: 'Diallo', prenom: 'Fatima Binta', dateNaissance: '', classeArabe: 3, classeFrancais: 4 },
      { numeroImmatriculation: '028', nom: 'Samb', prenom: 'Mouhamed', dateNaissance: '', classeArabe: 5, classeFrancais: 8 },
      { numeroImmatriculation: '029', nom: 'Dia', prenom: 'Mouhamed', dateNaissance: '', classeArabe: 1, classeFrancais: 8 },
      { numeroImmatriculation: '030', nom: 'Marega', prenom: 'Awa', dateNaissance: '', classeArabe: 5, classeFrancais: 8 },
      { numeroImmatriculation: '031', nom: 'Marega', prenom: 'Matita', dateNaissance: '', classeArabe: 5, classeFrancais: 6 },
      { numeroImmatriculation: '032', nom: 'Pouye', prenom: 'Ibrahima', dateNaissance: '', classeArabe: 9, classeFrancais: 10 },
      { numeroImmatriculation: '033', nom: 'Diouf', prenom: 'Ya Khadija', dateNaissance: '', classeArabe: 9, classeFrancais: 10 },
      { numeroImmatriculation: '034', nom: 'Diouf', prenom: 'Ya Aicha', dateNaissance: '', classeArabe: 9, classeFrancais: 10 },
      { numeroImmatriculation: '035', nom: 'Diouf', prenom: 'Baye Daouda', dateNaissance: '', classeArabe: 3, classeFrancais: 4 },
      { numeroImmatriculation: '036', nom: 'Samb', prenom: 'Soumboulou', dateNaissance: '', classeArabe: 1, classeFrancais: 2 },
    ];

    newStudents.forEach(student => this.addEleve(student));
  }
}

export const db = new Database();