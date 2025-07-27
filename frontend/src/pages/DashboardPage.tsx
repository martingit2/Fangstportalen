import React, { useEffect, useState, useCallback } from 'react';
import apiClient, { getMineOrdrer, getAktiveFangstmeldinger, createOrdreFromFangstmelding } from '../services/apiService';
import styles from './DashboardPage.module.css';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import { useRoles } from '../hooks/usePermissions';
import type { OrdreResponseDto } from '../types/ordre';
import type { FangstmeldingResponseDto } from '../types/fangstmelding';

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
                    <Button to="/ny-sluttseddel">Registrer ny sluttseddel</Button>
                )}
            </header>
            <div className={styles.content}>{renderContent()}</div>
        </div>
    );
};

const InnkjoperDashboard: React.FC = () => {
    const [ordrer, setOrdrer] = useState<OrdreResponseDto[]>([]);
    const [fangstmeldinger, setFangstmeldinger] = useState<FangstmeldingResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAcceptingId, setIsAcceptingId] = useState<number | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [ordrerResponse, fangstmeldingerResponse] = await Promise.all([
                getMineOrdrer(),
                getAktiveFangstmeldinger()
            ]);
            setOrdrer(ordrerResponse.data);
            setFangstmeldinger(fangstmeldingerResponse.data);
            setError(null);
        } catch (err) {
            console.error("Feil ved henting av dashboard-data:", err);
            setError("Kunne ikke laste inn data.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAcceptFangstmelding = async (fangstmeldingId: number) => {
        setIsAcceptingId(fangstmeldingId);
        try {
            await createOrdreFromFangstmelding(fangstmeldingId);
            await fetchData();
        } catch (err) {
            console.error("Feil ved opprettelse av ordre fra fangstmelding:", err);
            alert("Kunne ikke opprette ordre. Fangsten kan allerede være solgt.");
        } finally {
            setIsAcceptingId(null);
        }
    };

    const renderOrdreContent = () => {
        if (isLoading) return <div className={styles.loading}>Laster dine ordrer...</div>;
        if (ordrer.length === 0) return <div className={styles.empty}>Du har ingen aktive ordrer.</div>;

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
    
    const renderMarketplaceContent = () => {
        if (isLoading) return <div className={styles.loading}>Laster markedsplass...</div>;
        if (fangstmeldinger.length === 0) return <div className={styles.empty}>Ingen fangster er tilgjengelig i markedet akkurat nå.</div>;

        return (
            <div className={styles.marketplaceGrid}>
                {fangstmeldinger.map(melding => (
                    <div key={melding.id} className={styles.fangstmeldingCard}>
                        <div className={styles.fangstInfo}>
                            <h3>{melding.fartoyNavn}</h3>
                            <p>Ankommer {melding.leveringssted} den {new Date(melding.tilgjengeligFraDato).toLocaleDateString('nb-NO')}</p>
                            <p className={styles.fangstlinjer}>
                                {melding.fangstlinjer.map(l => `${l.fiskeslag} (~${l.estimertKvantum} kg)`).join(', ')}
                            </p>
                        </div>
                        <Button
                            onClick={() => handleAcceptFangstmelding(melding.id)}
                            disabled={isAcceptingId === melding.id}
                        >
                            {isAcceptingId === melding.id ? 'Oppretter...' : 'Opprett Ordre'}
                        </Button>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Mine Ordrer</h1>
                <Button to="/ny-ordre">Opprett Åpen Ordre</Button>
            </header>
            <div className={styles.content}>
                {error ? <div className={styles.error}>{error}</div> : renderOrdreContent()}
            </div>

            <div className={styles.marketplaceSection}>
                <h2 className={styles.marketplaceTitle}>Tilgjengelig i Markedet</h2>
                <div className={styles.content}>
                    {error ? <div className={styles.error}>{error}</div> : renderMarketplaceContent()}
                </div>
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