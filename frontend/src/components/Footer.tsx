import React from 'react';
import styles from './Footer.module.css';
import logoSrc from '../assets/images/logo.png';
import { FaFacebook, FaLinkedin, FaTwitter } from 'react-icons/fa'; // Importerer ikoner

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
              <h4>Produkt</h4>
              <a href="#" className={styles.footerLink}>Funksjoner</a>
              <a href="#" className={styles.footerLink}>Priser</a>
              <a href="#" className={styles.footerLink}>Demo</a>
              <a href="#" className={styles.footerLink}>Sikkerhet</a>
            </div>
            <div className={styles.linkColumn}>
              <h4>Selskap</h4>
              <a href="#" className={styles.footerLink}>Om oss</a>
              <a href="#" className={styles.footerLink}>Karriere</a>
              <a href="#" className={styles.footerLink}>Kontakt</a>
            </div>
            <div className={styles.linkColumn}>
              <h4>Ressurser</h4>
              <a href="#" className={styles.footerLink}>FAQ</a>
              <a href="#" className={styles.footerLink}>Support</a>
              <a href="#" className={styles.footerLink}>Blogg</a>
            </div>
          </div>
        </div>

        
        <div className={styles.subFooter}>
          <p className={styles.copyright}>© {new Date().getFullYear()} Fangstportalen. Alle rettigheter forbeholdt.</p>
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