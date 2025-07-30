import React from 'react';
import styles from './ContentSection.module.css';

interface ContentSectionProps {
    title?: string;
    children: React.ReactNode;
}

const ContentSection: React.FC<ContentSectionProps> = ({ title, children }) => {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                {title && <h2 className={styles.title}>{title}</h2>}
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </section>
    );
};

export default ContentSection;