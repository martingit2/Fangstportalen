import React, { useState, useEffect } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import inputStyles from './ui/Input.module.css';
import { getMineFartoy, tildelFartoy, fjernFartoy } from '../services/apiService';
import type { FartoyResponseDto } from '../types/fartoy';
import type { TeamMedlemResponseDto } from '../types/team';
import toast from 'react-hot-toast';

interface TildelFartoyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    medlem: TeamMedlemResponseDto;
}

const TildelFartoyModal: React.FC<TildelFartoyModalProps> = ({ isOpen, onClose, onSuccess, medlem }) => {
    const [fartoyList, setFartoyList] = useState<FartoyResponseDto[]>([]);
    const [selectedFartoy, setSelectedFartoy] = useState<string>(medlem.tildeltFartoyId?.toString() || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            getMineFartoy()
                .then(res => setFartoyList(res.data))
                .catch(() => toast.error("Kunne ikke hente fartøyliste."));
        }
    }, [isOpen]);

    const handleSave = async () => {
        if (!selectedFartoy) {
            toast.error("Vennligst velg et fartøy.");
            return;
        }
        setIsSubmitting(true);
        try {
            await tildelFartoy(medlem.brukerId, parseInt(selectedFartoy));
            onSuccess();
        } catch (error) {
            toast.error("En feil oppstod under tildeling.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemove = async () => {
        setIsSubmitting(true);
        try {
            await fjernFartoy(medlem.brukerId);
            onSuccess();
        } catch (error) {
            toast.error("En feil oppstod under fjerning av tildeling.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Administrer fartøy for skipper`}>
            <p>Bruker: <strong>{medlem.brukerId}</strong></p>
            <div className={inputStyles.formRow}>
                <label htmlFor="fartoy-select" className={inputStyles.label}>Tildel fartøy</label>
                <select 
                    id="fartoy-select" 
                    className={inputStyles.input} 
                    value={selectedFartoy}
                    onChange={(e) => setSelectedFartoy(e.target.value)}
                >
                    <option value="">Velg fartøy...</option>
                    {fartoyList.map(f => (
                        <option key={f.id} value={f.id}>{f.navn} ({f.fiskerimerke})</option>
                    ))}
                </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                {medlem.tildeltFartoyId && (
                     <Button variant="danger" onClick={handleRemove} disabled={isSubmitting}>
                        {isSubmitting ? 'Fjerner...' : 'Fjern tildeling'}
                    </Button>
                )}
                <Button onClick={handleSave} disabled={isSubmitting || !selectedFartoy}>
                    {isSubmitting ? 'Lagrer...' : 'Lagre'}
                </Button>
            </div>
        </Modal>
    );
};

export default TildelFartoyModal;