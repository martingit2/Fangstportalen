import React, { useEffect, useState, useCallback } from 'react';
import apiClient from '../services/apiService';
import styles from './DashboardPage.module.css';
import Button from '../components/ui/Button';

import StatusBadge from '../components/ui/StatusBadge';
import { isAxiosError } from 'axios';
import { useRoles } from '../hooks/usePermissions';

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

const DashboardPage: React.FC = () => {
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
            if (isAxiosError(err)) {
                setError('Kunne ikke hente sluttsedler. Prøv igjen senere.');
            }
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
            console.error('Failed to sign sluttseddel', err);
            alert('En feil oppstod under signering.');
        } finally {
            setSigningId(null);
        }
    };

    const isSkipper = roles.includes('rederi-skipper');

    const renderContent = () => {
        if (isLoading) {
            return <div className={styles.loading}>Laster dine sluttsedler...</div>;
        }
        if (error) {
            return <div className={styles.error}>{error}</div>;
        }
        if (sluttsedler.length === 0) {
            return <div className={styles.empty}>Du har ingen registrerte sluttsedler.</div>;
        }
        return (
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Dato</th>
                        <th>Fartøy</th>
                        <th>Status</th>
                        <th className={styles.alignRight}>Kvantum (kg)</th>
                        <th>Handlinger</th>
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
                                    <Button
                                        variant="secondary"
                                        onClick={() => handleSign(seddel.id)}
                                        disabled={signingId === seddel.id}
                                    >
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
                    <Button to="/dashboard/ny-sluttseddel">
                        Registrer ny sluttseddel
                    </Button>
                )}
            </header>
            <div className={styles.content}>
                {renderContent()}
            </div>
        </div>
    );
};

export default DashboardPage;