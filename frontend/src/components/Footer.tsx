import React from 'react';
import styles from './Footer.module.css';
import logoSrc from '../assets/images/logo3.png';
import { FaFacebook, FaLinkedin, FaTwitter, FaServer, FaBuilding, FaBookOpen } from 'react-icons/fa'; 

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.mainFooter}>
          <div className={styles.brandSection}>
            <div className={styles.logo}>
              <img src={logoSrc} alt="Fangstportalen Logo" className={styles.logoImage} />
              <h2>Fangstportalen</h2>
            </div>
            <p>Den komplette digitale løsningen for førstehåndsomsetning av fisk.</p>
          </div>

          <div className={styles.linksSection}>
            <div className={styles.linkColumn}>
              <h4><FaServer /> Plattform</h4>
              <a href="#" className={styles.footerLink}>Teknologi</a>
              <a href="#" className={styles.footerLink}>Sikkerhet</a>
              <a href="#" className={styles.footerLink}>Integrasjoner</a>
              <a href="#" className={styles.footerLink}>Systemkrav</a>
            </div>
            <div className={styles.linkColumn}>
              <h4><FaBuilding /> Selskap</h4>
              <a href="#" className={styles.footerLink}>Om oss</a>
              <a href="#" className={styles.footerLink}>Karriere</a>
              <a href="#" className={styles.footerLink}>Presse</a>
            </div>
            <div className={styles.linkColumn}>
              <h4><FaBookOpen /> Ressurser</h4>
              <a href="#" className={styles.footerLink}>Hjelpesenter</a>
              <a href="#" className={styles.footerLink}>API-dokumentasjon</a>
              <a href="#" className={styles.footerLink}>Driftsstatus</a>
              <a href="#" className={styles.footerLink}>Blogg</a>
            </div>
          </div>
        </div>

        <div className={styles.subFooter}>
          <p className={styles.copyright}>© {new Date().getFullYear()} Fangstportalen. Alle rettigheter forbeholdt.</p>
          <div className={styles.legalLinks}>
            <a href="#" className={styles.footerLink}>Brukervilkår</a>
            <a href="#" className={styles.footerLink}>Personvern</a>
          </div>
          <div className={styles.socialLinks}>
            <a href="#" aria-label="Facebook"><FaFacebook /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;