// src/App.tsx

import { useAuth0 } from '@auth0/auth0-react';
import LandingPage from './pages/LandingPage';     // <-- VIKTIG: Importerer forsiden


function App() {
  // Henter status fra Auth0
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  // ----- Dette er den nye, viktige logikken -----

  // 1. HVIS brukeren IKKE er logget inn...
  if (!isAuthenticated) {
    // ...vis den nye, stilige forsiden
    return <LandingPage onLogin={() => loginWithRedirect()} />;
  
  }}
export default App;