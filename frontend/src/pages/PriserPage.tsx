import React from 'react';
import GenericInfoPage from '../components/info/GenericInfoPage';
import PageHeader from '../components/info/PageHeader';
import styles from './PriserPage.module.css';
import Button from '../components/ui/Button';
import { FaCheck } from 'react-icons/fa';

const PriserPage: React.FC = () => {
    return (
        <GenericInfoPage>
            <PageHeader
                title="Priser"
                subtitle="Enkle og forutsigbare priser som skalerer med din virksomhet. Start gratis i dag."
            />
            <div className={styles.pricingSection}>
                <div className={styles.container}>
                    <div className={styles.pricingCard}>
                        <h3 className={styles.cardType}>Rederi</h3>
                        <p className={styles.cardPrice}>Ta kontakt</p>
                        <p className={styles.cardPeriod}>for et tilbud</p>
                        <ul className={styles.featureList}>
                            <li><FaCheck /> Sanntids markedsoversikt</li>
                            <li><FaCheck /> Annonser fangst</li>
                            <li><FaCheck /> Motta og aksepter bud</li>
                            <li><FaCheck /> Digital sluttseddel</li>
                            <li><FaCheck /> Personlig statistikk</li>
                        </ul>
                        <div className={styles.ctaWrapper}>
                            <Button to="/kontakt" variant="primary">
                                Kontakt oss
                            </Button>
                        </div>
                    </div>

                    <div className={`${styles.pricingCard} ${styles.featured}`}>
                        <div className={styles.featuredBadge}>Mest populær</div>
                        <h3 className={styles.cardType}>Fiskebruk</h3>
                        <p className={styles.cardPrice}>Ta kontakt</p>
                        <p className={styles.cardPeriod}>for et tilbud</p>
                        <ul className={styles.featureList}>
                            <li><FaCheck /> Alt i Rederi, pluss:</li>
                            <li><FaCheck /> Gi bud på fangster</li>
                            <li><FaCheck /> Publiser åpne ordrer</li>
                            <li><FaCheck /> Logistikk-dashboard</li>
                            <li><FaCheck /> Team-administrasjon</li>
                        </ul>
                        <div className={styles.ctaWrapper}>
                            <Button to="/kontakt" variant="primary">
                                Kontakt oss
                            </Button>
                        </div>
                    </div>

                    <div className={styles.pricingCard}>
                        <h3 className={styles.cardType}>Premium</h3>
                        <p className={styles.cardPrice}>Ta kontakt</p>
                        <p className={styles.cardPeriod}>for et tilbud</p>
                        <ul className={styles.featureList}>
                            <li><FaCheck /> Alt i Fiskebruk, pluss:</li>
                            <li><FaCheck /> API-integrasjoner</li>
                            <li><FaCheck /> Dedikert support</li>
                            <li><FaCheck /> Volumrabatter</li>
                            <li><FaCheck /> Tilpassede rapporter</li>
                        </ul>
                        <div className={styles.ctaWrapper}>
                            <Button to="/kontakt" variant="primary">
                                Kontakt oss
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </GenericInfoPage>
    );
};

export default PriserPage;