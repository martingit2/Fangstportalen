import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSluttseddelById, bekreftSluttseddel, avvisSluttseddel } from '../services/apiService';
import type { SluttseddelResponseDto } from '../types/sluttseddel';
import { useClaims } from '../hooks/useClaims';
import styles from './SluttseddelDetaljerPage.module.css';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import toast from 'react-hot-toast';
import AvvisSluttseddelModal from '../components/AvvisSluttseddelModal';

const formatCurrency = (value: number) => new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK' }).format(value);
const formatNumber = (value: number) => new Intl.NumberFormat('nb-NO').format(value);
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('nb-NO', { year: 'numeric', month: 'long', day: 'numeric' });

const SluttseddelDetaljerPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { claims } = useClaims();
    const [seddel, setSeddel] = useState<SluttseddelResponseDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const seddelId = Number(id);

    const fetchData = useCallback(async () => {
        if (isNaN(seddelId)) {
            navigate('/sluttseddelarkiv');
            return;
        }
        setIsLoading(true);
        try {
            const { data } = await getSluttseddelById(seddelId);
            setSeddel(data);
        } catch (error) {
            toast.error("Kunne ikke hente sluttseddel.");
            navigate('/sluttseddelarkiv');
        } finally {
            setIsLoading(false);
        }
    }, [seddelId, navigate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleBekreft = async () => {
        setIsActionLoading(true);
        try {
            await bekreftSluttseddel(seddelId);
            toast.success("Sluttseddel ble godkjent.");
            fetchData();
        } catch (error) {
            toast.error("En feil oppstod under godkjenning.");
        } finally {
            setIsActionLoading(false);
        }
    };
    
    const handleAvvis = async (data: { begrunnelse: string }) => {
        setIsActionLoading(true);
        try {
            await avvisSluttseddel(seddelId, data);
            toast.success("Sluttseddel ble avvist.");
            fetchData();
            setIsModalOpen(false);
        } catch(error) {
            toast.error("En feil oppstod under avvisning.");
        } finally {
            setIsActionLoading(false);
        }
    };

    if (isLoading || !seddel) {
        return <div>Laster sluttseddel...</div>;
    }

    const erInnkoper = claims?.org_type === 'FISKEBRUK';
    const kanHandtere = erInnkoper && seddel.status === 'SIGNERT_AV_FISKER';

    return (
        <>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Sluttseddel #{seddel.seddelnummer}</h1>
                        <p className={styles.subtitle}>Ordre #{seddel.ordreId} | Landet {formatDate(seddel.landingsdato)}</p>
                    </div>
                    <StatusBadge status={seddel.status} />
                </header>

                <div className={styles.content}>
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Parter</h2>
                        <div className={styles.grid}>
                            <div className={styles.infoBlock}><h4>Selger</h4><p>{seddel.selgerNavn}</p></div>
                            <div className={styles.infoBlock}><h4>Kjøper</h4><p>{seddel.kjoperNavn}</p></div>
                            <div className={styles.infoBlock}><h4>Fartøy</h4><p>{seddel.fartoyNavn}</p></div>
                            <div className={styles.infoBlock}><h4>Leveringssted</h4><p>{seddel.leveringssted}</p></div>
                        </div>
                    </section>
                    
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Fangstdetaljer</h2>
                        <table className={styles.linjeTabell}>
                             <thead>
                                <tr>
                                    <th>Fiskeslag</th>
                                    <th className={styles.alignRight}>Kvantum</th>
                                    <th className={styles.alignRight}>Pris per kg</th>
                                    <th className={styles.alignRight}>Totalverdi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {seddel.linjer.map(linje => (
                                    <tr key={linje.id}>
                                        <td>{linje.fiskeslag}</td>
                                        <td className={styles.alignRight}>{formatNumber(linje.faktiskKvantum)} kg</td>
                                        <td className={styles.alignRight}>{formatCurrency(linje.avtaltPrisPerKg)}</td>
                                        <td className={styles.alignRight}>{formatCurrency(linje.totalVerdi)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={3}>Total Sum</td>
                                    <td className={styles.alignRight}>{formatCurrency(seddel.totalVerdi)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </section>

                    {seddel.status === 'AVVIST' && seddel.avvisningsbegrunnelse && (
                        <section className={`${styles.section} ${styles.avvistSection}`}>
                            <h2 className={styles.sectionTitle}>Begrunnelse for avvisning</h2>
                            <p>{seddel.avvisningsbegrunnelse}</p>
                        </section>
                    )}
                </div>
                
                {kanHandtere && (
                    <footer className={styles.footer}>
                        <Button variant="danger" onClick={() => setIsModalOpen(true)} disabled={isActionLoading}>Avvis</Button>
                        <Button onClick={handleBekreft} disabled={isActionLoading}>
                            {isActionLoading ? 'Godkjenner...' : 'Godkjenn Sluttseddel'}
                        </Button>
                    </footer>
                )}
            </div>
            <AvvisSluttseddelModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAvvis}
                isSubmitting={isActionLoading}
            />
        </>
    );
};

export default SluttseddelDetaljerPage;