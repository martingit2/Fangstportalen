import React from 'react';
import GenericInfoPage from '../components/info/GenericInfoPage';
import PageHeader from '../components/info/PageHeader';
import styles from './KontaktPage.module.css';
import Button from '../components/ui/Button';
import inputStyles from '../components/ui/Input.module.css';
import { FaEnvelope, FaPhone, FaGithub, FaLinkedin, FaUserGraduate } from 'react-icons/fa';

const KontaktPage: React.FC = () => {
    return (
        <GenericInfoPage>
            <PageHeader
                title="Ta Kontakt"
                subtitle="Har du spørsmål, tekniske innspill eller ønsker å diskutere en mulighet? Jeg hører gjerne fra deg."
            />
            <div className={styles.pageWrapper}>
                <div className={styles.contactGrid}>
                    <div className={styles.formWrapper}>
                        <h2 className={styles.sectionTitle}>Send en melding</h2>
                        <form className={styles.form}>
                            <div className={inputStyles.formRow}>
                                <label htmlFor="name" className={inputStyles.label}>Navn</label>
                                <input id="name" type="text" className={inputStyles.input} required />
                            </div>
                            <div className={inputStyles.formRow}>
                                <label htmlFor="email" className={inputStyles.label}>E-post</label>
                                <input id="email" type="email" className={inputStyles.input} required />
                            </div>
                            <div className={inputStyles.formRow}>
                                <label htmlFor="message" className={inputStyles.label}>Melding</label>
                                <textarea id="message" rows={6} className={inputStyles.input} required></textarea>
                            </div>
                            <Button type="submit" variant="primary">Send melding</Button>
                        </form>
                    </div>
                    <div className={styles.infoWrapper}>
                        <div className={styles.infoBlock}>
                            <h3 className={styles.infoTitle}>Direkte Kontakt</h3>
                            <div className={styles.infoItem}>
                                <FaEnvelope />
                                <span>kontakt@fangstportalen.no</span>
                            </div>
                            <div className={styles.infoItem}>
                                <FaPhone />
                                <span>+47 123 45 678</span>
                            </div>
                        </div>

                        <div className={styles.infoBlock}>
                            <h3 className={styles.infoTitle}><FaUserGraduate /> Om Prosjektet</h3>
                            <p>
                                Fangstportalen er et porteføljeprosjekt utviklet av en student for å demonstrere ferdigheter innen fullstack-utvikling og sikker systemarkitektur.
                            </p>
                            <p className={styles.disclaimer}>
                                <strong>Viktig:</strong> Applikasjonen er en prototype og skal ikke under noen omstendigheter brukes for reell, kommersiell omsetning av sjømat. All data er kun for demonstrasjonsformål.
                            </p>
                        </div>
                        
                        <div className={styles.infoBlock}>
                             <h3 className={styles.infoTitle}>Følg Med</h3>
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
                </div>
            </div>
        </GenericInfoPage>
    );
};

export default KontaktPage;