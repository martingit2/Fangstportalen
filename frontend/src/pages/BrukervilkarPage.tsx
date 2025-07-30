import React from 'react';
import GenericInfoPage from '../components/info/GenericInfoPage';
import PageHeader from '../components/info/PageHeader';
import styles from './LegalPage.module.css';
import { FaBook, FaUserCheck, FaBan, FaBalanceScale, FaInfoCircle } from 'react-icons/fa';

const BrukervilkarPage: React.FC = () => {
    return (
        <GenericInfoPage>
            <PageHeader
                title="Brukervilkår"
                subtitle="Vennligst les disse vilkårene nøye før du tar i bruk Fangstportalen."
            />

            <div className={styles.pageWrapper}>
                <div className={styles.contentCard}>
                     <div className={styles.summaryBox}>
                        <div className={styles.summaryIcon}><FaInfoCircle /></div>
                        <div>
                            <h4>Kort fortalt</h4>
                            <p>Ved å bruke Fangstportalen aksepterer du at dette er en <strong>demonstrasjonsapplikasjon</strong> og ikke skal brukes til reell kommersiell aktivitet. Du er selv ansvarlig for innholdet du legger inn, og vi gir ingen garantier for tjenestens oppetid eller dataintegritet.</p>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}><FaBook /> 1. Aksept av Vilkår</h2>
                        <p>Disse brukervilkårene ("Vilkårene") er en avtale mellom deg og utvikleren av Fangstportalen ("Tjenesten"). Ved å opprette en konto eller på annen måte bruke Tjenesten, bekrefter du at du har lest, forstått og akseptert å være bundet av disse Vilkårene.</p>
                    </div>
                    
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}><FaBan /> 2. Tjenestens Formål og Begrensninger</h2>
                        <p>Fangstportalen er et studentutviklet porteføljeprosjekt. Tjenestens formål er utelukkende å demonstrere tekniske konsepter og funksjonalitet.</p>
                        <ul>
                            <li>Tjenesten skal <strong>ikke</strong> under noen omstendighet brukes til reell kommersiell virksomhet, inkludert, men ikke begrenset til, kjøp eller salg av sjømat.</li>
                            <li>All data som legges inn i Tjenesten (f.eks. brukernavn, organisasjonsdata, fangstdata) bør være fiktiv. Ikke last opp sensitiv eller forretningskritisk informasjon.</li>
                            <li>Vi gir ingen garantier for Tjenestens tilgjengelighet, oppetid eller dataintegritet. Datatap kan forekomme.</li>
                        </ul>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}><FaUserCheck /> 3. Brukerens Ansvar</h2>
                        <p>Som bruker av Tjenesten er du ansvarlig for:</p>
                        <ul>
                            <li>Å holde dine innloggingsdetaljer (passord) hemmelig.</li>
                            <li>Å ikke laste opp ulovlig, støtende eller skadelig innhold.</li>
                            <li>Å kun bruke Tjenesten i tråd med dens demonstrasjonsformål.</li>
                        </ul>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}><FaBalanceScale /> 4. Ansvarsfraskrivelse</h2>
                        <p>Tjenesten leveres "som den er", uten noen form for garantier. Utvikleren fraskriver seg alt ansvar for eventuelle direkte eller indirekte tap, inkludert tap av data, som måtte oppstå som følge av bruk eller manglende evne til å bruke Tjenesten.</p>
                    </div>
                </div>
            </div>
        </GenericInfoPage>
    );
};

export default BrukervilkarPage;