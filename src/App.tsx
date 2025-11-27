// Application principale avec routing
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppProvider, useApp } from './contexts/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Tresorerie } from './pages/Tresorerie';
import { EtatsFinanciers } from './pages/EtatsFinanciers';
import { Parametres } from './pages/Parametres';
import { Aide } from './pages/Aide';
import { Onboarding } from './pages/Onboarding';

function AppRoutes() {
  const { firstLaunch, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (firstLaunch) {
    return (
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/tresorerie" element={<Tresorerie />} />
        <Route path="/etats-financiers" element={<EtatsFinanciers />} />
        <Route path="/parametres" element={<Parametres />} />
        <Route path="/aide" element={<Aide />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

function App() {
  // Détecter automatiquement le chemin de base depuis l'URL
  const getBasePath = () => {
    // Obtenir le chemin actuel
    const path = window.location.pathname;
    // Si on est à la racine exacte, retourner '/'
    if (path === '/') return '/';
    // Sinon, extraire le premier segment du chemin (le nom du dossier)
    const match = path.match(/^(\/[^\/]+)/);
    return match ? match[1] : '/';
  };

  return (
    <BrowserRouter basename={getBasePath()}>
      <ThemeProvider>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
