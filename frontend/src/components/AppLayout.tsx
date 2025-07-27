import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './AppLayout.module.css';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const AppLayout: React.FC = () => {
    return (
        <div className={styles.appLayout}>
            <Sidebar />
            <TopBar />
            <main className={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    );
};

export default AppLayout;