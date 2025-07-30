import React from 'react';
import { useForm } from 'react-hook-form';
import Modal from './ui/Modal';
import Button from './ui/Button';
import inputStyles from './ui/Input.module.css';

interface AvvisFormData {
    begrunnelse: string;
}

interface AvvisSluttseddelModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: AvvisFormData) => void;
    isSubmitting: boolean;
}

const AvvisSluttseddelModal: React.FC<AvvisSluttseddelModalProps> = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<AvvisFormData>();

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Avvis Sluttseddel">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={inputStyles.formRow}>
                    <label htmlFor="begrunnelse" className={inputStyles.label}>Begrunnelse for avvisning</label>
                    <textarea
                        id="begrunnelse"
                        {...register('begrunnelse', { required: 'Begrunnelse er påkrevd.' })}
                        className={inputStyles.input}
                        rows={4}
                    />
                    {errors.begrunnelse && <p className={inputStyles.error}>{errors.begrunnelse.message}</p>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                    <Button type="submit" variant="danger" disabled={isSubmitting}>
                        {isSubmitting ? 'Avviser...' : 'Bekreft Avvisning'}
                    </Button>
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Avbryt
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default AvvisSluttseddelModal;