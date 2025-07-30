import React from 'react';
import GenericInfoPage from '../components/info/GenericInfoPage';
import PageHeader from '../components/info/PageHeader';
import ContentSection from '../components/info/ContentSection';
import styles from './PressePage.module.css';
import { FaDownload, FaPalette, FaFileAlt, FaEnvelope } from 'react-icons/fa';

import logoImage from '../assets/images/logo3.png';
import markedetImage from '../assets/images/features/markedet.png';
import seBudImage from '../assets/images/features/se-bud.png';
import godkjennSluttseddelImage from '../assets/images/features/godkjenn-sluttseddel.png';

const PressePage: React.FC = () => {
    return (
        <GenericInfoPage>
            <PageHeader
                title="Presserom"
                subtitle="Ressurser for journalister, bloggere og partnere. Her finner du logoer, bilder og informasjon om Fangstportalen."
            />

            <ContentSection title="Kort om Fangstportalen">
                <p>
                    Fangstportalen er et digitalt økosystem for førstehåndsomsetning av sjømat, bygget på prinsippene om transparens, effektivitet og verifiserbar sikkerhet. Plattformens kjerneformål er å aktivt forhindre økonomisk kriminalitet ved å etablere en digital, uforanderlig og bilateralt verifisert sporbarhetskjede for hver transaksjon.
                </p>
            </ContentSection>

            <ContentSection title="Pressepakke (Media Kit)">
                <div className={styles.assetGrid}>
                    <div className={styles.assetCard}>
                        <div className={styles.assetPreview}>
                            <img src={logoImage} alt="Fangstportalen Logo" className={styles.logoPreview} />
                        </div>
                        <div className={styles.assetInfo}>
                            <h4>Logo</h4>
                            <a href={logoImage} download="fangstportalen-logo.png" className={styles.downloadLink}>
                                <FaDownload /> Last ned (PNG)
                            </a>
                        </div>
                    </div>
                    <div className={styles.assetCard}>
                        <div className={styles.assetPreview}>
                            <img src={markedetImage} alt="Skjermbilde av markedsplassen" />
                        </div>
                        <div className={styles.assetInfo}>
                            <h4>Markedsplass</h4>
                            <a href={markedetImage} download="fangstportalen-markedet.png" className={styles.downloadLink}>
                                <FaDownload /> Last ned
                            </a>
                        </div>
                    </div>
                    <div className={styles.assetCard}>
                        <div className={styles.assetPreview}>
                            <img src={seBudImage} alt="Skjermbilde av bud-modal" />
                        </div>
                         <div className={styles.assetInfo}>
                            <h4>Budrunde</h4>
                            <a href={seBudImage} download="fangstportalen-budrunde.png" className={styles.downloadLink}>
                                <FaDownload /> Last ned
                            </a>
                        </div>
                    </div>
                     <div className={styles.assetCard}>
                        <div className={styles.assetPreview}>
                            <img src={godkjennSluttseddelImage} alt="Skjermbilde av sluttseddel" />
                        </div>
                         <div className={styles.assetInfo}>
                            <h4>Sluttseddel</h4>
                            <a href={godkjennSluttseddelImage} download="fangstportalen-sluttseddel.png" className={styles.downloadLink}>
                                <FaDownload /> Last ned
                            </a>
                        </div>
                    </div>
                </div>
            </ContentSection>
            
            <ContentSection title="Merkevare">
                 <div className={styles.brandGrid}>
                    <div className={styles.brandInfo}>
                        <h4><FaPalette /> Fargepalett</h4>
                        <p>Våre primærfarger for konsistent merkevarebygging.</p>
                        <div className={styles.colorPalette}>
                            <div className={styles.colorSwatchWrapper}>
                                <div className={styles.colorSwatch} style={{ backgroundColor: '#04434b' }}></div>
                                <span>#04434B (Primær)</span>
                            </div>
                             <div className={styles.colorSwatchWrapper}>
                                <div className={styles.colorSwatch} style={{ backgroundColor: '#5F99B1' }}></div>
                                <span>#5F99B1 (Aksent)</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.brandInfo}>
                        <h4><FaFileAlt /> Prosjektbeskrivelse</h4>
                        <p>Foreslått tekst for omtale av prosjektet:</p>
                        <p className={styles.boilerplate}>
                            <strong>Fangstportalen</strong> er et studentutviklet porteføljeprosjekt som demonstrerer en fullstack prototype for en digital markedsplass for sjømat. Applikasjonen er ikke i kommersiell drift.
                        </p>
                    </div>
                </div>
            </ContentSection>

             <ContentSection title="Pressekontakt">
                <p>
                    Som et studentdrevet prosjekt, håndteres all kommunikasjon direkte av utvikleren. For alle henvendelser, vennligst kontakt:
                </p>
                <div className={styles.contactInfo}>
                    <FaEnvelope />
                    <div>
                        <strong>Martin Pettersen</strong><br/>
                        <a href="mailto:martinp@dubium.no">martinp@dubium.no</a>
                    </div>
                </div>
             </ContentSection>

        </GenericInfoPage>
    );
};

export default PressePage;