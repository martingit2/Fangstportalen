import React, { useEffect, useState, useCallback } from 'react';
import {
    getMineOrdrer,
    getAktiveFangstmeldinger,
    getMineFangstmeldinger,
    getTilgjengeligeOrdrer,
    aksepterOrdre,
    deleteOrdre,
    deleteFangstmelding
} from '../services/apiService';
import styles from './DashboardPage.module.css';
import Button from '../components/ui/Button';
import { useClaims } from '../hooks/useClaims';
import type { OrdreResponseDto } from '../types/ordre';
import type { FangstmeldingResponseDto } from '../types/fangstmelding';
import GiBudModal from '../components/GiBudModal';

const SkipperDashboard: React.FC = () => {
    const [mineFangstmeldinger, setMineFangstmeldinger] = useState<FangstmeldingResponseDto[]>([]);
    const [tilgjengeligeOrdrer, setTilgjengeligeOrdrer] = useState<OrdreResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAcceptingId, setIsAcceptingId] = useState<number | null>(null);
    const [isDeletingId, setIsDeletingId] = useState<number | null>(null);

    const fetchData = useCallback(async () => {
        try {
            const [fangstmeldingerRes, ordrerRes] = await Promise.all([
                getMineFangstmeldinger(),
                getTilgjengeligeOrdrer()
            ]);
            setMineFangstmeldinger(fangstmeldingerRes.data);
            setTilgjengeligeOrdrer(ordrerRes.data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Kunne ikke laste inn data.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        setIsLoading(true);
        fetchData();
    }, [fetchData]);

    const handleAksepterOrdre = async (ordreId: number) => {
        setIsAcceptingId(ordreId);
        try {
            await aksepterOrdre(ordreId);
            await fetchData();
        } catch (err) {
            console.error(err);
            alert("Kunne ikke akseptere ordren. Den kan ha blitt tatt av en annen skipper. Siden oppdateres.");
            await fetchData();
        } finally {
            setIsAcceptingId(null);
        }
    };

    const handleDeleteFangstmelding = async (fangstmeldingId: number) => {
        if (!window.confirm("Er du sikker på at du vil trekke denne fangstmeldingen fra markedet?")) {
            return;
        }
        setIsDeletingId(fangstmeldingId);
        try {
            await deleteFangstmelding(fangstmeldingId);
            await fetchData();
        } catch (err) {
            console.error(err);
            alert("Kunne ikke slette fangstmeldingen.");
            await fetchData();
        } finally {
            setIsDeletingId(null);
        }
    };
    
    const renderMineFangstmeldinger = () => {
        if (isLoading) return <div className={styles.loading}>Laster...</div>;
        if (mineFangstmeldinger.length === 0) return <div className={styles.empty}>Du har ingen aktive fangstmeldinger.</div>;

        return (
            <div className={styles.marketplaceGrid}>
                {mineFangstmeldinger.map(melding => (
                    <div key={melding.id} className={styles.fangstmeldingCard}>
                         <div className={styles.fangstInfo}>
                            <h3>{melding.fartoyNavn} - {melding.leveringssted}</h3>
                            <p className={styles.fangstlinjer}>
                                {melding.fangstlinjer.map(l => `${l.fiskeslag} (~${l.estimertKvantum} kg) @ ${l.utropsprisPerKg} kr/kg`).join(', ')}
                            </p>
                        </div>
                        <div className={styles.cardActions}>
                             <Button variant="secondary" onClick={() => alert('Vis bud (TODO)')}>Se bud</Button>
                             <Button variant="secondary" to={`/fangstmelding/${melding.id}/rediger`}>Rediger</Button>
                             <Button
                                variant="danger"
                                onClick={() => handleDeleteFangstmelding(melding.id)}
                                disabled={isDeletingId === melding.id}
                            >
                                {isDeletingId === melding.id ? 'Sletter...' : 'Trekk tilbake'}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderTilgjengeligeOrdrer = () => {
        if (isLoading) return <div className={styles.loading}>Laster...</div>;
        if (tilgjengeligeOrdrer.length === 0) return <div className={styles.empty}>Ingen åpne ordrer i markedet.</div>;

        return (
             <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Fiskebruk</th>
                        <th>Leveringssted</th>
                        <th>Dato & Tid</th>
                        <th>Etterspørsel</th>
                        <th className={`${styles.alignRight} ${styles.actionsHeader}`}>Handlinger</th>
                    </tr>
                </thead>
                <tbody>
                    {tilgjengeligeOrdrer.map(ordre => (
                        <tr key={ordre.id}>
                            <td>{ordre.kjoperOrganisasjonNavn}</td>
                            <td>{ordre.leveringssted}</td>
                            <td>
                                {new Date(ordre.forventetLeveringsdato).toLocaleDateString('nb-NO')}
                                <br/>
                                <span className={styles.timeRange}>{ordre.forventetLeveringstidFra} - {ordre.forventetLeveringstidTil}</span>
                            </td>
                            <td>
                                {ordre.ordrelinjer.map(l => `${l.forventetKvantum} kg ${l.fiskeslag}`).join(', ')}
                            </td>
                            <td className={styles.alignRight}>
                                <div className={styles.actionsCell}>
                                    <Button
                                        onClick={() => handleAksepterOrdre(ordre.id)}
                                        disabled={isAcceptingId === ordre.id}
                                    >
                                        {isAcceptingId === ordre.id ? 'Aksepterer...' : 'Aksepter'}
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Markedsplass</h1>
                <Button to="/ny-fangstmelding">Annonser ny fangst</Button>
            </header>
            <div className={styles.marketplaceSection}>
                <h2 className={styles.marketplaceTitle}>Mine Aktive Fangstmeldinger</h2>
                <div className={styles.content}>
                    {error ? <div className={styles.error}>{error}</div> : renderMineFangstmeldinger()}
                </div>
            </div>
            <div className={styles.marketplaceSection}>
                <h2 className={styles.marketplaceTitle}>Etterspørsel i Markedet (Åpne Ordrer)</h2>
                <div className={styles.content}>
                    {error ? <div className={styles.error}>{error}</div> : renderTilgjengeligeOrdrer()}
                </div>
            </div>
        </div>
    );
};

const InnkjoperDashboard: React.FC = () => {
    const [ordrer, setOrdrer] = useState<OrdreResponseDto[]>([]);
    const [fangstmeldinger, setFangstmeldinger] = useState<FangstmeldingResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeletingId, setIsDeletingId] = useState<number | null>(null);
    const [isBudModalOpen, setIsBudModalOpen] = useState(false);
    const [selectedFangstmelding, setSelectedFangstmelding] = useState<FangstmeldingResponseDto | null>(null);

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
            console.error(err);
            setError("Kunne ikke laste inn data.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenBudModal = (fangstmelding: FangstmeldingResponseDto) => {
        setSelectedFangstmelding(fangstmelding);
        setIsBudModalOpen(true);
    };

    const handleCloseBudModal = () => {
        setSelectedFangstmelding(null);
        setIsBudModalOpen(false);
    };

    const handleBudSuccess = () => {
        alert('Budet ditt er sendt!');
        fetchData();
    };

    const handleDeleteOrdre = async (ordreId: number) => {
        if (!window.confirm("Er du sikker på at du vil slette denne ordren? Dette kan ikke angres.")) {
            return;
        }
        setIsDeletingId(ordreId);
        try {
            await deleteOrdre(ordreId);
            await fetchData();
        } catch (err) {
            console.error(err);
            alert("Kunne ikke slette ordren. Den kan ha blitt akseptert av en skipper.");
            await fetchData();
        } finally {
            setIsDeletingId(null);
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
                        <th>Status</th>
                        <th>Detaljer</th>
                        <th className={`${styles.alignRight} ${styles.actionsHeader}`}>Handlinger</th>
                    </tr>
                </thead>
                <tbody>
                    {ordrer.map((ordre) => (
                        <tr key={ordre.id}>
                            <td>#{ordre.id}</td>
                            <td>{ordre.status}</td>
                            <td>
                                {ordre.leveringssted} - {new Date(ordre.forventetLeveringsdato).toLocaleDateString('nb-NO')}
                            </td>
                            <td className={styles.alignRight}>
                                <div className={styles.actionsCell}>
                                    {ordre.status === 'AKTIV' && (
                                        <>
                                            <Button variant="secondary" to={`/ordre/${ordre.id}/rediger`}>
                                                Rediger
                                            </Button>
                                            <Button
                                                variant="danger"
                                                onClick={() => handleDeleteOrdre(ordre.id)}
                                                disabled={isDeletingId === ordre.id}
                                            >
                                                {isDeletingId === ordre.id ? 'Sletter...' : 'Slett'}
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </td>
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
                            <h3>{melding.fartoyNavn} - {melding.leveringssted}</h3>
                            <p className={styles.fangstlinjer}>
                               {melding.fangstlinjer.map(l => `${l.fiskeslag} (~${l.estimertKvantum} kg) @ ${l.utropsprisPerKg} kr/kg`).join(', ')}
                            </p>
                        </div>
                        <Button onClick={() => handleOpenBudModal(melding)}>Gi bud</Button>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Mine Ordrer</h1>
                    <Button to="/ny-ordre">Opprett Åpen Ordre</Button>
                </header>
                <div className={styles.content}>
                    {error ? <div className={styles.error}>{error}</div> : renderOrdreContent()}
                </div>
                <div className={styles.marketplaceSection}>
                    <h2 className={styles.marketplaceTitle}>Tilgjengelig i Markedet (Fangstmeldinger)</h2>
                    <div className={styles.content}>
                        {error ? <div className={styles.error}>{error}</div> : renderMarketplaceContent()}
                    </div>
                </div>
            </div>
             {selectedFangstmelding && (
                <GiBudModal
                    isOpen={isBudModalOpen}
                    onClose={handleCloseBudModal}
                    onSuccess={handleBudSuccess}
                    fangstmelding={selectedFangstmelding}
                />
            )}
        </>
    );
};

const DashboardPage: React.FC = () => {
    const { claims, isLoading } = useClaims();
    
    if (isLoading) {
        return <div>Laster brukerinformasjon...</div>;
    }

    if (!claims?.roles) {
         return <div>Ukjent rolle. Kontakt administrator.</div>;
    }
    
    const erInnkjoper = claims.roles.some(r => r.startsWith('FISKEBRUK_'));
    const erSkipper = claims.roles.some(r => r.startsWith('REDERI_'));

    if (erInnkjoper) {
        return <InnkjoperDashboard />;
    }

    if (erSkipper) {
        return <SkipperDashboard />;
    }

    return <div>Ukjent rolle. Kontakt administrator.</div>;
};

export default DashboardPage;