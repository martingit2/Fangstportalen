import React from 'react';
import GenericInfoPage from '../components/info/GenericInfoPage';
import PageHeader from '../components/info/PageHeader';
import ContentSection from '../components/info/ContentSection';
import styles from './SikkerhetPage.module.css';
import { FaFingerprint, FaUsersCog, FaFileContract, FaLock, FaProjectDiagram } from 'react-icons/fa';
import { SiAuth0 } from 'react-icons/si';

const SikkerhetPage: React.FC = () => {
    return (
        <GenericInfoPage>
            <PageHeader
                title="Sikkerhet ved Design"
                subtitle="Fangstportalen er bygget på et fundament av urokkelig, verifiserbar sikkerhet for å beskytte dine data og transaksjoner."
            />

            <ContentSection title="Vår Tilnærming til Sikkerhet">
                <p>
                    I en næring hvor tillit og dataintegritet er avgjørende, tar vi ingen snarveier. Hele vår plattform er designet fra grunnen av med sikkerhet som den absolutte førsteprioritet. Vi kombinerer bransjeledende teknologi med en streng, tilstandsdrevet arkitektur for å eliminere de sårbarhetene som preger tradisjonelle, manuelle systemer.
                </p>
            </ContentSection>

            <ContentSection>
                <div className={styles.securityGrid}>
                    <div className={styles.securityCard}>
                        <div className={styles.cardIcon}><SiAuth0 /></div>
                        <h3>Identitetshåndtering i Enterprise-klasse</h3>
                        <p>All brukerautentisering er delegert til Auth0. Dette beskytter mot vanlige angrep og gir en sentralisert, sikker og skalerbar identitetsløsning.</p>
                    </div>
                    <div className={styles.securityCard}>
                        <div className={styles.cardIcon}><FaFingerprint /></div>
                        <h3>Sikre JWT Claims</h3>
                        <p>Etter hver innlogging, blir brukerens autorisasjon—inkludert organisasjonstilhørighet og roller—kryptografisk signert og innebygd i et JWT-token.</p>
                    </div>
                    <div className={styles.securityCard}>
                        <div className={styles.cardIcon}><FaUsersCog /></div>
                        <h3>Streng Multi-Tenant Arkitektur</h3>
                        <p>Vår backend håndhever datasegregering kompromissløst. Hver eneste databaseoperasjon filtreres basert på organisasjons-ID-en fra det sikre tokenet, noe som gjør det teknisk umulig for én organisasjon å se en annens data.</p>
                    </div>
                    <div className={styles.securityCard}>
                        <div className={styles.cardIcon}><FaLock /></div>
                        <h3>Rollebasert Tilgangskontroll (RBAC)</h3>
                        <p>Presise roller som `REDERI_ADMIN` og `FISKEBRUK_INNKJOPER` definerer nøyaktig hva en bruker kan se og gjøre. Dette minimerer risiko og sikrer at brukere kun har tilgang til nødvendig funksjonalitet.</p>
                    </div>
                    <div className={styles.securityCard}>
                        <div className={styles.cardIcon}><FaProjectDiagram /></div>
                        <h3>Tilstandsdrevet Arbeidsflyt</h3>
                        <p>En transaksjon kan kun bevege seg fremover i en forhåndsdefinert rekkefølge (Avtalt → Under Oppgjør → Fullført). Dette skaper en logisk "chain of custody" som ikke kan manipuleres.</p>
                    </div>
                     <div className={styles.securityCard}>
                        <div className={styles.cardIcon}><FaFileContract /></div>
                        <h3>Uforanderlig Transaksjonshistorikk</h3>
                        <p>Når en sluttseddel er bilateralt verifisert av både kjøper og selger, blir den låst og fungerer som et uforanderlig, digitalt "snapshot" av handelen. Dette eliminerer muligheten for etter snarvei.</p>
                    </div>
                </div>
            </ContentSection>
        </GenericInfoPage>
    );
};

export default SikkerhetPage;