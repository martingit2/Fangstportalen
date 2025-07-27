import React, { useEffect, useState, useCallback } from 'react';
import { getMineOrdrer, getAktiveFangstmeldinger, createOrdreFromFangstmelding } from '../services/apiService';
import styles from './DashboardPage.module.css';
import Button from '../components/ui/Button';
import { useRoles } from '../hooks/usePermissions';
import type { OrdreResponseDto } from '../types/ordre';
import type { FangstmeldingResponseDto } from '../types/fangstmelding';

const SkipperDashboard: React.FC = () => {
    const [isLoading] = useState(false);
    const [error] = useState<string | null>(null);
    const { roles, isLoading: rolesLoading } = useRoles();

    const isSkipper = roles.includes('REDERI_SKIPPER');
    
    const renderContent = () => {
        if (isLoading) return <div className={styles.loading}>Laster...</div>;
        if (error) return <div className={styles.error}>{error}</div>;
        return <div className={styles.empty}>Du har ingen aktive fangstmeldinger.</div>;
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Mine Fangstmeldinger</h1>
                {!rolesLoading && isSkipper && (
                    <Button to="/ny-fangstmelding">Annonser ny fangst</Button>
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

    if (roles.includes('FISKEBRUK_INNKJOPER') || roles.includes('FISKEBRUK_ADMIN')) {
        return <InnkjoperDashboard />;
    }

    if (roles.includes('REDERI_SKIPPER') || roles.includes('REDERI_ADMIN')) {
        return <SkipperDashboard />;
    }

    return <div>Ukjent rolle. Kontakt administrator.</div>;
};

export default DashboardPage;