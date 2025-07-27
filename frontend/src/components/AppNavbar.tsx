import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import styles from './AppNavbar.module.css';
import logoSrc from '../assets/images/logo3.png';
import Button from './ui/Button';

const AppNavbar: React.FC = () => {
    const { user, logout } = useAuth0();

    return (
        <nav className={styles.navbar}>
            <Link to="/dashboard" className={styles.logo}>
                <img src={logoSrc} alt="Fangstportalen Logo" className={styles.logoImage} />
                <h1 className={styles.logoText}>Fangstportalen</h1>
            </Link>
            <div className={styles.userMenu}>
                <span className={styles.userName}>{user?.name}</span>
                <Button 
                    variant="secondary"
                    onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                    Logg ut
                </Button>
            </div>
        </nav>
    );
};

export default AppNavbar;