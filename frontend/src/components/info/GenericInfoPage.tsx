import React from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import styles from './GenericInfoPage.module.css';

interface GenericInfoPageProps {
    children: React.ReactNode;
}

const GenericInfoPage: React.FC<GenericInfoPageProps> = ({ children }) => {
    return (
        <>
            <Navbar />
            <main className={styles.main}>
                {children}
            </main>
            <Footer />
        </>
    );
};

export default GenericInfoPage;