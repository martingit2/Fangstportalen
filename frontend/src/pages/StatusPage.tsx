import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from './StatusPage.module.css';
import Button from '../components/ui/Button';
import { FaEnvelopeOpenText, FaExclamationTriangle } from 'react-icons/fa';

const StatusPage: React.FC = () => {
    const location = useLocation();
    const { title, message, icon } = location.state || {
        title: 'Ukjent Status',
        message: 'Noe uventet skjedde.',
        icon: 'error'
    };

    const IconComponent = icon === 'success' ? FaEnvelopeOpenText : FaExclamationTriangle;

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.iconWrapper}>
                    <IconComponent />
                </div>
                <h1 className={styles.title}>{title}</h1>
                <p className={styles.message}>{message}</p>
                <div className={styles.actions}>
                    <Button to="/" variant="secondary">Tilbake til forsiden</Button>
                </div>
            </div>
        </div>
    );
};

export default StatusPage;