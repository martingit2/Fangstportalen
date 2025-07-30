import React from 'react';
import GenericInfoPage from '../components/info/GenericInfoPage';
import PageHeader from '../components/info/PageHeader';
import ContentSection from '../components/info/ContentSection';
import AccordionItem from '../components/ui/AccordionItem';
import styles from './HjelpesenterPage.module.css';
import Button from '../components/ui/Button';

const HjelpesenterPage: React.FC = () => {
    return (
        <GenericInfoPage>
            <PageHeader
                title="Hjelpesenter"
                subtitle="Her finner du svar på ofte stilte spørsmål. Vi er her for å hjelpe deg med å få mest mulig ut av Fangstportalen."
            />

            <ContentSection title="Kom i gang">
                <div className={styles.faqContainer}>
                    <AccordionItem title="Hvordan registrerer jeg meg?">
                        <p>Nye brukere kan enten registrere seg selv for å opprette en ny organisasjon, eller bli invitert av en administrator til en eksisterende organisasjon. For å starte, klikk på "Kom i gang" på forsiden.</p>
                    </AccordionItem>
                    <AccordionItem title="Hva er forskjellen på et rederi og et fiskebruk?">
                        <p>Et rederi representerer selgersiden – de som annonserer og selger fangst. Et fiskebruk representerer kjøpersiden – de som legger inn bud og kjøper fangst.</p>
                    </AccordionItem>
                </div>
            </ContentSection>

            <ContentSection title="For Rederi">
                 <div className={styles.faqContainer}>
                    <AccordionItem title="Hvordan annonserer jeg en ny fangst?">
                        <p>Fra Markedsplassen, klikk på "Annonser ny fangst". Fyll inn nødvendig informasjon som leveringssted, dato og detaljer om fangsten (fiskeslag, kvantum, pris), og publiser.</p>
                    </AccordionItem>
                    <AccordionItem title="Hvordan aksepterer jeg et bud?">
                        <p>På Markedsplassen kan du klikke "Se bud" på din aktive fangstmelding. Du vil se en liste over alle innkomne bud. Klikk "Aksepter bud" på det budet du ønsker å godta. Dette vil automatisk opprette en bindende ordre.</p>
                    </AccordionItem>
                     <AccordionItem title="Hvordan oppretter jeg en sluttseddel?">
                        <p>Når en ordre er "Avtalt", kan du opprette en sluttseddel fra "Ny Sluttseddel"-siden. Velg den relevante ordren og fyll inn faktisk veid kvantum for å generere og signere seddelen.</p>
                    </AccordionItem>
                </div>
            </ContentSection>

            <ContentSection title="For Fiskebruk">
                 <div className={styles.faqContainer}>
                    <AccordionItem title="Hvordan gir jeg et bud på en fangst?">
                        <p>På Markedsplassen finner du en liste over tilgjengelige fangstmeldinger. Klikk på "Gi bud" på den fangsten du er interessert i, fyll inn dine priser per kilo, og send inn budet.</p>
                    </AccordionItem>
                    <AccordionItem title="Hvordan godkjenner jeg en sluttseddel?">
                        <p>Når en fisker har opprettet en sluttseddel for en leveranse til deg, vil den dukke opp i ditt "Sluttseddelarkiv" med status "Venter på godkjenning". Klikk på seddelen for å se detaljene og velg "Godkjenn" eller "Avvis".</p>
                    </AccordionItem>
                </div>
            </ContentSection>

            <div className={styles.ctaSection}>
                <div className={styles.ctaContent}>
                    <h2>Finner du ikke svaret?</h2>
                    <p>Vårt mål er at plattformen skal være selvforklarende, men noen ganger trenger man litt ekstra hjelp. Ikke nøl med å ta kontakt med oss.</p>
                    <Button to="/kontakt" variant="primary">Kontakt Oss</Button>
                </div>
            </div>

        </GenericInfoPage>
    );
};

export default HjelpesenterPage;