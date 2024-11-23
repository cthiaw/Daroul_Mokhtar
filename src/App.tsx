import React, { useState, useEffect } from 'react';
import { Eleve, Professeur, Classe, Paiement, Depense, User } from './types';
import ListeEleves from './components/ListeEleves';
import ListeProfesseurs from './components/ListeProfesseurs';
import { GestionPaiements } from './components/GestionPaiements';
import { GestionDepenses } from './components/GestionDepenses';
import { TableauBord } from './components/TableauBord';
import { Login } from './components/Login';
import { GestionUtilisateurs } from './components/GestionUtilisateurs';
import { GestionClasses } from './components/GestionClasses';
import { GestionBD } from './components/GestionBD';
import { School, Users, Menu, X, ChevronDown, LogOut, User as UserIcon } from 'lucide-react';
import { db_operations } from './db/firebase';
import { Alert } from './components/ui/Alert';

export const App: React.FC = () => {
  const [pageActive, setPageActive] = useState<string>('tableauBord');
  const [user, setUser] = useState<User | null>(null);
  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [professeurs, setProfesseurs] = useState<Professeur[]>([]);
  const [classes, setClasses] = useState<Classe[]>([]);
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [depenses, setDepenses] = useState<Depense[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const menuItems = [
    { id: 'tableauBord', label: 'Tableau de Bord', allowedRoles: ['admin', 'superadmin'] },
    { id: 'eleves', label: 'Élèves', allowedRoles: ['user', 'admin', 'superadmin'] },
    { id: 'professeurs', label: 'Professeurs', allowedRoles: ['user', 'admin', 'superadmin'] },
    { id: 'classes', label: 'Classes', allowedRoles: ['user', 'admin', 'superadmin'] },
    { id: 'paiements', label: 'Paiements', allowedRoles: ['user', 'admin', 'superadmin'] },
    { id: 'depenses', label: 'Dépenses', allowedRoles: ['user', 'admin', 'superadmin'] },
    { id: 'users', label: 'Utilisateurs', allowedRoles: ['superadmin'] },
    { id: 'database', label: 'Base de données', allowedRoles: ['superadmin'] }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        // Check for saved session
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }

        const [
          elevesData,
          professeursData,
          classesData,
          paiementsData,
          depensesData,
          usersData
        ] = await Promise.all([
          db_operations.eleves.getAll(),
          db_operations.professeurs.getAll(),
          db_operations.classes.getAll(),
          db_operations.paiements.getAll(),
          db_operations.depenses.getAll(),
          db_operations.users.getAll()
        ]);

        setEleves(elevesData);
        setProfesseurs(professeursData);
        setClasses(classesData);
        setPaiements(paiementsData);
        setDepenses(depensesData);
        setUsers(usersData);
      } catch (error) {
        setError('Error loading data. Please refresh the page.');
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Set initial page based on user role
  useEffect(() => {
    if (user?.role === 'user') {
      setPageActive('eleves');
    }
  }, [user]);

  const handleLogin = async (username: string, password: string) => {
    try {
      const foundUser = await db_operations.users.findByUsername(username);
      if (foundUser && foundUser.password === password) {
        setUser(foundUser);
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      setError('Login error. Please try again.');
      console.error('Login error:', error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    setPageActive('tableauBord');
    setUserMenuOpen(false);
  };

  const handlePageChange = (page: string) => {
    setPageActive(page);
    setMobileMenuOpen(false);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu')) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userMenuItems = menuItems.filter(item => 
    item.allowedRoles.includes(user?.role || '')
  );

  const renderContent = () => {
    if (!user) {
      return <Login onLogin={handleLogin} />;
    }

    // Check if user has access to the current page
    const currentMenuItem = menuItems.find(item => item.id === pageActive);
    if (!currentMenuItem?.allowedRoles.includes(user.role)) {
      setPageActive('eleves');
      return null;
    }

    switch (pageActive) {
      case 'tableauBord':
        return user.role !== 'user' ? 
          <TableauBord paiements={paiements} depenses={depenses} eleves={eleves} classes={classes} /> : 
          null;
      case 'eleves':
        return <ListeEleves 
          eleves={eleves} 
          classes={classes} 
          user={user}
          onAddEleve={db_operations.eleves.add} 
          onUpdateEleve={db_operations.eleves.update} 
          onDeleteEleve={db_operations.eleves.remove} 
        />;
      case 'professeurs':
        return <ListeProfesseurs 
          professeurs={professeurs} 
          classes={classes} 
          user={user}
          onAddProfesseur={db_operations.professeurs.add} 
          onUpdateProfesseur={db_operations.professeurs.update} 
          onDeleteProfesseur={db_operations.professeurs.remove} 
        />;
      case 'classes':
        return <GestionClasses 
          classes={classes} 
          eleves={eleves} 
          professeurs={professeurs} 
          user={user}
          onAddClasse={db_operations.classes.add} 
          onUpdateClasse={db_operations.classes.update} 
          onDeleteClasse={db_operations.classes.remove} 
          onAddEleveToClasse={() => {}} 
          onAssignProfesseurToClasse={() => {}} 
        />;
      case 'paiements':
        return <GestionPaiements 
          eleves={eleves} 
          paiements={paiements} 
          user={user}
          ajouterPaiement={db_operations.paiements.add} 
        />;
      case 'depenses':
        return <GestionDepenses 
          depenses={depenses} 
          users={users} 
          currentUser={user} 
          professeurs={professeurs} 
          ajouterDepense={db_operations.depenses.add} 
        />;
      case 'users':
        return user.role === 'superadmin' ? 
          <GestionUtilisateurs 
            users={users} 
            onAddUser={db_operations.users.add} 
            onUpdateUser={db_operations.users.update} 
            onDeleteUser={db_operations.users.remove} 
          /> : null;
      case 'database':
        return user.role === 'superadmin' ? <GestionBD /> : null;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Login onLogin={handleLogin} />
        {error && <Alert message={error} type="error" onClose={() => setError(null)} />}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {error && <Alert message={error} type="error" onClose={() => setError(null)} />}
      
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <School className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold">DAROUL MOKHTAR</span>
              </div>

              <div className="hidden md:ml-6 md:flex md:space-x-4">
                {userMenuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handlePageChange(item.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pageActive === item.id
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden md:ml-6 md:flex md:items-center">
              <div className="ml-3 relative user-menu">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                >
                  <UserIcon className="h-5 w-5 mr-2" />
                  <span className="mr-2">{user.username}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${userMenuOpen ? 'transform rotate-180' : ''}`} />
                </button>
                
                {userMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {userMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handlePageChange(item.id)}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    pageActive === item.id
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <UserIcon className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user.username}</div>
                  <div className="text-sm font-medium text-gray-500">{user.role}</div>
                </div>
              </div>
              <div className="mt-3 px-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;