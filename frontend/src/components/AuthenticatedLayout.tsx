import React from 'react';
import { Outlet } from 'react-router-dom';
import AppNavbar from './AppNavbar';
import styles from './AuthenticatedLayout.module.css';

const AuthenticatedLayout: React.FC = () => {
    return (
        <div className={styles.layout}>
            <AppNavbar />
            <main className={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    );
};

export default AuthenticatedLayout;