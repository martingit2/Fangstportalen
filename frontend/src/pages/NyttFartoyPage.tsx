import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { fartoySchema, type FartoyFormData } from '../schemas/fartoySchema';
import { createFartoy } from '../services/apiService';
import styles from './NyOrdrePage.module.css';
import inputStyles from '../components/ui/Input.module.css';
import Button from '../components/ui/Button';

const NyttFartoyPage: React.FC = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FartoyFormData>({
        resolver: zodResolver(fartoySchema),
    });

    const onSubmit = async (data: FartoyFormData) => {
        try {
            await createFartoy(data);
            navigate('/innstillinger');
        } catch (error) {
            alert('En feil oppstod under registrering av fartøy.');
            console.error(error);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Registrer nytt fartøy</h1>
            <div className={styles.form}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className={inputStyles.formRow}>
                        <label htmlFor="navn" className={inputStyles.label}>Navn på fartøy</label>
                        <input id="navn" type="text" {...register('navn')} className={inputStyles.input} />
                        {errors.navn && <p className={inputStyles.error}>{errors.navn.message}</p>}
                    </div>

                    <div className={inputStyles.formRow}>
                        <label htmlFor="fiskerimerke" className={inputStyles.label}>Fiskerimerke</label>
                        <input id="fiskerimerke" type="text" {...register('fiskerimerke')} className={inputStyles.input} placeholder="Eks: F-123-A" />
                        {errors.fiskerimerke && <p className={inputStyles.error}>{errors.fiskerimerke.message}</p>}
                    </div>

                    <div className={inputStyles.formRow}>
                        <label htmlFor="kallesignal" className={inputStyles.label}>Kallesignal</label>
                        <input id="kallesignal" type="text" {...register('kallesignal')} className={inputStyles.input} />
                        {errors.kallesignal && <p className={inputStyles.error}>{errors.kallesignal.message}</p>}
                    </div>

                    <div className={styles.actions}>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Registrerer...' : 'Registrer fartøy'}
                        </Button>
                        <Button type="button" variant="secondary" onClick={() => navigate('/innstillinger')}>
                            Avbryt
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NyttFartoyPage;