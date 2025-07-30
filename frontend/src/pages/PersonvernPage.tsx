import React from 'react';
import GenericInfoPage from '../components/info/GenericInfoPage';
import PageHeader from '../components/info/PageHeader';
import styles from './LegalPage.module.css';
import { FaUserShield, FaDatabase, FaLock, FaBalanceScale, FaInfoCircle } from 'react-icons/fa';

const PersonvernPage: React.FC = () => {
    return (
        <GenericInfoPage>
            <PageHeader
                title="Personvernerklæring"
                subtitle="Din tillit er viktig for oss. Her forklarer vi hvordan vi samler inn, bruker og beskytter dine data."
            />

            <div className={styles.pageWrapper}>
                <div className={styles.contentCard}>
                    <div className={styles.summaryBox}>
                        <div className={styles.summaryIcon}><FaInfoCircle /></div>
                        <div>
                            <h4>Kort fortalt</h4>
                            <p>Vi samler kun inn data som er nødvendig for å levere tjenesten, som din e-post og organisasjonsinformasjon. Vi selger aldri dine data. All autentisering håndteres av sikre, tredjeparts løsninger (Auth0). Dette er et studentprosjekt, og dataene brukes kun for demonstrasjonsformål.</p>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}><FaUserShield /> 1. Behandlingsansvarlig</h2>
                        <p>Martin Pettersen er, som utvikler av dette studentprosjektet, behandlingsansvarlig for personopplysningene som behandles i Fangstportalen. Henvendelser kan rettes til <a href="mailto:martinp@dubium.no">martinp@dubium.no</a>.</p>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}><FaDatabase /> 2. Hvilke data samler vi inn?</h2>
                        <p>Vi samler inn og behandler følgende kategorier av personopplysninger:</p>
                        <ul>
                            <li><strong>Kontoinformasjon:</strong> E-postadresse, navn og et unikt bruker-ID levert av vår autentiseringstjeneste (Auth0).</li>
                            <li><strong>Organisasjonsdata:</strong> Informasjon du oppgir under onboarding, som organisasjonsnavn, adresse og kontaktinformasjon.</li>
                            <li><strong>Transaksjonsdata:</strong> Data knyttet til fangstmeldinger, bud, ordrer og sluttsedler. Denne dataen er knyttet til din organisasjon, ikke direkte til deg som person, men kan spores tilbake til din bruker-ID.</li>
                            <li><strong>Teknisk informasjon:</strong> Vi bruker ikke informasjonskapsler for sporing. Kun funksjonelle kapsler for å holde deg innlogget.</li>
                        </ul>
                    </div>
                    
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}><FaLock /> 3. Hvordan vi sikrer dine data</h2>
                        <p>Sikkerhet er kjernen i vår plattform. Vi benytter følgende tiltak for å beskytte dine data:</p>
                        <ul>
                            <li><strong>Identitetshåndtering via Auth0:</strong> All passordhåndtering, innlogging og autentisering er delegert til Auth0, en bransjeledende og sertifisert identitetsplattform. Vi lagrer aldri passord.</li>
                            <li><strong>Kryptering:</strong> All kommunikasjon mellom din nettleser og våre servere er kryptert med TLS (HTTPS).</li>
                            <li><strong>Tilgangskontroll:</strong> Vår strenge, rollebaserte multi-tenant arkitektur sikrer at kun autoriserte brukere innenfor din organisasjon har tilgang til dine data.</li>
                        </ul>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}><FaBalanceScale /> 4. Dine rettigheter</h2>
                        <p>Du har rett til innsyn i, retting av, og sletting av personopplysningene vi har lagret om deg. Siden dette er et demonstrasjonsprosjekt, kan henvendelser om dette rettes direkte til kontaktpersonen nevnt i punkt 1.</p>
                    </div>
                </div>
            </div>
        </GenericInfoPage>
    );
};

export default PersonvernPage;