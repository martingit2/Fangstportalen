import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styles from './AppLayout.module.css';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const AppLayout: React.FC = () => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <div className={styles.appLayout}>
            <Sidebar isOpen={isMobileMenuOpen} onCloseMenu={closeMobileMenu} />
            <TopBar onToggleMenu={toggleMobileMenu} />
            <main className={styles.mainContent}>
                <Outlet />
            </main>
            {isMobileMenuOpen && <div className={styles.backdrop} onClick={closeMobileMenu}></div>}
        </div>
    );
};

export default AppLayout;