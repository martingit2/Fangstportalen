import React, { useState, useEffect } from 'react';
import styles from './Navbar.module.css';
import logoSrc from '../assets/images/logo3.png';
import { useScrollPosition } from '../hooks/useScrollPosition';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
    
    const { isAuthenticated, isLoading, loginWithRedirect, logout, user } = useAuth0();
    const { isAtTop } = useScrollPosition();
    const [isMenuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    }, [isMenuOpen]);
    
    const handleLoginClick = () => {
        if (isMenuOpen) setMenuOpen(false);
        loginWithRedirect();
    };

    const handleDashboardClick = () => {
        if (isMenuOpen) setMenuOpen(false);
        navigate('/dashboard');
    }

    return (
        <header className={styles.header} data-at-top={isAtTop ? '' : undefined}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <h1>Fangstportalen</h1>
                    <img src={logoSrc} alt="Fangstportalen Logo" className={styles.logoImage} />
                </div>
                
                <nav className={styles.desktopNav}>
                    <a href="#features" className={styles.navLink}>Funksjoner</a>
                    <a href="#pricing" className={styles.navLink}>Priser</a>
                    <a href="#contact" className={styles.navLink}>Kontakt</a>
                </nav>

                <div className={styles.actions}>
                    {/* Håndter laste-tilstand først */}
                    {isLoading ? (
                        <>
                            <button className={styles.loginButton} disabled>Laster...</button>
                            <button className={styles.ctaButton} disabled>Laster...</button>
                        </>
                    ) : isAuthenticated ? (
                        <>
                            <span className={styles.userName}>{user?.name || user?.email}</span>
                            <button className={styles.loginButton} onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                                Logg ut
                            </button>
                            <button className={styles.ctaButton} onClick={handleDashboardClick}>
                                Gå til Dashboard
                            </button>
                        </>
                    ) : (
                        <>
                            <button className={styles.loginButton} onClick={() => loginWithRedirect()}>
                                Logg inn
                            </button>
                            <button className={styles.ctaButton} onClick={() => loginWithRedirect()}>
                                Kom i gang
                            </button>
                        </>
                    )}
                </div>

                <div className={styles.mobileMenuToggle}>
                    <button onClick={() => setMenuOpen(!isMenuOpen)} className={styles.menuIcon} aria-label="Åpne meny">
                        {isMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>
            
            {isMenuOpen && (
                <div className={styles.mobileNav}>
                    <a href="#features" className={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>Funksjoner</a>
                    <a href="#pricing" className={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>Priser</a>
                    <a href="#contact" className={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>Kontakt</a>
                    <hr className={styles.divider} />
                    {isAuthenticated ? (
                         <button className={styles.mobileCtaButton} onClick={handleDashboardClick}>
                            Gå til Dashboard
                        </button>
                    ) : (
                        <button className={styles.mobileCtaButton} onClick={handleLoginClick}>
                            Kom i gang
                        </button>
                    )}
                </div>
            )}
        </header>
    );
};

export default Navbar;