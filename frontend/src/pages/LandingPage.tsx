import React from 'react';
import Navbar from '../components/Navbar';
import styles from './LandingPage.module.css';
import heroImage from '../assets/images/fisk1.jpg';

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <>
      <Navbar onLogin={onLogin} />
      
      <main className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h2 className={styles.heroTitle}>Digitaliser din fangst.</h2>
            <p className={styles.heroSubtitle}>
              En enklere og mer effektiv hverdag for den moderne fisker.
              Få full kontroll fra styrhuset.
            </p>
            <ul className={styles.featureList}>
              <li>✓ Sanntids markedsoversikt</li>
              <li>✓ Digital sluttseddel på kaien</li>
              <li>✓ Full analyse av din fangsthistorikk</li>
            </ul>
            <button className={styles.ctaButton} onClick={onLogin}>
              Kom i gang gratis
            </button>
          </div>
          <div className={styles.heroImageContainer}>
            <img src={heroImage} alt="Fiskebåt på havet" className={styles.heroImage} />
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>© {new Date().getFullYear()} Fangstportalen. Alle rettigheter forbeholdt.</p>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;