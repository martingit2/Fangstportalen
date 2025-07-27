import React, { useEffect, useState, useCallback } from 'react';
import apiClient from '../services/apiService';
import styles from './DashboardPage.module.css';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import { useRoles } from '../hooks/usePermissions';
import { getMineOrdrer } from '../services/apiService';
import type { OrdreResponseDto } from '../types/ordre';

type SluttseddelStatus = 'KLADD' | 'SIGNERT_AV_FISKER' | 'BEKREFTET_AV_MOTTAK' | 'AVVIST';

interface Sluttseddel {
    id: number;
    landingsdato: string;
    fartoyNavn: string;
    leveringssted: string;
    fiskeslag: string;
    kvantum: number;
    status: SluttseddelStatus;
}

const SkipperDashboard: React.FC = () => {
    const [sluttsedler, setSluttsedler] = useState<Sluttseddel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [signingId, setSigningId] = useState<number | null>(null);
    const { roles, isLoading: rolesLoading } = useRoles();

    const fetchSluttsedler = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await apiClient.get<Sluttseddel[]>('/sluttsedler/mine');
            setSluttsedler(response.data);
        } catch (err) {
            setError('Kunne ikke hente sluttsedler. Prøv igjen senere.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSluttsedler();
    }, [fetchSluttsedler]);

    const handleSign = async (sluttseddelId: number) => {
        setSigningId(sluttseddelId);
        try {
            await apiClient.post(`/sluttsedler/${sluttseddelId}/signer-fisker`);
            await fetchSluttsedler();
        } catch (err) {
            alert('En feil oppstod under signering.');
            console.error(err);
        } finally {
            setSigningId(null);
        }
    };
    
    const isSkipper = roles.includes('rederi-skipper');

    const renderContent = () => {
        if (isLoading) return <div className={styles.loading}>Laster dine sluttsedler...</div>;
        if (error) return <div className={styles.error}>{error}</div>;
        if (sluttsedler.length === 0) return <div className={styles.empty}>Du har ingen registrerte sluttsedler.</div>;
        
        return (
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Dato</th><th>Fartøy</th><th>Status</th><th className={styles.alignRight}>Kvantum (kg)</th><th>Handlinger</th>
                    </tr>
                </thead>
                <tbody>
                    {sluttsedler.map((seddel) => (
                        <tr key={seddel.id}>
                            <td>{seddel.landingsdato}</td>
                            <td>{seddel.fartoyNavn}</td>
                            <td><StatusBadge status={seddel.status} /></td>
                            <td className={styles.alignRight}>{seddel.kvantum.toLocaleString('nb-NO')}</td>
                            <td>
                                {seddel.status === 'KLADD' && isSkipper && (
                                    <Button variant="secondary" onClick={() => handleSign(seddel.id)} disabled={signingId === seddel.id}>
                                        {signingId === seddel.id ? 'Signerer...' : 'Signer'}
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Mine Sluttsedler</h1>
                {!rolesLoading && isSkipper && (
                    <Button to="/dashboard/ny-sluttseddel">Registrer ny sluttseddel</Button>
                )}
            </header>
            <div className={styles.content}>{renderContent()}</div>
        </div>
    );
};

const InnkjoperDashboard: React.FC = () => {
    const [ordrer, setOrdrer] = useState<OrdreResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrdrer = async () => {
            try {
                const response = await getMineOrdrer();
                setOrdrer(response.data);
            } catch (err) {
                console.error("Feil ved henting av ordrer:", err);
                setError("Kunne ikke laste inn ordreoversikten.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrdrer();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return <div className={styles.loading}>Laster dine ordrer...</div>;
        }
        if (error) {
            return <div className={styles.error}>{error}</div>;
        }
        if (ordrer.length === 0) {
            return <div className={styles.empty}>Du har ingen aktive ordrer.</div>;
        }

        return (
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Ordre ID</th>
                        <th>Opprettet</th>
                        <th>Status</th>
                        <th className={styles.alignRight}>Antall linjer</th>
                    </tr>
                </thead>
                <tbody>
                    {ordrer.map((ordre) => (
                        <tr key={ordre.id}>
                            <td>#{ordre.id}</td>
                            <td>{new Date(ordre.opprettetTidspunkt).toLocaleDateString('nb-NO')}</td>
                            <td>{ordre.status}</td>
                            <td className={styles.alignRight}>{ordre.ordrelinjer.length}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Ordreadministrasjon</h1>
                <Button to="/dashboard/ny-ordre">Opprett ny ordre</Button>
            </header>
            <div className={styles.content}>
                {renderContent()}
            </div>
        </div>
    );
};

const DashboardPage: React.FC = () => {
    const { roles, isLoading } = useRoles();
    
    if (isLoading) {
        return <div>Laster brukerinformasjon...</div>;
    }

    if (roles.includes('fiskebruk-innkjoper')) {
        return <InnkjoperDashboard />;
    }

    if (roles.includes('rederi-skipper')) {
        return <SkipperDashboard />;
    }

    return <div>Ukjent rolle. Kontakt administrator.</div>;
};

export default DashboardPage;