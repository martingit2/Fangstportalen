import React, { useEffect, useState } from 'react';
import apiClient from '../services/apiService';
import styles from './DashboardPage.module.css';
import Button from '../components/ui/Button';
import { usePermissions } from '../hooks/usePermissions';

interface Sluttseddel {
    id: number;
    landingsdato: string;
    fartoyNavn: string;
    leveringssted: string;
    fiskeslag: string;
    kvantum: number;
}

const DashboardPage: React.FC = () => {
    const [sluttsedler, setSluttsedler] = useState<Sluttseddel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { permissions, isLoading: permissionsLoading } = usePermissions();

    useEffect(() => {
        const fetchSluttsedler = async () => {
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
        };
        fetchSluttsedler();
    }, []);

    const canCreateSluttseddel = permissions.includes('create:sluttseddel');

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
                        <th>Leveringssted</th>
                        <th>Fiskeslag</th>
                        <th className={styles.alignRight}>Kvantum (kg)</th>
                    </tr>
                </thead>
                <tbody>
                    {sluttsedler.map((seddel) => (
                        <tr key={seddel.id}>
                            <td>{seddel.landingsdato}</td>
                            <td>{seddel.fartoyNavn}</td>
                            <td>{seddel.leveringssted}</td>
                            <td>{seddel.fiskeslag}</td>
                            <td className={styles.alignRight}>{seddel.kvantum.toLocaleString('nb-NO')}</td>
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
                {!permissionsLoading && canCreateSluttseddel && (
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