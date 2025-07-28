import React, { useState, useEffect, useCallback } from 'react';
import styles from './OrdrerPage.module.css'; 
import { getMineSluttsedler, bekreftSluttseddel } from '../services/apiService';
import type { SluttseddelResponseDto } from '../types/sluttseddel';
import Button from '../components/ui/Button';
import { useClaims } from '../hooks/useClaims';
import StatusBadge from '../components/ui/StatusBadge';

const formatCurrency = (value: number) => new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK' }).format(value);

const SluttseddelArkivPage: React.FC = () => {
    const [sedler, setSedler] = useState<SluttseddelResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isConfirmingId, setIsConfirmingId] = useState<number | null>(null);
    const { claims } = useClaims();
    const erInnkoper = claims?.roles.some(r => r.startsWith('FISKEBRUK_'));

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
    
    const handleBekreft = async (id: number) => {
        setIsConfirmingId(id);
        try {
            await bekreftSluttseddel(id);
            fetchData();
        } catch (error) {
            alert("En feil oppstod under bekreftelse.");
        } finally {
            setIsConfirmingId(null);
        }
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
                                <th>Seddel ID</th>
                                <th>Status</th>
                                <th>Landingsdato</th>
                                <th>Leveringssted</th>
                                <th>Totalverdi</th>
                                <th>Handling</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sedler.length === 0 ? (
                                <tr><td colSpan={6} className={styles.empty}>Ingen sluttsedler funnet.</td></tr>
                            ) : sedler.map(seddel => (
                                <tr key={seddel.id}>
                                    <td>#{seddel.id}</td>
                                    <td><StatusBadge status={seddel.status} /></td>
                                    <td>{new Date(seddel.landingsdato).toLocaleDateString('nb-NO')}</td>
                                    <td>{seddel.leveringssted}</td>
                                    <td>{formatCurrency(seddel.totalVerdi)}</td>
                                    <td>
                                        {erInnkoper && seddel.status === 'SIGNERT_AV_FISKER' && (
                                            <Button 
                                                onClick={() => handleBekreft(seddel.id)}
                                                disabled={isConfirmingId === seddel.id}
                                            >
                                                {isConfirmingId === seddel.id ? 'Godkjenner...' : 'Godkjenn'}
                                            </Button>
                                        )}
                                    </td>
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