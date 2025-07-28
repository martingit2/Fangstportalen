import React from 'react';
import styles from './StatCard.module.css';

interface StatCardProps {
    title: string;
    value: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
    return (
        <div className={styles.card}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.value}>{value}</p>
        </div>
    );
};

export default StatCard;