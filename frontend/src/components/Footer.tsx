import React from 'react';
import styles from './Footer.module.css';
import logoSrc from '../assets/images/logo3.png';
import { FaFacebook, FaLinkedin, FaTwitter, FaServer, FaBuilding, FaBookOpen } from 'react-icons/fa'; 
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.mainFooter}>
          <div className={styles.brandSection}>
            <Link to="/" className={styles.logo}>
              <img src={logoSrc} alt="Fangstportalen Logo" className={styles.logoImage} />
              <h2>Fangstportalen</h2>
            </Link>
            <p>Den komplette digitale løsningen for førstehåndsomsetning av fisk.</p>
          </div>

          <div className={styles.linksSection}>
            <div className={styles.linkColumn}>
              <h4><FaServer /> Plattform</h4>
              <Link to="/teknologi" className={styles.footerLink}>Teknologi</Link>
              <Link to="/sikkerhet" className={styles.footerLink}>Sikkerhet</Link>
              <Link to="/integrasjoner" className={styles.footerLink}>Integrasjoner</Link>
              <Link to="/systemkrav" className={styles.footerLink}>Systemkrav</Link>
            </div>
            <div className={styles.linkColumn}>
              <h4><FaBuilding /> Selskap</h4>
              <Link to="/om-oss" className={styles.footerLink}>Om oss</Link>
              <Link to="/karriere" className={styles.footerLink}>Karriere</Link>
              <Link to="/presse" className={styles.footerLink}>Presse</Link>
            </div>
            <div className={styles.linkColumn}>
              <h4><FaBookOpen /> Ressurser</h4>
              <Link to="/hjelpesenter" className={styles.footerLink}>Hjelpesenter</Link>
              <Link to="/api-dokumentasjon" className={styles.footerLink}>API-dokumentasjon</Link>
              <Link to="/driftsstatus" className={styles.footerLink}>Driftsstatus</Link>
              <Link to="/blogg" className={styles.footerLink}>Blogg</Link>
            </div>
          </div>
        </div>

        <div className={styles.subFooter}>
          <p className={styles.copyright}>© {new Date().getFullYear()} Fangstportalen. Alle rettigheter forbeholdt.</p>
          <div className={styles.legalLinks}>
            <Link to="/brukervilkar" className={styles.footerLink}>Brukervilkår</Link>
            <Link to="/personvern" className={styles.footerLink}>Personvern</Link>
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