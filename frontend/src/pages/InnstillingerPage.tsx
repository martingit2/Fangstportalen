import React, { useState, useEffect } from 'react';
import Button from '../components/ui/Button';
import { useClaims } from '../hooks/useClaims';
import styles from './InnstillingerPage.module.css';
import { getMineFartoy } from '../services/apiService';
import { getMineTeamMedlemmer } from '../services/apiService';
import type { FartoyResponseDto } from '../types/fartoy';
import type { TeamMedlemResponseDto } from '../types/team';

const FartoySection: React.FC = () => {
    const [fartoyList, setFartoyList] = useState<FartoyResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getMineFartoy();
                setFartoyList(response.data);
            } catch (err) {
                setError('Kunne ikke hente fartøylisten.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return <p>Laster fartøy...</p>;
        }
        if (error) {
            return <p className={styles.errorText}>{error}</p>;
        }
        if (fartoyList.length === 0) {
            return <p>Ingen fartøy er registrert for din organisasjon ennå.</p>;
        }
        return (
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Navn</th>
                        <th>Fiskerimerke</th>
                        <th>Kallesignal</th>
                        <th>Handlinger</th>
                    </tr>
                </thead>
                <tbody>
                    {fartoyList.map((fartoy) => (
                        <tr key={fartoy.id}>
                            <td>{fartoy.navn}</td>
                            <td>{fartoy.fiskerimerke}</td>
                            <td>{fartoy.kallesignal}</td>
                            <td>...</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <section className={styles.section}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Fartøy</h2>
                <Button to="/innstillinger/nytt-fartoy">+ Legg til nytt fartøy</Button>
            </div>
            <div className={styles.card}>
                {renderContent()}
            </div>
        </section>
    );
};

const TeamSection: React.FC = () => {
    const [medlemmer, setMedlemmer] = useState<TeamMedlemResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getMineTeamMedlemmer();
                setMedlemmer(response.data);
            } catch (err) {
                setError('Kunne ikke hente teammedlemmer.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return <p>Laster teammedlemmer...</p>;
        }
        if (error) {
            return <p className={styles.errorText}>{error}</p>;
        }
        return (
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Bruker ID</th>
                        <th>Roller</th>
                        <th>Handlinger</th>
                    </tr>
                </thead>
                <tbody>
                    {medlemmer.map((medlem) => (
                        <tr key={medlem.brukerId}>
                            <td className={styles.brukerIdCell}>{medlem.brukerId}</td>
                            <td>{medlem.roller.join(', ')}</td>
                            <td>...</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <section className={styles.section}>
             <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Team</h2>
                <Button variant="secondary">+ Inviter nytt medlem</Button>
            </div>
            <div className={styles.card}>
                {renderContent()}
            </div>
        </section>
    );
}

const InnstillingerPage: React.FC = () => {
    const { claims, isLoading } = useClaims();

    if (isLoading) {
        return <div>Laster innstillinger...</div>;
    }

    const erRederiAdmin = claims?.roles.includes('REDERI_ADMIN');

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Innstillinger</h1>
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Min Organisasjon</h2>
                <div className={styles.card}>
                    <p>Her vil du kunne administrere organisasjonsdetaljer.</p>
                </div>
            </section>
            
            <TeamSection />

            {erRederiAdmin && <FartoySection />}
        </div>
    );
};

export default InnstillingerPage;