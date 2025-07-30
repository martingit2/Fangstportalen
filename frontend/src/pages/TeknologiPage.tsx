import React from 'react';
import GenericInfoPage from '../components/info/GenericInfoPage';
import PageHeader from '../components/info/PageHeader';
import ContentSection from '../components/info/ContentSection';
import styles from './TeknologiPage.module.css';
import { FaJava, FaReact, FaDatabase, FaShieldAlt, FaDocker } from 'react-icons/fa';
import { SiSpringboot, SiTypescript, SiPostgresql, SiAuth0 } from 'react-icons/si';

const TeknologiPage: React.FC = () => {
    return (
        <GenericInfoPage>
            <PageHeader
                title="Teknologi og Arkitektur"
                subtitle="Bygget på en moderne, sikker og skalerbar teknologistack for å levere enestående ytelse og pålitelighet."
            />
            <ContentSection title="Vår Filosofi">
                <p>
                    Fangstportalen er designet som en Enterprise B2B SaaS-plattform med et kompromissløst fokus på sikkerhet, skalerbarhet og en profesjonell brukeropplevelse. Hver komponent i vår arkitektur er nøye valgt for å møte de krevende behovene i en moderne, digital sjømatnæring.
                </p>
            </ContentSection>
            
            <ContentSection title="Teknologistack">
                <div className={styles.techGrid}>
                    <div className={styles.techCard}>
                        <div className={styles.cardIcon}><FaJava /> <SiSpringboot /></div>
                        <h3>Backend</h3>
                        <p>Kjernen i vår tjeneste er en robust API bygget med Java 21 og Spring Boot 3. Vi benytter Spring Data JPA for datatilgang og Spring Security for sikkerhet i verdensklasse.</p>
                    </div>
                    <div className={styles.techCard}>
                        <div className={styles.cardIcon}><FaReact /> <SiTypescript /></div>
                        <h3>Frontend</h3>
                        <p>Et lynraskt og responsivt brukergrensesnitt levert av en moderne Single-Page Application (SPA), bygget med Vite, React 18 og TypeScript for full typesikkerhet.</p>
                    </div>
                    <div className={styles.techCard}>
                        <div className={styles.cardIcon}><FaDatabase /> <SiPostgresql /></div>
                        <h3>Database</h3>
                        <p>All data lagres sikkert i en PostgreSQL 16-database, en anerkjent og pålitelig løsning for transaksjonsintensive applikasjoner som krever høy dataintegritet.</p>
                    </div>
                    <div className={styles.techCard}>
                        <div className={styles.cardIcon}><FaShieldAlt /> <SiAuth0 /></div>
                        <h3>Identitet og Sikkerhet</h3>
                        <p>Brukerautentisering og autorisasjon håndteres av Auth0. Dette gir en sikker, standardisert og skalerbar identitetsløsning med støtte for avanserte arbeidsflyter.</p>
                    </div>
                    <div className={styles.techCard}>
                        <div className={styles.cardIcon}><FaDocker /></div>
                        <h3>Infrastruktur og DevOps</h3>
                        <p>Hele applikasjonen er containerisert med Docker og orkestrert med Docker Compose. Dette sikrer et konsistent, reproduserbart og skalerbart miljø fra utvikling til produksjon.</p>
                    </div>
                </div>
            </ContentSection>

            <ContentSection title="Om Prosjektet">
                 <p>
                    Dette er et porteføljeprosjekt utviklet av en student for å demonstrere og anvende ferdigheter innen moderne fullstack-utvikling, systemdesign og sikker arkitektur. Plattformen fungerer som en fullt funksjonell prototype og et bevis på konsept, men er ikke ment for kommersiell bruk i sin nåværende form.
                </p>
            </ContentSection>
        </GenericInfoPage>
    );
};

export default TeknologiPage;