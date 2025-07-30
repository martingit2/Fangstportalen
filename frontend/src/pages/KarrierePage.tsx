import React from 'react';
import GenericInfoPage from '../components/info/GenericInfoPage';
import PageHeader from '../components/info/PageHeader';
import ContentSection from '../components/info/ContentSection';
import styles from './KarrierePage.module.css';
import { FaUserGraduate, FaGithub, FaLinkedin, FaEnvelope, FaServer, FaPalette, FaProjectDiagram } from 'react-icons/fa';

const KarrierePage: React.FC = () => {
    return (
        <GenericInfoPage>
            <PageHeader
                title="Bygg Fremtidens Sjømatnæring"
                subtitle="En visjon for teamet vi en dag håper å bygge for å revolusjonere en tradisjonsrik industri."
            />

            <ContentSection title="Vår Filosofi">
                <p>
                    Vi ser for oss et team av lidenskapelige individer som brenner for å løse komplekse problemer med elegant teknologi. Hos oss vil du jobbe i krysningspunktet mellom en fundamental norsk næring og nyskapende digitalisering. Vårt mål er å bygge verktøy som er så intuitive og kraftige at de blir en uunnværlig del av hverdagen for fiskere og fiskebruk.
                </p>
            </ContentSection>

            <ContentSection title="Fremtidige Roller">
                <div className={styles.roleGrid}>
                    <div className={styles.roleCard}>
                        <div className={styles.cardIcon}><FaServer /></div>
                        <h3>Backend-utvikler</h3>
                        <p>Du vil bygge og vedlikeholde den sikre og skalerbare kjernen av Fangstportalen, med fokus på dataintegritet og ytelse.</p>
                    </div>
                     <div className={styles.roleCard}>
                        <div className={styles.cardIcon}><FaPalette /></div>
                        <h3>Frontend-utvikler</h3>
                        <p>Du vil oversette komplekse arbeidsflyter til intuitive og responsive brukergrensesnitt som fungerer like godt i styrhuset som på kontoret.</p>
                    </div>
                     <div className={styles.roleCard}>
                        <div className={styles.cardIcon}><FaProjectDiagram /></div>
                        <h3>UI/UX Designer</h3>
                        <p>Du vil være stemmen til våre brukere og designe opplevelser som er både vakre og funksjonelle, og som løser reelle problemer.</p>
                    </div>
                </div>
            </ContentSection>

            <div className={styles.disclaimerSection}>
                <div className={styles.disclaimerContent}>
                    <div className={styles.disclaimerIcon}><FaUserGraduate /></div>
                    <h2>En Note fra Utvikleren</h2>
                    <p>
                        Fangstportalen er for øyeblikket et porteføljeprosjekt, utviklet og vedlikeholdt av én student. Det finnes derfor ingen aktive stillingsutlysninger på nåværende tidspunkt.
                    </p>
                    <p>
                        Prosjektet fungerer som en demonstrasjon av tekniske ferdigheter og en visjon for hva som er mulig. Om du er imponert, eller har innspill eller muligheter, er du velkommen til å ta kontakt.
                    </p>
                    <div className={styles.socialLinks}>
                        <a href="https://github.com/martingit2" target="_blank" rel="noopener noreferrer">
                            <FaGithub /> GitHub
                        </a>
                        <a href="https://no.linkedin.com/in/mpetters1" target="_blank" rel="noopener noreferrer">
                            <FaLinkedin /> LinkedIn
                        </a>
                         <a href="mailto:martinp@dubium.no">
                            <FaEnvelope /> E-post
                        </a>
                    </div>
                </div>
            </div>
        </GenericInfoPage>
    );
};

export default KarrierePage;