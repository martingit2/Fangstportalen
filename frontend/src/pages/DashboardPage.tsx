import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    getMineOrdrer,
    getAktiveFangstmeldinger,
    getMineFangstmeldinger,
    getTilgjengeligeOrdrer,
    aksepterOrdre,
    deleteOrdre,
    deleteFangstmelding,
    type PagedResult
} from '../services/apiService';
import styles from './DashboardPage.module.css';
import Button from '../components/ui/Button';
import { useClaims } from '../hooks/useClaims';
import type { OrdreResponseDto } from '../types/ordre';
import type { FangstmeldingResponseDto } from '../types/fangstmelding';
import GiBudModal from '../components/GiBudModal';
import SeBudModal from '../components/SeBudModal';
import { useDebounce } from '../hooks/useDebounce';
import { FaMapMarkerAlt, FaFish } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Pagination from '../components/ui/Pagination';

const SkipperDashboard: React.FC = () => {
    const [mineFangstmeldinger, setMineFangstmeldinger] = useState<PagedResult<FangstmeldingResponseDto> | null>(null);
    const [tilgjengeligeOrdrer, setTilgjengeligeOrdrer] = useState<PagedResult<OrdreResponseDto> | null>(null);
    const [fangstmeldingerPage, setFangstmeldingerPage] = useState(0);
    const [ordrerPage, setOrdrerPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAcceptingId, setIsAcceptingId] = useState<number | null>(null);
    const [isDeletingId, setIsDeletingId] = useState<number | null>(null);
    const [isSeBudModalOpen, setIsSeBudModalOpen] = useState(false);
    const [selectedFangstmeldingId, setSelectedFangstmeldingId] = useState<number | null>(null);
    const [filters, setFilters] = useState({ leveringssted: '', fiskeslag: '' });
    const debouncedFilters = useDebounce(filters, 500);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [fangstmeldingerRes, ordrerRes] = await Promise.all([
                getMineFangstmeldinger(fangstmeldingerPage, 5),
                getTilgjengeligeOrdrer(debouncedFilters, ordrerPage, 15)
            ]);
            setMineFangstmeldinger(fangstmeldingerRes.data);
            setTilgjengeligeOrdrer(ordrerRes.data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Kunne ikke laste inn data.");
            toast.error("Kunne ikke laste inn data.");
        } finally {
            setIsLoading(false);
        }
    }, [debouncedFilters, fangstmeldingerPage, ordrerPage]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setOrdrerPage(0);
    };

    const resetFilters = () => {
        setFilters({ leveringssted: '', fiskeslag: '' });
        setOrdrerPage(0);
    };

    const handleOpenSeBudModal = (fangstmeldingId: number) => {
        setSelectedFangstmeldingId(fangstmeldingId);
        setIsSeBudModalOpen(true);
    };

    const handleCloseSeBudModal = () => {
        setSelectedFangstmeldingId(null);
        setIsSeBudModalOpen(false);
    };
    
    const handleBudAkseptert = () => {
        toast.success("Bud akseptert! En bindende ordre er opprettet.");
        fetchData();
    };

    const handleAksepterOrdre = async (ordreId: number) => {
        setIsAcceptingId(ordreId);
        try {
            await aksepterOrdre(ordreId);
            toast.success(`Ordre #${ordreId} er akseptert!`);
            await fetchData();
        } catch (err) {
            console.error(err);
            toast.error("Kunne ikke akseptere ordren. Den kan ha blitt tatt av en annen skipper.");
            await fetchData();
        } finally {
            setIsAcceptingId(null);
        }
    };

    const handleDeleteFangstmelding = async (fangstmeldingId: number) => {
        if (!window.confirm("Er du sikker på at du vil trekke denne fangstmeldingen fra markedet?")) return;
        setIsDeletingId(fangstmeldingId);
        try {
            await deleteFangstmelding(fangstmeldingId);
            toast.success("Fangstmeldingen ble trukket tilbake.");
            await fetchData();
        } catch (err) {
            console.error(err);
            toast.error("Kunne ikke slette fangstmeldingen.");
            await fetchData();
        } finally {
            setIsDeletingId(null);
        }
    };
    
    const renderMineFangstmeldinger = () => {
        if (isLoading) return <div className={styles.loading}>Laster...</div>;
        if (!mineFangstmeldinger || mineFangstmeldinger.content.length === 0) return <div className={styles.empty}>Du har ingen aktive fangstmeldinger.</div>;

        return (
            <div className={styles.marketplaceGrid}>
                {mineFangstmeldinger.content.map(melding => (
                    <div key={melding.id} className={styles.fangstmeldingCard}>
                         <div className={styles.fangstInfo}>
                            <h3>{melding.fartoyNavn} - {melding.leveringssted}</h3>
                            <p className={styles.fangstlinjer}>
                                {melding.fangstlinjer.map(l => `${l.fiskeslag} (~${l.estimertKvantum} kg) @ ${l.utropsprisPerKg} kr/kg`).join(', ')}
                            </p>
                        </div>
                        <div className={styles.cardActions}>
                             <Button variant="secondary" onClick={() => handleOpenSeBudModal(melding.id)}>Se bud</Button>
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
        if (!tilgjengeligeOrdrer || tilgjengeligeOrdrer.content.length === 0) return <div className={styles.empty}>Ingen åpne ordrer i markedet som matcher filtrene.</div>;

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
                    {tilgjengeligeOrdrer.content.map(ordre => (
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
        <>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Markedsplass</h1>
                    <Button to="/ny-fangstmelding">Annonser ny fangst</Button>
                </header>
                <div className={styles.marketplaceSection}>
                    <h2 className={styles.marketplaceTitle}>Mine Aktive Fangstmeldinger</h2>
                    <div className={styles.content}>
                        {error ? <div className={styles.error}>{error}</div> : renderMineFangstmeldinger()}
                        {mineFangstmeldinger && (
                            <Pagination
                                currentPage={mineFangstmeldinger.pageNumber}
                                totalPages={mineFangstmeldinger.totalPages}
                                onPageChange={setFangstmeldingerPage}
                            />
                        )}
                    </div>
                </div>
                <div className={styles.marketplaceSection}>
                    <h2 className={styles.marketplaceTitle}>Etterspørsel i Markedet (Åpne Ordrer)</h2>
                    <div className={styles.content}>
                        <div className={styles.filterBar}>
                            <div className={styles.filterInputWrapper}>
                                <FaMapMarkerAlt className={styles.filterIcon} />
                                <input
                                    type="text"
                                    name="leveringssted"
                                    placeholder="Filtrer på sted..."
                                    className={styles.filterInput}
                                    value={filters.leveringssted}
                                    onChange={handleFilterChange}
                                />
                            </div>
                            <div className={styles.filterInputWrapper}>
                                <FaFish className={styles.filterIcon} />
                                <input
                                    type="text"
                                    name="fiskeslag"
                                    placeholder="Filtrer på fiskeslag..."
                                    className={styles.filterInput}
                                    value={filters.fiskeslag}
                                    onChange={handleFilterChange}
                                />
                            </div>
                            <Button variant="secondary" onClick={resetFilters}>Nullstill</Button>
                        </div>
                        {error ? <div className={styles.error}>{error}</div> : renderTilgjengeligeOrdrer()}
                        {tilgjengeligeOrdrer && (
                            <Pagination
                                currentPage={tilgjengeligeOrdrer.pageNumber}
                                totalPages={tilgjengeligeOrdrer.totalPages}
                                onPageChange={setOrdrerPage}
                            />
                        )}
                    </div>
                </div>
            </div>
            {selectedFangstmeldingId && (
                <SeBudModal
                    isOpen={isSeBudModalOpen}
                    onClose={handleCloseSeBudModal}
                    onSuccess={handleBudAkseptert}
                    fangstmeldingId={selectedFangstmeldingId}
                />
            )}
        </>
    );
};

const InnkjoperDashboard: React.FC = () => {
    const { claims } = useClaims();
    const erAdmin = claims?.roles.some(r => r.endsWith('_ADMIN'));

    const [ordrer, setOrdrer] = useState<PagedResult<OrdreResponseDto> | null>(null);
    const [fangstmeldinger, setFangstmeldinger] = useState<PagedResult<FangstmeldingResponseDto> | null>(null);
    const [ordrerPage, setOrdrerPage] = useState(0);
    const [fangstmeldingerPage, setFangstmeldingerPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeletingId, setIsDeletingId] = useState<number | null>(null);
    const [isBudModalOpen, setIsBudModalOpen] = useState(false);
    const [selectedFangstmelding, setSelectedFangstmelding] = useState<FangstmeldingResponseDto | null>(null);
    const [filters, setFilters] = useState({ leveringssted: '', fiskeslag: '' });
    const debouncedFilters = useDebounce(filters, 500);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [ordrerResponse, fangstmeldingerResponse] = await Promise.all([
                getMineOrdrer(ordrerPage, 5),
                getAktiveFangstmeldinger(debouncedFilters, fangstmeldingerPage, 15)
            ]);
            setOrdrer(ordrerResponse.data);
            setFangstmeldinger(fangstmeldingerResponse.data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Kunne ikke laste inn data.");
            toast.error("Kunne ikke laste inn data.");
        } finally {
            setIsLoading(false);
        }
    }, [debouncedFilters, ordrerPage, fangstmeldingerPage]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setFangstmeldingerPage(0);
    };

    const resetFilters = () => {
        setFilters({ leveringssted: '', fiskeslag: '' });
        setFangstmeldingerPage(0);
    };

    const handleOpenBudModal = (fangstmelding: FangstmeldingResponseDto) => {
        setSelectedFangstmelding(fangstmelding);
        setIsBudModalOpen(true);
    };

    const handleCloseBudModal = () => {
        setSelectedFangstmelding(null);
        setIsBudModalOpen(false);
    };

    const handleBudSuccess = () => {
        toast.success('Budet ditt er sendt!');
        fetchData();
    };

    const handleDeleteOrdre = async (ordreId: number) => {
        if (!window.confirm("Er du sikker på at du vil slette denne ordren? Dette kan ikke angres.")) {
            return;
        }
        setIsDeletingId(ordreId);
        try {
            await deleteOrdre(ordreId);
            toast.success("Ordren ble slettet.");
            await fetchData();
        } catch (err) {
            console.error(err);
            toast.error("Kunne ikke slette ordren. Den kan ha blitt akseptert av en skipper.");
            await fetchData();
        } finally {
            setIsDeletingId(null);
        }
    };

    const renderOrdreContent = () => {
        if (isLoading) return <div className={styles.loading}>Laster dine ordrer...</div>;
        if (!ordrer || ordrer.content.length === 0) return <div className={styles.empty}>Du har ingen aktive ordrer.</div>;

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
                    {ordrer.content.map((ordre) => (
                        <tr key={ordre.id}>
                            <td>#{ordre.id}</td>
                            <td>{ordre.status}</td>
                            <td>
                                {ordre.leveringssted} - {new Date(ordre.forventetLeveringsdato).toLocaleDateString('nb-NO')}
                            </td>
                            <td className={styles.alignRight}>
                                <div className={styles.actionsCell}>
                                    {ordre.status === 'AKTIV' && erAdmin && (
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
        if (!fangstmeldinger || fangstmeldinger.content.length === 0) return <div className={styles.empty}>Ingen fangster er tilgjengelig i markedet som matcher filtrene.</div>;

        return (
            <div className={styles.marketplaceGrid}>
                {fangstmeldinger.content.map(melding => (
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
                    {ordrer && (
                         <Pagination
                            currentPage={ordrer.pageNumber}
                            totalPages={ordrer.totalPages}
                            onPageChange={setOrdrerPage}
                        />
                    )}
                </div>
                <div className={styles.marketplaceSection}>
                    <h2 className={styles.marketplaceTitle}>Tilgjengelig i Markedet (Fangstmeldinger)</h2>
                    <div className={styles.content}>
                        <div className={styles.filterBar}>
                            <div className={styles.filterInputWrapper}>
                                <FaMapMarkerAlt className={styles.filterIcon} />
                                <input
                                    type="text"
                                    name="leveringssted"
                                    placeholder="Filtrer på sted..."
                                    className={styles.filterInput}
                                    value={filters.leveringssted}
                                    onChange={handleFilterChange}
                                />
                            </div>
                            <div className={styles.filterInputWrapper}>
                                <FaFish className={styles.filterIcon} />
                                <input
                                    type="text"
                                    name="fiskeslag"
                                    placeholder="Filtrer på fiskeslag..."
                                    className={styles.filterInput}
                                    value={filters.fiskeslag}
                                    onChange={handleFilterChange}
                                />
                            </div>
                            <Button variant="secondary" onClick={resetFilters}>Nullstill</Button>
                        </div>
                        {error ? <div className={styles.error}>{error}</div> : renderMarketplaceContent()}
                        {fangstmeldinger && (
                             <Pagination
                                currentPage={fangstmeldinger.pageNumber}
                                totalPages={fangstmeldinger.totalPages}
                                onPageChange={setFangstmeldingerPage}
                            />
                        )}
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
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.message) {
            toast.success(location.state.message);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);
    
    if (isLoading) {
        return <div>Laster brukerinformasjon...</div>;
    }

    if (!claims?.roles) {
         return <div>Ukjent rolle. Kontakt administrator.</div>;
    }
    
    const erInnkjoper = claims.org_type === 'FISKEBRUK';
    const erSkipper = claims.org_type === 'REDERI';

    if (erInnkjoper) {
        return <InnkjoperDashboard />;
    }

    if (erSkipper) {
        return <SkipperDashboard />;
    }

    return <div>Ukjent rolle. Kontakt administrator.</div>;
};

export default DashboardPage;