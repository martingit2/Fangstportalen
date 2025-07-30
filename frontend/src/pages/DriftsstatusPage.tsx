import React from 'react';
import GenericInfoPage from '../components/info/GenericInfoPage';
import PageHeader from '../components/info/PageHeader';
import ContentSection from '../components/info/ContentSection';
import styles from './DriftsstatusPage.module.css';
import { FaCheckCircle, FaServer, FaReact, FaDatabase, FaShieldAlt } from 'react-icons/fa';
import Button from '../components/ui/Button';
import inputStyles from '../components/ui/Input.module.css';

const DriftsstatusPage: React.FC = () => {
    return (
        <GenericInfoPage>
            <PageHeader
                title="Driftsstatus"
                subtitle="Oversikt over tilgjengeligheten til Fangstportalens tjenester."
            />
            
            <div className={styles.pageWrapper}>
                <div className={styles.statusBanner}>
                    <FaCheckCircle className={styles.bannerIcon} />
                    <div className={styles.bannerText}>
                        <h2>Alle systemer er operative</h2>
                        <p>Sist oppdatert: {new Date().toLocaleDateString('nb-NO', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                    </div>
                </div>

                <ContentSection title="Systemkomponenter">
                    <div className={styles.componentList}>
                        <div className={styles.componentItem}>
                            <div className={styles.componentName}><FaReact /> Frontend Applikasjon</div>
                            <div className={styles.componentStatus}><FaCheckCircle /> Operativ</div>
                        </div>
                        <div className={styles.componentItem}>
                            <div className={styles.componentName}><FaServer /> API Tjenester</div>
                            <div className={styles.componentStatus}><FaCheckCircle /> Operativ</div>
                        </div>
                        <div className={styles.componentItem}>
                            <div className={styles.componentName}><FaDatabase /> Database</div>
                            <div className={styles.componentStatus}><FaCheckCircle /> Operativ</div>
                        </div>
                        <div className={styles.componentItem}>
                            <div className={styles.componentName}><FaShieldAlt /> Autentiseringstjeneste</div>
                            <div className={styles.componentStatus}><FaCheckCircle /> Operativ</div>
                        </div>
                    </div>
                </ContentSection>

                <ContentSection title="Hendelseshistorikk">
                    <div className={styles.incidentHistory}>
                        <p>Ingen hendelser rapportert de siste 90 dagene.</p>
                    </div>
                </ContentSection>
            </div>

            <div className={styles.subscribeSection}>
                <h3>Abonner på oppdateringer</h3>
                <p>Få varsler via e-post ved driftsforstyrrelser.</p>
                <form className={styles.subscribeForm}>
                    <input type="email" placeholder="din-epost@domene.no" className={inputStyles.input} />
                    <Button type="submit" variant="secondary">Abonner</Button>
                </form>
            </div>
            
        </GenericInfoPage>
    );
};

export default DriftsstatusPage;