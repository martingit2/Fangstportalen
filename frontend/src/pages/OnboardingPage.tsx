import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import apiClient from '../services/apiService';
import styles from './OnboardingPage.module.css';
import Button from '../components/ui/Button';

type OrgType = 'REDERI' | 'FISKEBRUK';

const OnboardingPage: React.FC = () => {
    const [orgType, setOrgType] = useState<OrgType | null>(null);
    const [orgName, setOrgName] = useState('');
    const [orgNr, setOrgNr] = useState('');
    const [fartoyNavn, setFartoyNavn] = useState('');
    const [fiskerimerke, setFiskerimerke] = useState('');
    const [kallesignal, setKallesignal] = useState('');
    const { logout } = useAuth0();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            navn: orgName,
            organisasjonsnummer: orgNr,
            type: orgType,
            fartoy: orgType === 'REDERI' ? [{ navn: fartoyNavn, fiskerimerke, kallesignal }] : []
        };
        try {
            await apiClient.post('/onboarding/registrer', payload);
            alert("Registrering vellykket! Logg inn på nytt for å få tilgang til ditt nye dashboard.");
            logout({ logoutParams: { returnTo: window.location.origin } });
        } catch (error) {
            alert('En feil oppstod under registrering.');
        }
    };
    
    if (!orgType) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <h1>Velkommen til Fangstportalen!</h1>
                    <p>For å fortsette, velg hvilken type organisasjon du representerer.</p>
                    <div className={styles.choiceButtons}>
                        <Button onClick={() => setOrgType('REDERI')}>Rederi</Button>
                        <Button onClick={() => setOrgType('FISKEBRUK')}>Fiskebruk</Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1>Registrer {orgType === 'REDERI' ? 'Rederi' : 'Fiskebruk'}</h1>
                <form onSubmit={handleSubmit}>
                    <input value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="Navn på organisasjon" required />
                    <input value={orgNr} onChange={e => setOrgNr(e.target.value)} placeholder="Organisasjonsnummer (9 siffer)" required />
                    {orgType === 'REDERI' && (
                        <>
                            <h2>Registrer ditt første fartøy</h2>
                            <input value={fartoyNavn} onChange={e => setFartoyNavn(e.target.value)} placeholder="Fartøynavn" required />
                            <input value={fiskerimerke} onChange={e => setFiskerimerke(e.target.value)} placeholder="Fiskerimerke (eks: F-123-A)" required />
                            <input value={kallesignal} onChange={e => setKallesignal(e.target.value)} placeholder="Kallesignal" required />
                        </>
                    )}
                    <div className={styles.formActions}>
                        <Button type="submit">Fullfør registrering</Button>
                        <Button variant="secondary" onClick={() => setOrgType(null)}>Tilbake</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OnboardingPage;