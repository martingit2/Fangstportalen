import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SluttseddelArkivPage.module.css';
import { getMineSluttsedler } from '../services/apiService';
import type { SluttseddelResponseDto } from '../types/sluttseddel';
import { useClaims } from '../hooks/useClaims';
import StatusBadge from '../components/ui/StatusBadge';

const formatCurrency = (value: number) => new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK' }).format(value);

const SluttseddelArkivPage: React.FC = () => {
    const [sedler, setSedler] = useState<SluttseddelResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { claims } = useClaims();
    const navigate = useNavigate();
    const erInnkoper = claims?.org_type === 'FISKEBRUK';

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getMineSluttsedler();
            setSedler(response.data);
        } catch (error) {
            console.error("Kunne ikke hente sluttsedler", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRowClick = (id: number) => {
        navigate(`/sluttseddelarkiv/${id}`);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Sluttseddelarkiv</h1>
            </header>

            <div className={styles.content}>
                {isLoading ? <p className={styles.empty}>Laster sluttsedler...</p> : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Seddelnummer</th>
                                <th>Status</th>
                                <th>Landingsdato</th>
                                <th>{erInnkoper ? 'Selger' : 'Kjøper'}</th>
                                <th className={styles.alignRight}>Totalverdi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sedler.length === 0 ? (
                                <tr><td colSpan={5} className={styles.empty}>Ingen sluttsedler funnet.</td></tr>
                            ) : sedler.map(seddel => (
                                <tr key={seddel.id} className={styles.hovedRad} onClick={() => handleRowClick(seddel.id)}>
                                    <td>{seddel.seddelnummer}</td>
                                    <td><StatusBadge status={seddel.status} /></td>
                                    <td>{new Date(seddel.landingsdato).toLocaleDateString('nb-NO')}</td>
                                    <td>{erInnkoper ? seddel.selgerNavn : seddel.kjoperNavn}</td>
                                    <td className={styles.alignRight}>{formatCurrency(seddel.totalVerdi)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default SluttseddelArkivPage;