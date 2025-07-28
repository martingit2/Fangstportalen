import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import { setupInterceptors } from './services/apiService';
import { useEffect } from 'react';
import AppLayout from './components/AppLayout';
import NyOrdrePage from './pages/NyOrdrePage';
import NyFangstmeldingPage from './pages/NyFangstmeldingPage';
import RedigerOrdrePage from './pages/RedigerOrdrePage';
import RedigerFangstmeldingPage from './pages/RedigerFangstmeldingPage';
import NySluttseddelPage from './pages/NySluttseddelPage';
import OrdrerPage from './pages/OrdrerPage';

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
            <Route path="/ny-sluttseddel" element={<NySluttseddelPage />} />
            <Route path="/ordrer" element={<OrdrerPage />} />
            <Route path="/statistikk" element={<div>Statistikk Side (TODO)</div>} />
            <Route path="/kart" element={<div>Kart Side (TODO)</div>} />
            <Route path="/innstillinger" element={<div>Innstillinger Side (TODO)</div>} />
            <Route path="/ny-ordre" element={<NyOrdrePage />} />
            <Route path="/ny-fangstmelding" element={<NyFangstmeldingPage />} />
            <Route path="/ordre/:id/rediger" element={<RedigerOrdrePage />} />
            <Route path="/fangstmelding/:id/rediger" element={<RedigerFangstmeldingPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;