import React from 'react';
import GenericInfoPage from '../components/info/GenericInfoPage';
import PageHeader from '../components/info/PageHeader';
import ContentSection from '../components/info/ContentSection';
import styles from './IntegrasjonerPage.module.css';
import Button from '../components/ui/Button';
import { FaFileAlt, FaCalculator, FaSatelliteDish } from 'react-icons/fa';

const IntegrasjonerPage: React.FC = () => {
    return (
        <GenericInfoPage>
            <PageHeader
                title="Sømløse Integrasjoner"
                subtitle="Koble Fangstportalen til verktøyene du allerede bruker for en friksjonsfri og automatisert arbeidsflyt."
            />

            <ContentSection title="Salgslag & Rapportering">
                <div className={styles.integrationGrid}>
                    <div className={styles.integrationCard}>
                        <div className={styles.iconWrapper}>
                            <FaFileAlt />
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.cardHeader}>
                                <h3>Offentlig Rapportering</h3>
                                <div className={`${styles.statusBadge} ${styles.planned}`}>Planlagt</div>
                            </div>
                            <p>Automatisk innsending av digitale sluttsedler direkte til salgslag, som eliminerer manuell rapportering og sikrer datakvalitet.</p>
                        </div>
                    </div>
                </div>
            </ContentSection>

            <ContentSection title="Økonomi & Regnskap">
                <div className={styles.integrationGrid}>
                    <div className={styles.integrationCard}>
                        <div className={styles.iconWrapper}>
                            <FaCalculator />
                        </div>
                        <div className={styles.cardContent}>
                             <div className={styles.cardHeader}>
                                <h3>Regnskapssystemer</h3>
                                <div className={`${styles.statusBadge} ${styles.planned}`}>Planlagt</div>
                            </div>
                            <p>Synkroniser sluttsedler og oppgjørsdata direkte til ditt regnskapssystem for enkel bokføring og full oversikt.</p>
                        </div>
                    </div>
                </div>
            </ContentSection>
            
            <ContentSection title="Maskinvare & Utstyr">
                 <div className={styles.integrationGrid}>
                    <div className={styles.integrationCard}>
                         <div className={styles.iconWrapper}>
                            <FaSatelliteDish />
                        </div>
                        <div className={styles.cardContent}>
                             <div className={styles.cardHeader}>
                                <h3>Styrhus-terminaler</h3>
                                <div className={`${styles.statusBadge} ${styles.planned}`}>Planlagt</div>
                            </div>
                            <p>Direkte integrasjon med ledende multifunksjonsskjermer for å bringe Fangstportalen inn som en native app i styrhuset.</p>
                        </div>
                    </div>
                </div>
            </ContentSection>

            <div className={styles.ctaSection}>
                <div className={styles.ctaContent}>
                    <h2>Har du et integrasjonsbehov?</h2>
                    <p>Vår plattform er bygget for å være fleksibel. Ta kontakt for å diskutere hvordan vi kan integrere Fangstportalen med dine systemer.</p>
                    <Button to="/kontakt" variant="primary">Diskuter en Integrasjon</Button>
                </div>
            </div>

        </GenericInfoPage>
    );
};

export default IntegrasjonerPage;