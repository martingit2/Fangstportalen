import React from 'react';
import styles from './FeaturesSection.module.css';
import fiskemottakImage from '../assets/images/fiskemottak.jpg';
import kontorPlanleggingImage from '../assets/images/kontor-planlegging.jpg';
import styrhusTerminalImage from '../assets/images/styrhus-terminal.jpg';

const FeaturesSection: React.FC = () => {
  return (
    <section className={styles.features}>
      <div className={styles.wrapper}>
        <div className={styles.sectionHeader}>
          <div className={styles.container}>
            <span>Kjernefunksjonalitet</span>
            <h2>Én plattform, to vinnere</h2>
            <p>Fangstportalen er designet for å skape en sømløs og effektiv arbeidsflyt for både fiskeren på havet og innkjøperen på land.</p>
          </div>
        </div>
      </div>

      <div className={styles.featureListContainer}>
        <div className={styles.container}>
          <div className={styles.featureItem}>
            <div className={styles.featureText}>
              <h3>For Fiskeren</h3>
              <p className={styles.tagline}>Maksimer verdien av hver fangst.</p>
              <p>Få en umiddelbar og komplett oversikt over markedet. Ta datadrevne beslutninger direkte fra styrhuset for å sikre best mulig pris og redusere usikkerhet.</p>
              <ul>
                <li>Sanntids markedsoversikt over priser og behov.</li>
                <li>Digital sluttseddel direkte på kaien – ingen papirarbeid.</li>
                <li>Full kontroll og analyse av din egen fangsthistorikk.</li>
              </ul>
            </div>
            <div className={styles.featureImageContainer}>
              <img src={styrhusTerminalImage} alt="Moderne styrhus med digitale skjermer" className={styles.featureImage} />
            </div>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureText}>
              <h3>For Fiskebruket</h3>
              <p className={styles.tagline}>Optimaliser logistikk og råstofftilgang.</p>
              <p>Få full forutsigbarhet over innkommende leveranser. Vårt logistikk-dashboard gir deg sanntidsdata for å planlegge produksjon, bemanning og logistikk med enestående presisjon.</p>
              <ul>
                <li>Sanntidsoversikt over fartøy på vei til land (ETA).</li>
                <li>Digital ordrepublisering for å signalisere behov til markedet.</li>
                <li>Redusert administrasjon med heldigitale sluttsedler.</li>
              </ul>
            </div>
            <div className={styles.featureImageContainer}>
              <img src={kontorPlanleggingImage} alt="Person som planlegger logistikk på kontor" className={styles.featureImage} />
            </div>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureText}>
              <h3>En Felles, Transparent Arena</h3>
              <p className={styles.tagline}>Bygg sterkere partnerskap.</p>
              <p>Ved å koble fisker og fiskemottak på én felles plattform, reduserer vi friksjon, eliminerer misforståelser og bygger et fundament for mer effektive og lønnsomme partnerskap basert på tillit og transparens.</p>
              <ul>
                <li>Sikker og sporbar kommunikasjon.</li>
                <li>Felles, uforanderlig digitalt arkiv for alle transaksjoner.</li>
                <li>Datadrevet innsikt for begge parter.</li>
              </ul>
            </div>
            <div className={styles.featureImageContainer}>
              <img src={fiskemottakImage} alt="Moderne fiskemottak" className={styles.featureImage} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;