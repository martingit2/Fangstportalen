import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import { setupInterceptors } from './services/apiService';
import { useEffect } from 'react';
import NySluttseddelPage from './pages/NySluttseddelPage';
import AuthenticatedLayout from './components/AuthenticatedLayout';
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
          <Route element={<AuthenticatedLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/ny-sluttseddel" element={<NySluttseddelPage />} />
            <Route path="/dashboard/ny-ordre" element={<NyOrdrePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;