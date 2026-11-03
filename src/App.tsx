import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { AppState, User } from './types';
import { loadState, saveState, generateId } from './store';
import Dashboard from './pages/Dashboard';
import Organizations from './pages/Organizations';
import Systems from './pages/Systems';
import Claims from './pages/Claims';
import Regulations from './pages/Regulations';
import Controls from './pages/Controls';
import Laboratory from './pages/Laboratory';
import Evidence from './pages/Evidence';
import Reviews from './pages/Reviews';
import Reports from './pages/Reports';
import Recovery from './pages/Recovery';
import Demo from './pages/Demo';
import Admin from './pages/Admin';
import Mercadona from './pages/Mercadona';
import Login from './pages/Login';
import { Shield, LayoutDashboard, Building2, Cpu, MessageSquare, Scale, CheckSquare, FlaskConical, FileSearch, Eye, FileText, RefreshCw, Monitor, Settings, Menu, X, LogOut } from 'lucide-react';

interface AppContextType {
  state: AppState;
  setState: (fn: (prev: AppState) => AppState) => void;
  user: User | null;
  login: (email: string) => boolean;
  logout: () => void;
  addAuditEvent: (action: string, resource: string, resourceId: string, details: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);
export const useApp = () => { const ctx = useContext(AppContext); if (!ctx) throw new Error('No context'); return ctx; };

const navItems = [
  { id: 'dashboard', label: 'Centro de Mando', icon: LayoutDashboard },
  { id: 'organizations', label: 'Organizaciones', icon: Building2 },
  { id: 'systems', label: 'Sistemas Tecnológicos', icon: Cpu },
  { id: 'claims', label: 'Afirmaciones', icon: MessageSquare },
  { id: 'regulations', label: 'Normativa', icon: Scale },
  { id: 'controls', label: 'Controles', icon: CheckSquare },
  { id: 'laboratory', label: 'Laboratorio', icon: FlaskConical },
  { id: 'evidence', label: 'Evidencias', icon: FileSearch },
  { id: 'reviews', label: 'Revisiones', icon: Eye },
  { id: 'reports', label: 'Informes', icon: FileText },
  { id: 'recovery', label: 'Recuperación', icon: RefreshCw },
  { id: 'demo', label: 'Demostración', icon: Monitor },
  { id: 'mercadona', label: 'Observatorio', icon: FileSearch },
  { id: 'admin', label: 'Administración', icon: Settings },
];

function App() {
  const [state, setStateRaw] = useState<AppState>(loadState);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { saveState(state); }, [state]);

  const setState = (fn: (prev: AppState) => AppState) => {
    setStateRaw(prev => fn(prev));
  };

  const login = (email: string): boolean => {
    const user = state.users.find(u => u.email === email && u.active);
    if (user) {
      setState(prev => ({ ...prev, currentUser: { ...user, lastLogin: new Date().toISOString() } }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setState(prev => ({ ...prev, currentUser: null }));
  };

  const addAuditEvent = (action: string, resource: string, resourceId: string, details: string) => {
    setState(prev => ({
      ...prev,
      auditEvents: [...prev.auditEvents, {
        id: generateId(), timestamp: new Date().toISOString(),
        userId: prev.currentUser?.id || 'system', action, resource, resourceId, details
      }]
    }));
  };

  const ctx: AppContextType = { state, setState, user: state.currentUser, login, logout, addAuditEvent };

  if (!state.currentUser) {
    return <AppContext.Provider value={ctx}><Login /></AppContext.Provider>;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'organizations': return <Organizations />;
      case 'systems': return <Systems />;
      case 'claims': return <Claims />;
      case 'regulations': return <Regulations />;
      case 'controls': return <Controls />;
      case 'laboratory': return <Laboratory />;
      case 'evidence': return <Evidence />;
      case 'reviews': return <Reviews />;
      case 'reports': return <Reports />;
      case 'recovery': return <Recovery />;
      case 'demo': return <Demo />;
      case 'mercadona': return <Mercadona />;
      case 'admin': return <Admin />;
      default: return <Dashboard />;
    }
  };

  return (
    <AppContext.Provider value={ctx}>
      <div className="flex h-screen overflow-hidden bg-ivory-50">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-blue-gray-900 text-white transform transition-transform duration-200 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center gap-2 px-4 py-4 border-b border-blue-gray-700">
            <Shield className="w-7 h-7 text-sage-400" />
            <div>
              <h1 className="text-sm font-bold tracking-wide">SAE VERITAS</h1>
              <p className="text-[10px] text-blue-gray-300">Verificación Independiente</p>
            </div>
          </div>
          <nav className="overflow-y-auto h-[calc(100vh-120px)] scrollbar-thin py-2">
            {navItems.map(item => (
              <button key={item.id} onClick={() => { setCurrentPage(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${currentPage === item.id ? 'bg-blue-gray-700 text-sage-300 border-r-2 border-sage-400' : 'text-blue-gray-200 hover:bg-blue-gray-800 hover:text-white'}`}>
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white border-b border-blue-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-1 rounded hover:bg-blue-gray-100">
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <h2 className="text-lg font-semibold text-blue-gray-800">
                {navItems.find(n => n.id === currentPage)?.label || 'Centro de Mando'}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-medium text-blue-gray-700">{state.currentUser.name}</p>
                <p className="text-[10px] text-blue-gray-500">{state.currentUser.role}</p>
              </div>
              <button onClick={logout} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors">
                <LogOut className="w-3 h-3" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-ivory-50">
            {renderPage()}
          </main>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      </div>
    </AppContext.Provider>
  );
}

export default App;
