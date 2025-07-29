import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from './ui/Modal';
import Button from './ui/Button';
import inputStyles from './ui/Input.module.css';
import styles from './InviterMedlemModal.module.css';
import { invitasjonSchema, type InvitasjonFormData } from '../schemas/invitasjonSchema';
import { inviterMedlem } from '../services/apiService';
import { useClaims } from '../hooks/useClaims';
import axios from 'axios';

interface InviterMedlemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const rederiRoller = {
    'REDERI_ADMIN': 'Administrator',
    'REDERI_SKIPPER': 'Skipper',
};

const fiskebrukRoller = {
    'FISKEBRUK_ADMIN': 'Administrator',
    'FISKEBRUK_INNKJOPER': 'Innkjøper',
};

const InviterMedlemModal: React.FC<InviterMedlemModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const { claims } = useClaims();
    const tilgjengeligeRoller = claims?.org_type === 'REDERI' ? rederiRoller : fiskebrukRoller;

    const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm<InvitasjonFormData>({
        resolver: zodResolver(invitasjonSchema),
        defaultValues: { email: '', roller: [] }
    });

    const onSubmit = async (data: InvitasjonFormData) => {
        try {
            await inviterMedlem(data);
            onSuccess();
            onClose();
            reset();
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                setError("email", { type: "manual", message: "En bruker med denne e-postadressen finnes allerede." });
            } else {
                console.error("Invitasjon feilet:", error);
                alert("En uventet feil oppstod under sending av invitasjon.");
            }
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Inviter nytt teammedlem">
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
                <div className={inputStyles.formRow}>
                    <label htmlFor="email" className={inputStyles.label}>E-postadresse</label>
                    <input id="email" type="email" {...register('email')} className={inputStyles.input} />
                    {errors.email && <p className={inputStyles.error}>{errors.email.message}</p>}
                </div>
                <div className={inputStyles.formRow}>
                    <label className={inputStyles.label}>Roller</label>
                    <div className={styles.roleSelection}>
                        {Object.entries(tilgjengeligeRoller).map(([key, value]) => (
                            <label key={key} className={styles.roleLabel}>
                                <input type="checkbox" {...register('roller')} value={key} />
                                {value}
                            </label>
                        ))}
                    </div>
                    {errors.roller && <p className={inputStyles.error}>{errors.roller.message}</p>}
                </div>
                <div className={styles.actions}>
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sender...' : 'Send invitasjon'}</Button>
                    <Button type="button" variant="secondary" onClick={handleClose}>Avbryt</Button>
                </div>
            </form>
        </Modal>
    );
};

export default InviterMedlemModal;