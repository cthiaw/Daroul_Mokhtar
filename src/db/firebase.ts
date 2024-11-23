import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  DocumentData
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { User, Eleve, Professeur, Classe, Paiement, Depense } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyCQsw9MDfOt57TS38WkajotAcuMLImsIsI",
  authDomain: "daroulmokhtardb.firebaseapp.com",
  projectId: "daroulmokhtardb",
  storageBucket: "daroulmokhtardb.firebasestorage.app",
  messagingSenderId: "618645683921",
  appId: "1:618645683921:web:09bec6024878a3fa318ff0"
};

export const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

export const auth = getAuth(app);

export const collections = {
  users: collection(db, 'users'),
  eleves: collection(db, 'eleves'),
  professeurs: collection(db, 'professeurs'),
  classes: collection(db, 'classes'),
  paiements: collection(db, 'paiements'),
  depenses: collection(db, 'depenses')
};

export async function initializeDatabase() {
  try {
    const userSnapshot = await getDocs(collections.users);
    if (userSnapshot.empty) {
      await addDoc(collections.users, {
        username: 'admin',
        password: 'superadmin123',
        role: 'superadmin'
      });
    }

    const classSnapshot = await getDocs(collections.classes);
    if (classSnapshot.empty) {
      const classesData = [
        { nom: 'PS', type: 'Français' },
        { nom: 'GS', type: 'Français' },
        { nom: 'CI', type: 'Français' },
        { nom: 'CP', type: 'Français' },
        { nom: 'CE1', type: 'Français' },
        { nom: 'CE2', type: 'Français' },
        { nom: 'CM1', type: 'Français' },
        { nom: 'CM2', type: 'Français' },
        { nom: 'PS', type: 'Arabe' },
        { nom: 'GS', type: 'Arabe' },
        { nom: 'CI', type: 'Arabe' },
        { nom: 'CP', type: 'Arabe' },
        { nom: 'CE1', type: 'Arabe' },
        { nom: 'CE2', type: 'Arabe' },
        { nom: 'CM1', type: 'Arabe' },
        { nom: 'CM2', type: 'Arabe' }
      ];

      for (const classe of classesData) {
        await addDoc(collections.classes, classe);
      }
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

function sanitizeData(data: any): any {
  if (!data) return null;
  
  const cleaned = { ...data };
  
  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === undefined) {
      delete cleaned[key];
    }
  });
  
  return cleaned;
}

async function getAll<T extends DocumentData>(collectionRef: any): Promise<T[]> {
  try {
    const snapshot = await getDocs(collectionRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as T[];
  } catch (error) {
    console.error('Error getting documents:', error);
    throw error;
  }
}

async function add<T extends DocumentData>(collectionRef: any, data: Omit<T, 'id'>): Promise<string> {
  try {
    const cleanedData = sanitizeData(data);
    const docRef = await addDoc(collectionRef, cleanedData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding document:', error);
    throw error;
  }
}

async function update<T extends DocumentData>(collectionRef: any, id: string, data: Partial<T>): Promise<void> {
  try {
    const cleanedData = sanitizeData(data);
    const docRef = doc(collectionRef, id);
    await updateDoc(docRef, cleanedData);
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
}

async function remove(collectionRef: any, id: string): Promise<void> {
  try {
    const docRef = doc(collectionRef, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error removing document:', error);
    throw error;
  }
}

export const db_operations = {
  users: {
    getAll: () => getAll<User>(collections.users),
    add: (data: Omit<User, 'id'>) => add<User>(collections.users, data),
    update: (id: string, data: Partial<User>) => update<User>(collections.users, id, data),
    remove: (id: string) => remove(collections.users, id),
    findByUsername: async (username: string): Promise<User | null> => {
      try {
        const q = query(collections.users, where("username", "==", username));
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() } as User;
      } catch (error) {
        console.error('Error finding user by username:', error);
        throw error;
      }
    }
  },
  eleves: {
    getAll: () => getAll<Eleve>(collections.eleves),
    add: (data: Omit<Eleve, 'id'>) => add<Eleve>(collections.eleves, data),
    update: (id: string, data: Partial<Eleve>) => update<Eleve>(collections.eleves, id, data),
    remove: (id: string) => remove(collections.eleves, id)
  },
  professeurs: {
    getAll: () => getAll<Professeur>(collections.professeurs),
    add: (data: Omit<Professeur, 'id'>) => add<Professeur>(collections.professeurs, data),
    update: (id: string, data: Partial<Professeur>) => update<Professeur>(collections.professeurs, id, data),
    remove: (id: string) => remove(collections.professeurs, id)
  },
  classes: {
    getAll: () => getAll<Classe>(collections.classes),
    add: (data: Omit<Classe, 'id'>) => add<Classe>(collections.classes, data),
    update: (id: string, data: Partial<Classe>) => update<Classe>(collections.classes, id, data),
    remove: (id: string) => remove(collections.classes, id)
  },
  paiements: {
    getAll: () => getAll<Paiement>(collections.paiements),
    add: async (data: Omit<Paiement, 'id'>) => {
      const paiementData = {
        eleveId: data.eleveId,
        date: data.date,
        montant: Number(data.montant),
        type: data.type,
        ...(data.type === 'Mensualité' && data.mois ? { mois: data.mois } : {}),
        ...(data.type === 'Tenue' && data.description ? { description: data.description } : {})
      };
      return add<Paiement>(collections.paiements, paiementData);
    },
    update: (id: string, data: Partial<Paiement>) => update<Paiement>(collections.paiements, id, data),
    remove: (id: string) => remove(collections.paiements, id)
  },
  depenses: {
    getAll: () => getAll<Depense>(collections.depenses),
    add: (data: Omit<Depense, 'id'>) => add<Depense>(collections.depenses, data),
    update: (id: string, data: Partial<Depense>) => update<Depense>(collections.depenses, id, data),
    remove: (id: string) => remove(collections.depenses, id)
  }
};