// src/pages/LandingPage.tsx
import React from 'react';
import Navbar from '../components/Navbar'; 
import styles from './LandingPage.module.css';

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <>
      <Navbar onLogin={onLogin} /> 
      
      <main className={styles.hero}>
        <div className={styles.container}>
          <h2 className={styles.heroTitle}>Digitaliser din fangst.</h2>
          <p className={styles.heroSubtitle}>
            En enklere og mer effektiv hverdag for den moderne fisker.
          </p>
          <button className={styles.ctaButton} onClick={onLogin}>
            Kom i gang gratis
          </button>
        </div>
      </main>
    </>
  );
};

export default LandingPage;