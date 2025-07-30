import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './LandingPage.module.css';
import heroImage from '../assets/images/fisk1.jpg';
import FadeIn from '../components/FadeIn';
import { useAuth0 } from '@auth0/auth0-react';
import NotificationHandler from '../components/NotificationHandler';
import LandingPageFeatureSection from '../components/LandingPageFeatureSection';
import DisclaimerSection from '../components/DisclaimerSection';

import fiskemottakImage from '../assets/images/fiskemottak.jpg';
import kontorPlanleggingImage from '../assets/images/kontor-planlegging.jpg';
import styrhusTerminalImage from '../assets/images/styrhus-terminal.jpg';

const featuresData = [
    {
        title: "For Fiskeren",
        tagline: "Maksimer verdien av hver fangst.",
        description: "Få en umiddelbar og komplett oversikt over markedet. Ta datadrevne beslutninger direkte fra styrhuset for å sikre best mulig pris og redusere usikkerhet.",
        points: [
            "Sanntids markedsoversikt over priser og behov.",
            "Digital sluttseddel direkte på kaien – ingen papirarbeid.",
            "Full kontroll og analyse av din egen fangsthistorikk."
        ],
        imageSrc: styrhusTerminalImage,
        altText: "Moderne styrhus med digitale skjermer"
    },
    {
        title: "For Fiskebruket",
        tagline: "Optimaliser logistikk og råstofftilgang.",
        description: "Få full forutsigbarhet over innkommende leveranser. Vårt logistikk-dashboard gir deg sanntidsdata for å planlegge produksjon, bemanning og logistikk med enestående presisjon.",
        points: [
            "Sanntidsoversikt over fartøy på vei til land (ETA).",
            "Digital ordrepublisering for å signalisere behov til markedet.",
            "Redusert administrasjon med heldigitale sluttsedler."
        ],
        imageSrc: kontorPlanleggingImage,
        altText: "Person som planlegger logistikk på kontor"
    },
    {
        title: "En Felles, Transparent Arena",
        tagline: "Bygg sterkere partnerskap basert på tillit.",
        description: "Ved å koble fisker og fiskemottak på én felles plattform, reduserer vi friksjon, eliminerer misforståelser og bygger et fundament for mer effektive og lønnsomme partnerskap.",
        points: [
            "Sikker og sporbar kommunikasjon.",
            "Felles, uforanderlig digitalt arkiv for alle transaksjoner.",
            "Datadrevet innsikt for begge parter."
        ],
        imageSrc: fiskemottakImage,
        altText: "Moderne fiskemottak"
    }
];

const LandingPage: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <>
      <Navbar />
      <main>
        <div className={styles.hero}>
          <div className={styles.container}>
            <NotificationHandler /> 
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
          <LandingPageFeatureSection
            headerText="Kjernefunksjonalitet"
            title="Én plattform, to vinnere"
            subtitle="Fangstportalen er designet for å skape en sømløs og effektiv arbeidsflyt for både fiskeren på havet og innkjøperen på land."
            features={featuresData}
          />
        </FadeIn>
        <FadeIn><DisclaimerSection /></FadeIn>
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;