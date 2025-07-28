import React from 'react';
import Button from '../components/ui/Button';
import { useClaims } from '../hooks/useClaims';
import styles from './InnstillingerPage.module.css';

const InnstillingerPage: React.FC = () => {
    const { claims, isLoading } = useClaims();

    if (isLoading) {
        return <div>Laster innstillinger...</div>;
    }

    const erRederiAdmin = claims?.roles.includes('REDERI_ADMIN');

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Innstillinger</h1>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Min Organisasjon</h2>
                <div className={styles.card}>
                    <p>Her vil du kunne administrere organisasjonsdetaljer.</p>
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Team</h2>
                <div className={styles.card}>
                    <p>Inviter og administrer teammedlemmer.</p>
                </div>
            </section>

            {erRederiAdmin && (
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Fartøy</h2>
                        <Button to="/innstillinger/nytt-fartoy">
                            + Legg til nytt fartøy
                        </Button>
                    </div>
                    <div className={styles.card}>
                        <p>Her vil du se en liste over organisasjonens fartøy.</p>
                    </div>
                </section>
            )}
        </div>
    );
};

export default InnstillingerPage;