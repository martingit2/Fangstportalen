import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { budSchema, type BudFormData } from '../schemas/budSchema';
import { giBud } from '../services/apiService';
import inputStyles from './ui/Input.module.css';
import styles from './GiBudModal.module.css';

interface GiBudModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    fangstmeldingId: number;
}

const GiBudModal: React.FC<GiBudModalProps> = ({ isOpen, onClose, onSuccess, fangstmeldingId }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<BudFormData>({
        resolver: zodResolver(budSchema),
    });

    const onSubmit = async (data: BudFormData) => {
        try {
            await giBud(fangstmeldingId, data);
            onSuccess();
            onClose();
        } catch (error) {
            alert('En feil oppstod under budgivning.');
        } finally {
            reset();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Gi bud på fangstmelding #${fangstmeldingId}`}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className={inputStyles.formRow}>
                    <label htmlFor="budPrisPerKg" className={inputStyles.label}>Din pris per kg (NOK)</label>
                    <input
                        id="budPrisPerKg"
                        type="text"
                        inputMode="decimal"
                        {...register('budPrisPerKg')}
                        className={inputStyles.input}
                    />
                    {errors.budPrisPerKg && <p className={inputStyles.error}>{errors.budPrisPerKg.message}</p>}
                </div>
                <div className={styles.actions}>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Sender bud...' : 'Send bud'}
                    </Button>
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Avbryt
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default GiBudModal;