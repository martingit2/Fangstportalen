import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import { setupInterceptors } from './services/apiService';
import { useEffect } from 'react';
import NySluttseddelPage from './pages/NySluttseddelPage';
import AppLayout from './components/AppLayout';
import NyOrdrePage from './pages/NyOrdrePage';

function App() {
  const { loginWithRedirect, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    setupInterceptors(getAccessTokenSilently);
  }, [getAccessTokenSilently]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage onLogin={() => loginWithRedirect()} />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/sluttsedler" element={<div>Sluttsedler Side (TODO)</div>} />
            <Route path="/ordrer" element={<div>Ordrer Side (TODO)</div>} />
            <Route path="/statistikk" element={<div>Statistikk Side (TODO)</div>} />
            <Route path="/kart" element={<div>Kart Side (TODO)</div>} />
            <Route path="/innstillinger" element={<div>Innstillinger Side (TODO)</div>} />
            <Route path="/ny-sluttseddel" element={<NySluttseddelPage />} />
            <Route path="/ny-ordre" element={<NyOrdrePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;