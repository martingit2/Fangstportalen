import React from 'react';
import GenericInfoPage from '../components/info/GenericInfoPage';
import PageHeader from '../components/info/PageHeader';
import styles from './OmOssPage.module.css';
import { FaUserGraduate, FaGithub, FaLinkedin, FaEnvelope, FaExclamationTriangle, FaBullseye } from 'react-icons/fa';

const OmOssPage: React.FC = () => {
    return (
        <GenericInfoPage>
            <PageHeader
                title="Fra Idé til Applikasjon"
                subtitle="Historien og visjonen bak Fangstportalen."
            />
            <div className={styles.pageWrapper}>
                <div className={styles.contentCard}>
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}><FaBullseye /> Misjonen</h2>
                        <p>
                            Fangstportalen ble unnfanget som et svar på en reell utfordring i sjømatnæringen: mangelen på et moderne, transparent og sikkert digitalt økosystem for førstehåndsomsetning. Målet var å designe og bygge en plattform fra grunnen av som teknisk eliminerer mulighetene for svindel og ineffektivitet som preger manuelle, papirbaserte systemer.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}><FaUserGraduate /> Utvikleren</h2>
                        <div className={styles.developerProfile}>
                            <div className={styles.avatar}>MP</div>
                            <div className={styles.developerInfo}>
                                <h3>Martin Pettersen</h3>
                                <p>IT-student med en lidenskap for å bygge robuste fullstack-løsninger. Dette prosjektet er en demonstrasjon av ferdigheter innen enterprise-arkitektur, sikkerhet og moderne web-teknologier.</p>
                                <div className={styles.socialLinks}>
                                    <a href="https://github.com/martingit2" target="_blank" rel="noopener noreferrer">
                                        <FaGithub /> GitHub
                                    </a>
                                    <a href="https://no.linkedin.com/in/mpetters1" target="_blank" rel="noopener noreferrer">
                                        <FaLinkedin /> LinkedIn
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}><FaExclamationTriangle /> Prosjektstatus & Ansvarsfraskrivelse</h2>
                        <div className={styles.disclaimerBox}>
                            <p>
                                <strong>Dette er et porteføljeprosjekt og en teknisk prototype.</strong>
                            </p>
                            <p>
                                Applikasjonen er utviklet for lærings- og demonstrasjonsformål og skal <strong>ikke</strong> under noen omstendigheter benyttes for reell kommersiell handel med sjømat. All data i systemet er fiktiv.
                            </p>
                        </div>
                    </section>

                    <section className={styles.section}>
                         <h2 className={styles.sectionTitle}><FaEnvelope /> Kontakt</h2>
                         <p>For spørsmål, tekniske innspill eller karrieremuligheter, kan jeg nås på:</p>
                         <a href="mailto:martinp@dubium.no" className={styles.emailLink}>martinp@dubium.no</a>
                    </section>
                </div>
            </div>
        </GenericInfoPage>
    );
};

export default OmOssPage;