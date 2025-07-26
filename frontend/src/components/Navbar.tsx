import React from 'react';
import styles from './Navbar.module.css';
import logoSrc from '../assets/images/logo3.png';
import { useScrollPosition } from '../hooks/useScrollPosition';

interface NavbarProps {
  onLogin: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogin }) => {
  const { isAtTop } = useScrollPosition();

  return (
    <header className={styles.header} data-at-top={isAtTop ? '' : undefined}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <img src={logoSrc} alt="Fangstportalen Logo" className={styles.logoImage} />
          <h1>Fangstportalen</h1>
        </div>
        
        <nav className={styles.navLinks}>
          <a href="#" className={styles.navLink}>Funksjoner</a>
          <a href="#" className={styles.navLink}>Priser</a>
          <a href="#" className={styles.navLink}>Kontakt</a>
        </nav>

        <div className={styles.actions}>
          <button className={styles.loginButton} onClick={onLogin}>
            Logg inn
          </button>
          <button className={styles.ctaButton} onClick={onLogin}>
            Kom i gang
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;