import React from 'react';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
    title: string;
    subtitle: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <h1 className={styles.title}>{title}</h1>
                <p className={styles.subtitle}>{subtitle}</p>
            </div>
        </header>
    );
};

export default PageHeader;