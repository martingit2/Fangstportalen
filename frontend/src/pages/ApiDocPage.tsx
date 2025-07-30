import React from 'react';
import GenericInfoPage from '../components/info/GenericInfoPage';
import PageHeader from '../components/info/PageHeader';
import ContentSection from '../components/info/ContentSection';
import styles from './ApiDocPage.module.css';
import CodeBlock from '../components/ui/CodeBlock';
import { FaKey, FaBook } from 'react-icons/fa';

const ApiDocPage: React.FC = () => {
    return (
        <GenericInfoPage>
            <PageHeader
                title="API-dokumentasjon"
                subtitle="Teknisk oversikt over Fangstportalens REST API for utviklere og partnere."
            />

            <ContentSection title="Introduksjon">
                <p>
                    Vårt API er bygget på REST-prinsipper og returnerer forutsigbar, JSON-formatert data. Alle endepunkter følger en standardisert struktur og krever autentisering for tilgang.
                </p>
            </ContentSection>

            <ContentSection title="Autentisering">
                <div className={styles.authSection}>
                    <div className={styles.authIcon}><FaKey /></div>
                    <div>
                        <h3>Bearer Token (JWT)</h3>
                        <p>Alle kall til API-et må inkludere en `Authorization`-header med et gyldig JWT Bearer-token hentet fra vår Auth0-tjeneste.</p>
                        <CodeBlock code={`curl "https://api.fangstportalen.no/api/v1/ordrer/mine" \\\n  -H "Authorization: Bearer <DITT_JWT_TOKEN>"`} />
                    </div>
                </div>
            </ContentSection>
            
            <ContentSection title="Eksempler på Endepunkter">
                <div className={styles.endpointCard}>
                    <div className={styles.endpointHeader}>
                        <span className={`${styles.method} ${styles.methodGet}`}>GET</span>
                        <code className={styles.endpointPath}>/api/v1/fangstmeldinger/aktive</code>
                    </div>
                    <div className={styles.endpointBody}>
                        <p>Henter en paginert liste over alle aktive fangstmeldinger i markedet. Støtter filtrering på `leveringssted` og `fiskeslag`.</p>
                        <span className={styles.permissionBadge}>Krever rolle: FISKEBRUK_INNKJOPER</span>
                    </div>
                </div>

                 <div className={styles.endpointCard}>
                    <div className={styles.endpointHeader}>
                        <span className={`${styles.method} ${styles.methodPost}`}>POST</span>
                        <code className={styles.endpointPath}>/api/v1/fangstmeldinger</code>
                    </div>
                    <div className={styles.endpointBody}>
                        <p>Oppretter en ny fangstmelding. Skipperens organisasjon og tildelte fartøy hentes automatisk fra JWT-tokenet.</p>
                        <span className={styles.permissionBadge}>Krever rolle: REDERI_SKIPPER</span>
                    </div>
                </div>

                 <div className={styles.endpointCard}>
                    <div className={styles.endpointHeader}>
                        <span className={`${styles.method} ${styles.methodPatch}`}>PATCH</span>
                        <code className={styles.endpointPath}>/api/v1/sluttsedler/{'{sluttseddelId}'}/bekreft</code>
                    </div>
                    <div className={styles.endpointBody}>
                        <p>Bekrefter og "signerer" en mottatt sluttseddel. Dette låser transaksjonen og flytter ordren til `FULLFØRT`-status.</p>
                        <span className={styles.permissionBadge}>Krever rolle: FISKEBRUK_INNKJOPER</span>
                    </div>
                </div>
            </ContentSection>

            <ContentSection title="Status og Tilgang">
                <div className={styles.statusBox}>
                    <FaBook />
                    <div>
                        <h4>Kun for Demonstrasjon</h4>
                        <p>Dette API-et er en del av et porteføljeprosjekt og er ikke offentlig tilgjengelig for tredjeparts-integrasjoner på nåværende tidspunkt. Denne dokumentasjonen tjener som en demonstrasjon av arkitektur og designprinsipper.</p>
                    </div>
                </div>
            </ContentSection>

        </GenericInfoPage>
    );
};

export default ApiDocPage;