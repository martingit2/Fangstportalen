import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import logoSrc from '../assets/images/logo3.png';
import { FaTachometerAlt, FaFileSignature, FaShoppingCart, FaChartLine, FaMapMarkedAlt, FaCog } from 'react-icons/fa';

const Sidebar: React.FC = () => {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoContainer}>
                <img src={logoSrc} alt="Fangstportalen Logo" className={styles.logoImage} />
                <h1 className={styles.logoText}>Fangstportalen</h1>
            </div>
            <nav className={styles.nav}>
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink} end>
                    <FaTachometerAlt />
                    <span>Markedsplass</span>
                </NavLink>
                <NavLink to="/sluttsedler" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                    <FaFileSignature />
                    <span>Sluttsedler</span>
                </NavLink>
                <NavLink to="/ordrer" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                    <FaShoppingCart />
                    <span>Ordrer</span>
                </NavLink>
                <NavLink to="/statistikk" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                    <FaChartLine />
                    <span>Statistikk</span>
                </NavLink>
                <NavLink to="/kart" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                    <FaMapMarkedAlt />
                    <span>Kart</span>
                </NavLink>
            </nav>
            <div className={styles.footerNav}>
                <NavLink to="/innstillinger" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                    <FaCog />
                    <span>Innstillinger</span>
                </NavLink>
            </div>
        </aside>
    );
};

export default Sidebar;