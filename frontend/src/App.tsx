// src/App.tsx

import { useAuth0 } from '@auth0/auth0-react';
import LandingPage from './pages/LandingPage';  


function App() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  if (!isAuthenticated) {
    return <LandingPage onLogin={() => loginWithRedirect()} />;
  
  }}
export default App;