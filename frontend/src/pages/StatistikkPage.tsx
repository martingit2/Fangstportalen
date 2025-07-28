import React, { useState, useEffect } from 'react';
import { getStatistikkOversikt } from '../services/apiService';
import type { StatistikkResponseDto } from '../types/statistikk';
import styles from './StatistikkPage.module.css';
import StatCard from '../components/ui/StatCard';
import StatTable from '../components/ui/StatTable';

const formatCurrency = (value: number) => new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
const formatNumber = (value: number) => new Intl.NumberFormat('nb-NO').format(value);

const StatistikkPage: React.FC = () => {
    const [stats, setStats] = useState<StatistikkResponseDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getStatistikkOversikt();
                setStats(response.data);
            } catch (err) {
                setError('Kunne ikke laste statistikkdata.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) return <div className={styles.loading}>Laster statistikk...</div>;
    if (error) return <div className={styles.error}>{error}</div>;
    if (!stats || stats.antallHandler === 0) {
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>Statistikk</h1>
                <div className={styles.emptyState}>
                    <p>Ingen fullførte handler funnet.</p>
                    <p>Statistikk vil vises her så snart du har fullført din første handel.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Oversikt</h1>
            <p className={styles.subtitle}>Nøkkeltall fra alle dine fullførte handler.</p>

            <div className={styles.kortContainer}>
                <StatCard title="Total Verdi" value={formatCurrency(stats.totalVerdi)} />
                <StatCard title="Totalt Kvantum" value={`${formatNumber(stats.totaltKvantum)} kg`} />
                <StatCard title="Antall Handler" value={String(stats.antallHandler)} />
            </div>

            <div className={styles.gridContainer}>
                <StatTable
                    title="Verdi per fiskeslag"
                    data={stats.verdiPerFiskeslag}
                    valueFormatter={formatCurrency}
                />
                <StatTable
                    title="Kvantum per fiskeslag"
                    data={stats.kvantumPerFiskeslag}
                    valueFormatter={formatNumber}
                    unit="kg"
                />
            </div>
        </div>
    );
};

export default StatistikkPage;