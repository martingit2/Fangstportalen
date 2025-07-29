import React, { useState, useEffect, useCallback } from 'react';
import styles from './SluttseddelArkivPage.module.css';
import { getMineSluttsedler, bekreftSluttseddel } from '../services/apiService';
import type { SluttseddelResponseDto } from '../types/sluttseddel';
import Button from '../components/ui/Button';
import { useClaims } from '../hooks/useClaims';
import StatusBadge from '../components/ui/StatusBadge';
import SluttseddelDetaljer from '../components/SluttseddelDetaljer';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const formatCurrency = (value: number) => new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK' }).format(value);

const SluttseddelRad: React.FC<{ seddel: SluttseddelResponseDto; onBekreft: (id: number) => void; isConfirmingId: number | null }> = ({ seddel, onBekreft, isConfirmingId }) => {
    const [erApen, setErApen] = useState(false);
    const { claims } = useClaims();
    const erInnkoper = claims?.roles.some(r => r.startsWith('FISKEBRUK_'));

    return (
        <>
            <tr className={styles.hovedRad} onClick={() => setErApen(!erApen)}>
                <td>{seddel.seddelnummer}</td>
                <td><StatusBadge status={seddel.status} /></td>
                <td>{new Date(seddel.landingsdato).toLocaleDateString('nb-NO')}</td>
                <td>{erInnkoper ? seddel.selgerNavn : seddel.kjoperNavn}</td>
                <td className={styles.alignRight}>{formatCurrency(seddel.totalVerdi)}</td>
                <td className={styles.handlingsCelle}>
                    {erInnkoper && seddel.status === 'SIGNERT_AV_FISKER' ? (
                        <Button
                            onClick={(e) => { e.stopPropagation(); onBekreft(seddel.id); }}
                            disabled={isConfirmingId === seddel.id}
                        >
                            {isConfirmingId === seddel.id ? 'Godkjenner...' : 'Godkjenn'}
                        </Button>
                    ) : (
                        <span className={styles.chevron}>
                            {erApen ? <FaChevronUp /> : <FaChevronDown />}
                        </span>
                    )}
                </td>
            </tr>
            {erApen && (
                <tr>
                    <td colSpan={6}>
                        <SluttseddelDetaljer seddel={seddel} />
                    </td>
                </tr>
            )}
        </>
    );
};


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
                                <th>Seddelnummer</th>
                                <th>Status</th>
                                <th>Landingsdato</th>
                                <th>{erInnkoper ? 'Selger' : 'Kjøper'}</th>
                                <th className={styles.alignRight}>Totalverdi</th>
                                <th>Handling</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sedler.length === 0 ? (
                                <tr><td colSpan={6} className={styles.empty}>Ingen sluttsedler funnet.</td></tr>
                            ) : sedler.map(seddel => (
                                <SluttseddelRad 
                                    key={seddel.id} 
                                    seddel={seddel} 
                                    onBekreft={handleBekreft} 
                                    isConfirmingId={isConfirmingId}
                                />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default SluttseddelArkivPage;