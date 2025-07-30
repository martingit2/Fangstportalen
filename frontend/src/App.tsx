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
import SluttseddelDetaljerPage from './pages/SluttseddelDetaljerPage';
import FunksjonerPage from './pages/FunksjonerPage';
import PriserPage from './pages/PriserPage';
import KontaktPage from './pages/KontaktPage';
import TeknologiPage from './pages/TeknologiPage';
import SikkerhetPage from './pages/SikkerhetPage';
import IntegrasjonerPage from './pages/IntegrasjonerPage';
import SystemkravPage from './pages/SystemkravPage';
import OmOssPage from './pages/OmOssPage';
import KarrierePage from './pages/KarrierePage';
import ScrollToTop from './components/ScrollToTop';
import PressePage from './pages/PressePage';
import HjelpesenterPage from './pages/HjelpesenterPage';
import ApiDocPage from './pages/ApiDocPage';
import DriftsstatusPage from './pages/DriftsstatusPage';
import BloggPage from './pages/BloggPage';
import ArtikkelPage from './pages/ArtikkelPage';
import PersonvernPage from './pages/PersonvernPage';
import BrukervilkarPage from './pages/BrukervilkarPage';

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
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/funksjoner" element={<FunksjonerPage />} />
          <Route path="/priser" element={<PriserPage />} />
          <Route path="/kontakt" element={<KontaktPage />} />
          <Route path="/teknologi" element={<TeknologiPage />} />
          <Route path="/sikkerhet" element={<SikkerhetPage />} />
          <Route path="/integrasjoner" element={<IntegrasjonerPage />} />
          <Route path="/systemkrav" element={<SystemkravPage />} />
          <Route path="/om-oss" element={<OmOssPage />} />
          <Route path="/karriere" element={<KarrierePage />} />
          <Route path="/driftsstatus" element={<DriftsstatusPage />} />
          <Route path="/blogg" element={<BloggPage />} /> 
          <Route path="/blogg/:slug" element={<ArtikkelPage />} />
          <Route path="/personvern" element={<PersonvernPage />} /> 
          <Route path="/brukervilkar" element={<BrukervilkarPage />} />
          <Route path="/api-dokumentasjon" element={<ApiDocPage />} />
          <Route path="/presse" element={<PressePage />} />
          <Route path="/hjelpesenter" element={<HjelpesenterPage />} />
          
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
              <Route path="/sluttseddelarkiv/:id" element={<SluttseddelDetaljerPage />} />
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