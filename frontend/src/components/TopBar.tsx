import React from 'react';
import styles from './TopBar.module.css';
import { useAuth0 } from '@auth0/auth0-react';
import Button from './ui/Button';
import { FaSearch, FaBars } from 'react-icons/fa';

interface TopBarProps {
    onToggleMenu: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onToggleMenu }) => {
    const { user, logout } = useAuth0();

    return (
        <header className={styles.topBar}>
            <button className={styles.mobileMenuButton} onClick={onToggleMenu} aria-label="Åpne meny">
                <FaBars />
            </button>
            <div className={styles.searchContainer}>
                <div className={styles.searchInputWrapper}>
                    <FaSearch className={styles.searchIcon} />
                    <input type="text" placeholder="Søk..." className={styles.searchInput} />
                </div>
            </div>
            <div className={styles.userMenu}>
                <span className={styles.userName}>{user?.email}</span>
                <Button 
                    variant="ghost"
                    onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                    Logg ut
                </Button>
            </div>
        </header>
    );
};

export default TopBar;