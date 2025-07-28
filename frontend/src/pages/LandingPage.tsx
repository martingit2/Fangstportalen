import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './LandingPage.module.css';
import heroImage from '../assets/images/fisk1.jpg';
import FadeIn from '../components/FadeIn';
import FeaturesSection from '../components/FeaturesSection';
import DisclaimerSection from '../components/DisclaimerSection';
import { useAuth0 } from '@auth0/auth0-react';

const LandingPage: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <>
      <Navbar onLogin={() => loginWithRedirect()} />

      <main>
        <div className={styles.hero}>
          <div className={styles.container}>
            <FadeIn>
              <div className={styles.heroContent}>
                <h2 className={styles.heroTitle}>Digitaliser din fangst.</h2>
                <p className={styles.heroSubtitle}>
                  En enklere og mer effektiv hverdag for den moderne fisker.
                  Få full kontroll fra styrhuset.
                </p>
                <ul className={styles.heroFeatureList}>
                  <li>Sanntids markedsoversikt</li>
                  <li>Digital sluttseddel på kaien</li>
                  <li>Full analyse av din fangsthistorikk</li>
                </ul>
                <button className={styles.ctaButton} onClick={() => loginWithRedirect()}>
                  Kom i gang gratis
                </button>
              </div>
            </FadeIn>
            <FadeIn>
              <div className={styles.heroImageContainer}>
                <img src={heroImage} alt="Fiskebåt på havet" className={styles.heroImage} />
              </div>
            </FadeIn>
          </div>
        </div>

        <FadeIn>
          <FeaturesSection />
        </FadeIn>

        <FadeIn>
          <DisclaimerSection />
        </FadeIn>
      </main>

      <Footer />
    </>
  );
};

export default LandingPage;