import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { budSchema, type BudFormData } from '../schemas/budSchema';
import { giBud } from '../services/apiService';
import inputStyles from './ui/Input.module.css';
import styles from './GiBudModal.module.css';
import type { FangstmeldingResponseDto } from '../types/fangstmelding';

interface GiBudModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    fangstmelding: FangstmeldingResponseDto;
}

const GiBudModal: React.FC<GiBudModalProps> = ({ isOpen, onClose, onSuccess, fangstmelding }) => {
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<BudFormData>({
        resolver: zodResolver(budSchema),
        defaultValues: {
            budLinjer: fangstmelding.fangstlinjer.map(fl => ({
                fangstlinjeId: fl.id,
                budPrisPerKg: String(fl.utropsprisPerKg)
            }))
        }
    });

    const { fields } = useFieldArray({
        control,
        name: "budLinjer"
    });

    const onSubmit = async (data: BudFormData) => {
        try {
            await giBud(fangstmelding.id, data);
            onSuccess();
            onClose();
        } catch (error) {
            alert('En feil oppstod under budgivning.');
        } finally {
            reset();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Gi bud på fangst fra ${fangstmelding.fartoyNavn}`}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className={styles.budLinjerContainer}>
                    {fields.map((field, index) => {
                        const fangstlinje = fangstmelding.fangstlinjer[index];
                        return (
                            <div key={field.id} className={styles.budLinje}>
                                <div className={styles.fangstInfo}>
                                    <span className={styles.fiskeslag}>{fangstlinje.fiskeslag}</span>
                                    <span className={styles.detaljer}>~{fangstlinje.estimertKvantum} kg @ {fangstlinje.utropsprisPerKg} kr/kg</span>
                                </div>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        {...register(`budLinjer.${index}.budPrisPerKg`)}
                                        className={inputStyles.input}
                                    />
                                    <span className={styles.enhet}>kr/kg</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {errors.budLinjer && <p className={inputStyles.error}>{errors.budLinjer.message}</p>}

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