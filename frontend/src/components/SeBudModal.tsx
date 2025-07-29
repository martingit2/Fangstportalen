import React, { useState, useEffect, useCallback } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import styles from './SeBudModal.module.css';
import { getBudOversiktForFangstmelding, aksepterBud } from '../services/apiService';
import type { BudOversiktResponseDto, BudResponseDto, KontaktinformasjonDto } from '../types/bud';
import { FaUser, FaPhone } from 'react-icons/fa';

interface SeBudModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    fangstmeldingId: number | null;
}

const formatCurrency = (value: number) => new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK', minimumFractionDigits: 2 }).format(value);
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('nb-NO', { year: 'numeric', month: 'long', day: 'numeric' });
const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return "Akkurat nå";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `For ${diffInMinutes} min siden`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `For ${diffInHours} t siden`;
    return date.toLocaleDateString('nb-NO', { day: '2-digit', month: 'short', year: 'numeric' });
};

const KontaktDetaljer: React.FC<{ kontakt: KontaktinformasjonDto }> = ({ kontakt }) => (
    <>
        <span className={styles.koperNavn}>{kontakt.organisasjonNavn}</span>
        <div className={styles.kontaktInfo}>
            <FaUser />
            <span>{kontakt.kontaktpersonNavn} {kontakt.kontaktpersonTittel && `(${kontakt.kontaktpersonTittel})`}</span>
        </div>
        {kontakt.kontaktpersonTelefon && (
            <div className={styles.kontaktInfo}>
                <FaPhone />
                <span>{kontakt.kontaktpersonTelefon}</span>
            </div>
        )}
    </>
);

const SeBudModal: React.FC<SeBudModalProps> = ({ isOpen, onClose, onSuccess, fangstmeldingId }) => {
    const [oversikt, setOversikt] = useState<BudOversiktResponseDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAcceptingId, setIsAcceptingId] = useState<number | null>(null);

    const fetchData = useCallback(async () => {
        if (!isOpen || !fangstmeldingId) return;
        setIsLoading(true);
        setError(null);
        try {
            const response = await getBudOversiktForFangstmelding(fangstmeldingId);
            setOversikt(response.data);
        } catch (error) {
            console.error("Kunne ikke hente budoversikt", error);
            setError("En feil oppstod under henting av bud. Prøv å lukk og åpne vinduet på nytt.");
        } finally {
            setIsLoading(false);
        }
    }, [isOpen, fangstmeldingId]);

    useEffect(() => {
        fetchData();
        if (!isOpen) {
            setOversikt(null);
            setIsLoading(true);
            setError(null);
            setIsAcceptingId(null);
        }
    }, [isOpen, fetchData]);

    const handleAksepterBud = async (budId: number) => {
        if (!window.confirm("Er du sikker på at du vil akseptere dette budet? Dette vil opprette en bindende ordre og avvise alle andre bud.")) return;
        setIsAcceptingId(budId);
        setError(null);
        try {
            await aksepterBud(budId);
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Kunne ikke akseptere bud", error);
            setError("Det skjedde en feil under aksept av budet. Det kan hende budet allerede er trukket eller fangsten solgt.");
        } finally {
            setIsAcceptingId(null);
        }
    };
    
    const renderContent = () => {
        if (isLoading) return <p>Laster bud og detaljer...</p>;
        if (!oversikt) return <p>Kunne ikke laste detaljer for fangstmeldingen.</p>;
        
        return (
            <div className={styles.modalContent}>
                <div className={styles.oversiktHeader}>
                    <div className={styles.oversiktGrid}>
                        <div className={styles.infoBlock}><h4>Fartøy</h4><p>{oversikt.fartoyNavn}</p></div>
                        <div className={styles.infoBlock}><h4>Leveringssted</h4><p>{oversikt.leveringssted}</p></div>
                        <div className={styles.infoBlock}><h4>Tilgjengelig fra</h4><p>{formatDate(oversikt.tilgjengeligFraDato)}</p></div>
                    </div>
                </div>
                {oversikt.bud.length === 0 ? <p>Ingen bud er mottatt ennå.</p> : (
                    <div className={styles.budListe}>
                        {oversikt.bud.map((b: BudResponseDto) => (
                            <div key={b.id} className={styles.budKort}>
                                <div className={styles.budInfo}>
                                    <div className={styles.budHeader}>
                                        <KontaktDetaljer kontakt={b.budgiverKontakt} />
                                        <span className={styles.totalVerdi}>Totalverdi: <strong>{formatCurrency(b.totalVerdi)}</strong></span>
                                    </div>
                                    <ul className={styles.linjeListe}>
                                        {b.budLinjer.map(linje => (
                                            <li key={linje.id}><span>{linje.fiskeslag}</span><strong>{formatCurrency(linje.budPrisPerKg)}/kg</strong></li>
                                        ))}
                                    </ul>
                                </div>
                                <div className={styles.handlinger}>
                                    <Button onClick={() => handleAksepterBud(b.id)} disabled={isAcceptingId !== null}>
                                        {isAcceptingId === b.id ? 'Aksepterer...' : 'Aksepter bud'}
                                    </Button>
                                    <span className={styles.tidspunkt}>{formatRelativeTime(b.opprettetTidspunkt)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Innkomne bud for fangstmelding #${fangstmeldingId}`}>
            {error && <p style={{ color: '#b91c1c', background: '#fee2e2', padding: '0.75rem', borderRadius: '4px' }}>{error}</p>}
            {renderContent()}
        </Modal>
    );
};

export default SeBudModal;