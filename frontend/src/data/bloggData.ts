import markedetImage from '../assets/images/features/markedet.png';
import sikkerhetImage from '../assets/images/features/godkjenn-sluttseddel.png';
import teknologiImage from '../assets/images/fisk1.jpg';

export interface Artikkel {
    slug: string;
    title: string;
    publicationDate: string;
    author: string;
    ingress: string;
    image: string;
    altText: string;
    content: string; 
}

export const artikler: Artikkel[] = [
    {
        slug: 'visjonen-bak-fangstportalen',
        title: 'Visjonen bak Fangstportalen: En Digital Revolusjon for Norsk Sjømat',
        publicationDate: '30. juli 2025',
        author: 'Martin Pettersen',
        ingress: 'Hvordan kan teknologi løse et av de mest gjenstridige problemene i sjømatnæringen? En dypdykk i designfilosofien og de tekniske valgene som driver Fangstportalen.',
        image: markedetImage,
        altText: 'Skjermbilde av Fangstportalens markedsplass',
        content: `
            <p>Norsk sjømatnæring er en av landets viktigste eksportnæringer, men i førstehåndsomsetningen har den lenge vært preget av manuelle prosesser, telefonbaserte avtaler og en fundamental mangel på transparent, digitalisert dataflyt. Dette skaper ikke bare ineffektivitet, men åpner også for systematisk økonomisk kriminalitet som undergraver tilliten til hele systemet.</p>
            <p>Fangstportalen ble født ut av en enkel, men kraftig idé: Hva om vi kunne bygge et digitalt økosystem hvor hver eneste transaksjon var sporbar, verifiserbar og uforanderlig? Et system der tillit ikke er noe man håper på, men noe som er innebygget i selve arkitekturen.</p>
            <h3>Sikkerhet ved Design</h3>
            <p>Kjernen i vår løsning er en tilstandsdrevet arbeidsflyt. En avtale er ikke bare en løs enighet; det er en digital kontrakt som, når den er inngått, setter i gang en forhåndsdefinert og låst prosess. Hvert steg – fra bud til ordre til sluttseddel – er en logisk konsekvens av det forrige, kryptografisk sikret og bilateralt godkjent. Dette fjerner "gråsonene" hvor juks tradisjonelt finner sted.</p>
        `
    },
    {
        slug: 'en-sikker-arkitektur',
        title: 'En Arkitektur for Tillit: Multi-Tenancy og Sikkerhet i Praksis',
        publicationDate: '28. juli 2025',
        author: 'Martin Pettersen',
        ingress: 'Hvordan sikrer vi at data fra Rederi A aldri kan lekke til Rederi B? En titt under panseret på vår kompromissløse multi-tenant arkitektur.',
        image: sikkerhetImage,
        altText: 'En digital sluttseddel som godkjennes',
        content: `
            <p>I en B2B SaaS-plattform er datasegregering alt. Vår fundamentale designbeslutning var å bygge en streng multi-tenant modell der organisasjonen, ikke brukeren, er den primære enheten. All data er merket med en <strong>org_id</strong>.</p>
            <p>Ved hver innlogging bruker vi Auth0 Actions til å injisere brukerens <strong>org_id</strong> og roller i deres JWT-token. Dette tokenet blir vår "hellige gral" i backend. For hvert eneste innkommende API-kall, validerer Spring Security tokenet og trekker ut disse claims. Hver eneste database-spørring vi utfører, inneholder en ufravikelig <strong>WHERE eier_organisasjon_id = ?</strong>-klausul. Dette er ikke en valgfri sjekk; det er en innebygget del av datatilgangslaget. Resultatet er et vanntett skott mellom hver klient på plattformen.</p>
        `
    },
    {
        slug: 'teknologivalg-og-fremtid',
        title: 'Teknologivalg og Veien Videre',
        publicationDate: '25. juli 2025',
        author: 'Martin Pettersen',
        ingress: 'Fra Java og Spring Boot til React og TypeScript – hvorfor vi valgte denne stacken, og hva det betyr for fremtidens utviklingsmuligheter.',
        image: teknologiImage,
        altText: 'Fiskebåt på havet ved soloppgang',
        content: `
            <p>Valget av teknologistack var drevet av et ønske om robusthet, skalerbarhet og et rikt økosystem. Java med Spring Boot gir en utrolig kraftig og moden plattform for å bygge komplekse, sikre og vedlikeholdbare backend-tjenester. Kombinert med PostgreSQL, har vi en databaseløsning som er anerkjent for sin pålitelighet og dataintegritet.</p>
            <p>På frontend-siden gir Vite, React og TypeScript oss muligheten til å bygge en lynrask, interaktiv og typesikker brukeropplevelse. Denne moderne stacken gjør det enkelt å utvikle og vedlikeholde komplekse brukergrensesnitt. Hele applikasjonen er containerisert med Docker, noe som sikrer et konsistent miljø fra en utviklers laptop til en produksjonsserver i skyen. Dette fundamentet gjør det mulig å enkelt utvide med fremtidige integrasjoner, enten det er mot regnskapssystemer, offentlige rapporteringsorganer eller direkte mot utstyr i styrhuset.</p>
        `
    }
];

export const getArtikkelBySlug = (slug: string) => artikler.find(a => a.slug === slug);