import React from 'react';
import styles from './MobileMenu.module.css';
import { FaTimes, FaBars } from 'react-icons/fa';

interface MobileMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
  onLogin: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, toggleMenu, onLogin }) => {
  return (
    <div className={styles.mobileMenuContainer}>
      <button onClick={toggleMenu} className={styles.menuIcon} aria-label="Menu">
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {isOpen && (
        <nav className={styles.mobileNav}>
          <a href="#" className={styles.mobileNavLink} onClick={toggleMenu}>Funksjoner</a>
          <a href="#" className={styles.mobileNavLink} onClick={toggleMenu}>Priser</a>
          <a href="#" className={styles.mobileNavLink} onClick={toggleMenu}>Kontakt</a>
          <hr className={styles.divider} />
          <button className={styles.mobileLoginButton} onClick={onLogin}>Logg inn</button>
        </nav>
      )}
    </div>
  );
};

export default MobileMenu;