import React from 'react';
import styles from './DisclaimerSection.module.css';

const DisclaimerSection: React.FC = () => {
  return (
    <section className={styles.disclaimer}>
      <div className={styles.container}>
        <h3>Et Studentprosjekt</h3>
        <p>
          Fangstportalen er utviklet som et porteføljeprosjekt av en student for å demonstrere
          ferdigheter innen full-stack utvikling, systemarkitektur og moderne designprinsipper.
          Applikasjonen er en prototype, er ikke tilknyttet noen offisielle instanser, og skal ikke
          brukes for reell omsetning av fisk.
        </p>
      </div>
    </section>
  );
};

export default DisclaimerSection;