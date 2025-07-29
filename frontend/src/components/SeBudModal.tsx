import React, { useState, useEffect, useCallback } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import styles from './SeBudModal.module.css';
import { getBudForFangstmelding, aksepterBud } from '../services/apiService';
import type { BudResponseDto } from '../types/bud';

interface SeBudModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    fangstmeldingId: number | null;
}

const formatCurrency = (value: number) => new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK' }).format(value);

const SeBudModal: React.FC<SeBudModalProps> = ({ isOpen, onClose, onSuccess, fangstmeldingId }) => {
    const [bud, setBud] = useState<BudResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAcceptingId, setIsAcceptingId] = useState<number | null>(null);

    const fetchData = useCallback(async () => {
        if (!isOpen || !fangstmeldingId) return;

        setIsLoading(true);
        setError(null);
        try {
            const response = await getBudForFangstmelding(fangstmeldingId);
            setBud(response.data);
        } catch (error) {
            console.error("Kunne ikke hente bud", error);
            setError("En feil oppstod under henting av bud. Prøv å lukk og åpne vinduet på nytt.");
        } finally {
            setIsLoading(false);
        }
    }, [isOpen, fangstmeldingId]);

    useEffect(() => {
        fetchData();

        if (!isOpen) {
            setBud([]);
            setIsLoading(true);
            setError(null);
            setIsAcceptingId(null);
        }
    }, [isOpen, fetchData]);

    const handleAksepterBud = async (budId: number) => {
        if (!window.confirm("Er du sikker på at du vil akseptere dette budet? Dette vil opprette en bindende ordre og avvise alle andre bud.")) {
            return;
        }
        setIsAcceptingId(budId);
        setError(null);
        try {
            await aksepterBud(budId);
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Kunne ikke akseptere bud", error);
            setError("Det skjedde en feil under aksept av budet. Det kan hende ordren allerede er tatt. Prøv igjen.");
        } finally {
            setIsAcceptingId(null);
        }
    };
    
    const renderContent = () => {
        if (isLoading) {
            return <p>Laster bud...</p>;
        }
        if (bud.length === 0) {
            return <p>Ingen bud er mottatt på denne fangstmeldingen ennå.</p>;
        }
        return (
            <div className={styles.budListe}>
                {bud.map(b => (
                    <div key={b.id} className={styles.budKort}>
                        <div className={styles.budInfo}>
                            <span className={styles.koperNavn}>{b.kjoperOrganisasjonNavn}</span>
                            <ul className={styles.linjeListe}>
                                {b.budLinjer.map(linje => (
                                    <li key={linje.id}>
                                        {linje.fiskeslag}: <strong>{formatCurrency(linje.budPrisPerKg)}</strong>/kg
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Button
                            onClick={() => handleAksepterBud(b.id)}
                            disabled={isAcceptingId !== null}
                        >
                            {isAcceptingId === b.id ? 'Aksepterer...' : 'Aksepter bud'}
                        </Button>
                    </div>
                ))}
            </div>
        );
    }
    
    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={`Innkomne bud for fangstmelding #${fangstmeldingId}`}
        >
            {error && <p style={{ color: '#b91c1c', background: '#fee2e2', padding: '0.75rem', borderRadius: '4px' }}>{error}</p>}
            {renderContent()}
        </Modal>
    );
};

export default SeBudModal;