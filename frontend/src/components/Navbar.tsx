// src/components/Navbar.tsx
import React from 'react';
import styles from './Navbar.module.css';
import logoSrc from '../assets/images/logo.png'; 

interface NavbarProps {
  onLogin: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogin }) => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <img src={logoSrc} alt="FangstPortalen Logo" className={styles.logoImage} />
          <h1>FangstPortalen</h1>
        </div>
        <nav>
          <button className={styles.loginButton} onClick={onLogin}>
            Logg inn
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;