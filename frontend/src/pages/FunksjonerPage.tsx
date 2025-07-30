import React, { useState } from 'react';
import GenericInfoPage from '../components/info/GenericInfoPage';
import PageHeader from '../components/info/PageHeader';
import styles from './FunksjonerPage.module.css';
import Lightbox from '../components/ui/Lightbox';
import { FaShoppingCart, FaGavel, FaFileInvoiceDollar, FaChartLine, FaShip, FaExternalLinkAlt, FaAnchor } from 'react-icons/fa';

import markedetImage from '../assets/images/features/markedet.png';
import seBudImage from '../assets/images/features/se-bud.png';
import mineOrdrerImage from '../assets/images/features/mine-ordrer.png';
import opprettSluttseddelImage from '../assets/images/features/opprett-sluttseddel-landing.png';
import godkjennSluttseddelImage from '../assets/images/features/godkjenn-sluttseddel.png';
import statistikkImage from '../assets/images/features/oversikt-stats.png';

const FunksjonerPage: React.FC = () => {
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    const ImagePreview: React.FC<{src: string, alt: string}> = ({ src, alt }) => (
        <div className={styles.imageContainer} onClick={() => setLightboxImage(src)}>
            <img src={src} alt={alt} className={styles.featureImage} />
            <div className={styles.imageOverlay}>
                <FaExternalLinkAlt />
                <span>Forstørr bilde</span>
            </div>
        </div>
    );

    return (
        <GenericInfoPage>
            <PageHeader
                title="En Plattform Bygget for Næringen"
                subtitle="Vi digitaliserer hele verdikjeden fra fangst til oppgjør med kraftige, intuitive verktøy designet for både rederi og fiskebruk."
            />

            <div className={styles.pageContent}>
                <section className={styles.featureSection}>
                    <div className={styles.featureContent}>
                        <div className={styles.featureText}>
                            <h2 className={styles.featureTitle}><FaShoppingCart /> Dynamisk Markedsplass</h2>
                            <p className={styles.tagline}>Sanntidsoversikt for bedre beslutninger.</p>
                            <p>Fangstportalen gir både rederi og fiskebruk en komplett oversikt over tilbud og etterspørsel i markedet. Filtrer, søk og handle med presisjon.</p>
                            <ul>
                                <li>Se alle tilgjengelige fangster</li>
                                <li>Filtrer på sted og fiskeslag</li>
                                <li>Publiser åpne ordrer for å signalisere behov</li>
                            </ul>
                        </div>
                        <ImagePreview src={markedetImage} alt="Skjermbilde av markedsplassen" />
                    </div>
                </section>

                <section className={`${styles.featureSection} ${styles.altBackground}`}>
                    <div className={styles.featureContent}>
                        <div className={styles.featureText}>
                            <h2 className={styles.featureTitle}><FaGavel /> Sikker Budrunde</h2>
                            <p className={styles.tagline}>En arena for profesjonell handel.</p>
                            <p>Innkjøpere kan enkelt gi bud på annonserte fangster. Skippere får en komplett oversikt over alle innkomne bud, inkludert totalverdi og kontaktinformasjon, før de aksepterer.</p>
                            <ul>
                                <li>Gi bud på spesifikke fangstlinjer</li>
                                <li>Full oversikt over alle aktive bud</li>
                                <li>Aksept av bud oppretter automatisk en bindende ordre</li>
                            </ul>
                        </div>
                        <ImagePreview src={seBudImage} alt="Skjermbilde som viser innkomne bud" />
                    </div>
                </section>
                
                <section className={styles.featureSection}>
                    <div className={styles.featureContent}>
                        <div className={styles.featureText}>
                            <h2 className={styles.featureTitle}><FaShip /> Ordreoversikt</h2>
                            <p className={styles.tagline}>Full kontroll på alle dine handler.</p>
                            <p>Et sentralisert dashboard gir deg full oversikt over alle dine ordrer, enten de er aktive i markedet, avtalt med en motpart, eller fullført. Gå aldri glipp av en statusendring.</p>
                            <ul>
                                <li>Filtrer ordrer etter status</li>
                                <li>Se detaljer for hver enkelt handel</li>
                                <li>Administrer åpne ordrer direkte fra oversikten</li>
                            </ul>
                        </div>
                        <ImagePreview src={mineOrdrerImage} alt="Skjermbilde av ordreoversikten" />
                    </div>
                </section>
                
                <section className={`${styles.featureSection} ${styles.altBackground}`}>
                     <div className={styles.featureContent}>
                        <div className={styles.featureText}>
                            <h2 className={styles.featureTitle}><FaAnchor /> Digital Landing</h2>
                            <p className={styles.tagline}>Fra landing til oppgjør – sømløst og sikkert.</p>
                            <p>Eliminer papirarbeid med en heldigital arbeidsflyt. En skipper registrerer veid kvantum direkte på kaien fra en avtalt ordre, noe som genererer en digital sluttseddel umiddelbart.</p>
                            <ul>
                                <li>Opprettes direkte fra en låst ordre</li>
                                <li>Enkel registrering av faktisk landet kvantum</li>
                                <li>Reduserer feil og tidsbruk drastisk</li>
                            </ul>
                        </div>
                        <ImagePreview src={opprettSluttseddelImage} alt="Skjermbilde av registrering av landing for å opprette sluttseddel" />
                    </div>
                </section>

                <section className={styles.featureSection}>
                    <div className={styles.featureContent}>
                        <div className={styles.featureText}>
                            <h2 className={styles.featureTitle}><FaFileInvoiceDollar /> Bilateral Verifisering</h2>
                            <p className={styles.tagline}>Uforanderlig og sporbar tillit.</p>
                            <p>En opprettet sluttseddel er ikke gyldig før begge parter har godkjent. Fiskebruket mottar seddelen for gjennomgang og kan enten godkjenne eller avvise med begrunnelse, noe som skaper en vanntett transaksjonshistorikk.</p>
                            <ul>
                                <li>Kryptografisk sikret arbeidsflyt</li>
                                <li>Transparent godkjenningsprosess for begge parter</li>
                                <li>Eliminerer muligheten for juks og underrapportering</li>
                            </ul>
                        </div>
                        <ImagePreview src={godkjennSluttseddelImage} alt="Skjermbilde av en digital sluttseddel" />
                    </div>
                </section>
                
                <section className={`${styles.featureSection} ${styles.altBackground}`}>
                    <div className={styles.featureContent}>
                        <div className={styles.featureText}>
                            <h2 className={styles.featureTitle}><FaChartLine /> Kraftig Analyseverktøy</h2>
                            <p className={styles.tagline}>Gjør data om til innsikt.</p>
                            <p>Få en dypere forståelse av din virksomhet. Vårt statistikk-dashboard visualiserer dine historiske data og gir deg nøkkeltallene du trenger for strategisk planlegging.</p>
                            <ul>
                                <li>Oversikt over totalverdi og kvantum</li>
                                <li>Detaljerte rapporter per fiskeslag</li>
                                <li>Analyser lønnsomhet per handelspartner</li>
                            </ul>
                        </div>
                        <ImagePreview src={statistikkImage} alt="Skjermbilde av statistikk-dashboardet" />
                    </div>
                </section>
            </div>

            {lightboxImage && (
                <Lightbox 
                    src={lightboxImage} 
                    alt="Forstørret skjermbilde" 
                    onClose={() => setLightboxImage(null)} 
                />
            )}
        </GenericInfoPage>
    );
};

export default FunksjonerPage;