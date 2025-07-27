import React, { useState, useEffect } from 'react';
import styles from './Navbar.module.css';
import logoSrc from '../assets/images/logo3.png';
import { useScrollPosition } from '../hooks/useScrollPosition';
import { FaBars, FaTimes } from 'react-icons/fa';

interface NavbarProps {
  onLogin: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogin }) => {
  const { isAtTop } = useScrollPosition();
  const [isMenuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
  }, [isMenuOpen]);
  
  const handleLoginClick = () => {
    if (isMenuOpen) setMenuOpen(false);
    onLogin();
  };

  return (
    <header className={styles.header} data-at-top={isAtTop ? '' : undefined}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <h1>Fangstportalen</h1>
          <img src={logoSrc} alt="Fangstportalen Logo" className={styles.logoImage} />
        </div>
        
        <nav className={styles.desktopNav}>
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

        <div className={styles.mobileMenuToggle}>
          <button onClick={() => setMenuOpen(!isMenuOpen)} className={styles.menuIcon} aria-label="Åpne meny">
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className={styles.mobileNav}>
          <a href="#" className={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>Funksjoner</a>
          <a href="#" className={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>Priser</a>
          <a href="#" className={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>Kontakt</a>
          <hr className={styles.divider} />
          <button className={styles.mobileCtaButton} onClick={handleLoginClick}>
            Kom i gang
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;