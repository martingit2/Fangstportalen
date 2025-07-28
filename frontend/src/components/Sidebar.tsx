import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import logoSrc from '../assets/images/logo3.png';
import { FaTachometerAlt, FaFileSignature, FaShoppingCart, FaChartLine, FaMapMarkedAlt, FaCog, FaArchive } from 'react-icons/fa';
import { useClaims } from '../hooks/useClaims';

interface SidebarProps {
    isOpen: boolean;
    onCloseMenu: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onCloseMenu }) => {
    const { claims } = useClaims();
    const erSkipper = claims?.roles.some(r => r.startsWith('REDERI_'));

    return (
        <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
            <div className={styles.logoContainer}>
                <h1 className={styles.logoText}>Fangstportalen</h1>
                <img src={logoSrc} alt="Fangstportalen Logo" className={styles.logoImage} />
            </div>
            <nav className={styles.nav}>
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink} onClick={onCloseMenu} end>
                    <FaTachometerAlt />
                    <span>Markedsplass</span>
                </NavLink>
                {erSkipper && (
                    <NavLink to="/ny-sluttseddel" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink} onClick={onCloseMenu}>
                        <FaFileSignature />
                        <span>Ny Sluttseddel</span>
                    </NavLink>
                )}
                <NavLink to="/ordrer" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink} onClick={onCloseMenu}>
                    <FaShoppingCart />
                    <span>Mine Ordrer</span>
                </NavLink>
                <NavLink to="/sluttseddelarkiv" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink} onClick={onCloseMenu}>
                    <FaArchive />
                    <span>Sluttseddelarkiv</span>
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