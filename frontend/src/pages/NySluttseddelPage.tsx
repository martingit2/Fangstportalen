import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { sluttseddelSchema } from '../schemas/sluttseddelSchema';
import type { SluttseddelFormData } from '../schemas/sluttseddelSchema';
import apiClient from '../services/apiService';
import styles from './NySluttseddelPage.module.css';
import inputStyles from '../components/ui/Input.module.css';
import Button from '../components/ui/Button';

const NySluttseddelPage: React.FC = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SluttseddelFormData>({
        resolver: zodResolver(sluttseddelSchema),
        defaultValues: {
            landingsdato: new Date().toISOString().split('T')[0],
            fartoyNavn: '',
            leveringssted: '',
            fiskeslag: '',
            kvantum: '',
        },
    });

    const onSubmit = async (data: SluttseddelFormData) => {
        try {
            const payload = {
                ...data,
                kvantum: parseFloat(data.kvantum),
            };
            await apiClient.post('/sluttsedler', payload);
            navigate('/dashboard', { replace: true });
        } catch (error) {
            console.error('Failed to create sluttseddel', error);
            alert('En feil oppstod under lagring. Prøv igjen.');
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Registrer ny sluttseddel</h1>
            <div className={styles.form}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className={inputStyles.formRow}>
                        <label htmlFor="landingsdato" className={inputStyles.label}>Landingsdato</label>
                        <input id="landingsdato" type="date" {...register('landingsdato')} className={inputStyles.input} />
                        {errors.landingsdato && <p className={inputStyles.error}>{errors.landingsdato.message}</p>}
                    </div>

                    <div className={inputStyles.formRow}>
                        <label htmlFor="fartoyNavn" className={inputStyles.label}>Fartøynavn</label>
                        <input id="fartoyNavn" type="text" {...register('fartoyNavn')} className={inputStyles.input} />
                        {errors.fartoyNavn && <p className={inputStyles.error}>{errors.fartoyNavn.message}</p>}
                    </div>

                    <div className={inputStyles.formRow}>
                        <label htmlFor="leveringssted" className={inputStyles.label}>Leveringssted</label>
                        <input id="leveringssted" type="text" {...register('leveringssted')} className={inputStyles.input} />
                        {errors.leveringssted && <p className={inputStyles.error}>{errors.leveringssted.message}</p>}
                    </div>

                    <div className={inputStyles.formRow}>
                        <label htmlFor="fiskeslag" className={inputStyles.label}>Fiskeslag</label>
                        <input id="fiskeslag" type="text" {...register('fiskeslag')} className={inputStyles.input} />
                        {errors.fiskeslag && <p className={inputStyles.error}>{errors.fiskeslag.message}</p>}
                    </div>

                    <div className={inputStyles.formRow}>
                        <label htmlFor="kvantum" className={inputStyles.label}>Kvantum (kg)</label>
                        <input id="kvantum" type="text" inputMode="decimal" {...register('kvantum')} className={inputStyles.input} />
                        {errors.kvantum && <p className={inputStyles.error}>{errors.kvantum.message}</p>}
                    </div>

                    <div className={styles.actions}>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Lagrer...' : 'Lagre sluttseddel'}
                        </Button>
                        <Button type="button" variant="secondary" onClick={() => navigate('/dashboard')}>
                            Avbryt
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NySluttseddelPage;