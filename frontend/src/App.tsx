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
import StatistikkPage from './pages/StatistikkPage';
import OnboardingPage from './pages/OnboardingPage';
import InnstillingerPage from './pages/InnstillingerPage';
import NyttFartoyPage from './pages/NyttFartoyPage';
import SluttseddelArkivPage from './pages/SluttseddelArkivPage';
import StatusPage from './pages/StatusPage';
import { Toaster } from 'react-hot-toast';

function App() {
  const { isLoading, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    setupInterceptors(getAccessTokenSilently);
  }, [getAccessTokenSilently]);

  if (isLoading) {
    return <div>Laster...</div>;
  }

  return (
    <>
      <Toaster position="bottom-right" toastOptions={{
        className: '',
        duration: 5000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        success: {
          duration: 3000,
        },
      }} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/registrering/verifiser-epost" element={<StatusPage />} />
          <Route path="/registrering/vellykket" element={<StatusPage />} />
          <Route path="/feilmelding" element={<StatusPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/ny-sluttseddel" element={<NySluttseddelPage />} />
              <Route path="/ordrer" element={<OrdrerPage />} />
              <Route path="/sluttseddelarkiv" element={<SluttseddelArkivPage />} />
              <Route path="/statistikk" element={<StatistikkPage />} />
              <Route path="/kart" element={<div>Kart Side (TODO)</div>} />
              <Route path="/innstillinger" element={<InnstillingerPage />} />
              <Route path="/innstillinger/nytt-fartoy" element={<NyttFartoyPage />} />
              <Route path="/ny-ordre" element={<NyOrdrePage />} />
              <Route path="/ny-fangstmelding" element={<NyFangstmeldingPage />} />
              <Route path="/ordre/:id/rediger" element={<RedigerOrdrePage />} />
              <Route path="/fangstmelding/:id/rediger" element={<RedigerFangstmeldingPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;