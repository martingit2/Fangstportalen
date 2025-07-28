import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import logoSrc from '../assets/images/logo3.png';
import { FaTachometerAlt, FaFileSignature, FaShoppingCart, FaChartLine, FaMapMarkedAlt, FaCog } from 'react-icons/fa';

interface SidebarProps {
    isOpen: boolean;
    onCloseMenu: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onCloseMenu }) => {
    return (
        <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
            <div className={styles.logoContainer}>
                <img src={logoSrc} alt="Fangstportalen Logo" className={styles.logoImage} />
                <h1 className={styles.logoText}>Fangstportalen</h1>
            </div>
            <nav className={styles.nav}>
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink} onClick={onCloseMenu} end>
                    <FaTachometerAlt />
                    <span>Markedsplass</span>
                </NavLink>
                <NavLink to="/ny-sluttseddel" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink} onClick={onCloseMenu}>
                    <FaFileSignature />
                    <span>Opprett Sluttseddel</span>
                </NavLink>
                <NavLink to="/ordrer" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink} onClick={onCloseMenu}>
                    <FaShoppingCart />
                    <span>Mine Ordrer</span>
                </NavLink>
                <NavLink to="/statistikk" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink} onClick={onCloseMenu}>
                    <FaChartLine />
                    <span>Statistikk</span>
                </NavLink>
                <NavLink to="/kart" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink} onClick={onCloseMenu}>
                    <FaMapMarkedAlt />
                    <span>Kart</span>
                </NavLink>
            </nav>
            <div className={styles.footerNav}>
                <NavLink to="/innstillinger" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink} onClick={onCloseMenu}>
                    <FaCog />
                    <span>Innstillinger</span>
                </NavLink>
            </div>
        </aside>
    );
};

export default Sidebar;