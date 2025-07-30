import React from 'react';
import GenericInfoPage from '../components/info/GenericInfoPage';
import PageHeader from '../components/info/PageHeader';
import ContentSection from '../components/info/ContentSection';
import styles from './SystemkravPage.module.css';
import { FaDesktop, FaShip, FaWifi, FaChrome, FaFirefox, FaSafari, FaEdge } from 'react-icons/fa';

const SystemkravPage: React.FC = () => {
    return (
        <GenericInfoPage>
            <PageHeader
                title="Systemkrav"
                subtitle="Fangstportalen er designet for å være tilgjengelig og fungere sømløst på moderne utstyr."
            />

            <ContentSection>
                <div className={styles.requirementGrid}>
                    <div className={styles.requirementCard}>
                        <div className={styles.cardHeader}>
                            <FaDesktop className={styles.headerIcon} />
                            <h2>For Fiskebruket (Kontor)</h2>
                        </div>
                        <p className={styles.cardDescription}>
                            Web-portalen for fiskebruk er tilgjengelig fra en hvilken som helst moderne datamaskin med internett-tilkobling.
                        </p>
                        <ul className={styles.requirementList}>
                            <li>
                                <FaChrome title="Chrome" />
                                <FaFirefox title="Firefox" />
                                <FaSafari title="Safari" />
                                <FaEdge title="Edge" />
                                <span>En moderne nettleser (siste to versjoner)</span>
                            </li>
                            <li>
                                <FaWifi />
                                <span>Stabil internett-tilkobling</span>
                            </li>
                        </ul>
                    </div>

                    <div className={styles.requirementCard}>
                         <div className={styles.cardHeader}>
                            <FaShip className={styles.headerIcon} />
                            <h2>For Rederiet (Styrhus)</h2>
                        </div>
                         <p className={styles.cardDescription}>
                            Vår dedikerte styrhus-terminal er en web-applikasjon som kjører på standardisert maskinvare.
                        </p>
                        <ul className={styles.requirementList}>
                             <li>
                                <FaDesktop />
                                <span>En enhet med nettleser (PC, Mac, tablet)</span>
                            </li>
                            <li>
                                <FaWifi />
                                <span>Internett-tilkobling på havet (f.eks. satellitt)</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </ContentSection>
            
            <ContentSection title="Våre Anbefalinger">
                <p>
                    For den beste og mest responsive opplevelsen anbefaler vi å bruke Google Chrome eller Mozilla Firefox. Selv om applikasjonen vil fungere på de fleste enheter, vil en skjerm med en oppløsning på minst 1920x1080 piksler gi det beste arbeidsområdet for administrasjon på kontoret.
                </p>
            </ContentSection>
        </GenericInfoPage>
    );
};

export default SystemkravPage;