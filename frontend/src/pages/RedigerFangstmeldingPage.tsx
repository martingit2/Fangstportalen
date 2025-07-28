import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { fangstmeldingSchema } from '../schemas/fangstmeldingSchema';
import type { FangstmeldingFormData } from '../schemas/fangstmeldingSchema';
import { getFangstmeldingById, updateFangstmelding } from '../services/apiService';
import styles from './NyOrdrePage.module.css';
import inputStyles from '../components/ui/Input.module.css';
import Button from '../components/ui/Button';

const RedigerFangstmeldingPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const fangstmeldingId = Number(id);

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FangstmeldingFormData>({
        resolver: zodResolver(fangstmeldingSchema),
    });

    useEffect(() => {
        if (!fangstmeldingId) return;

        const fetchFangstmeldingData = async () => {
            try {
                const response = await getFangstmeldingById(fangstmeldingId);
                const melding = response.data;
                
                const formData = {
                    leveringssted: melding.leveringssted,
                    tilgjengeligFraDato: melding.tilgjengeligFraDato,
                    fangstlinjer: melding.fangstlinjer.map(l => ({
                        fiskeslag: l.fiskeslag,
                        estimertKvantum: String(l.estimertKvantum),
                        utropsprisPerKg: String(l.utropsprisPerKg),
                        kvalitet: l.kvalitet || '',
                        storrelse: l.storrelse || '',
                    }))
                };
                reset(formData);
            } catch (error) {
                console.error("Kunne ikke hente fangstmelding", error);
                alert("Kunne ikke laste inn fangstmelding for redigering.");
                navigate('/dashboard');
            }
        };
        fetchFangstmeldingData();
    }, [fangstmeldingId, reset, navigate]);

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'fangstlinjer',
    });

    const onSubmit = async (data: FangstmeldingFormData) => {
        try {
            await updateFangstmelding(fangstmeldingId, data);
            navigate('/dashboard');
        } catch (error) {
            alert('En feil oppstod under oppdatering.');
            console.error(error);
        }
    };

    if (!id) return <div>Laster...</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Rediger fangstmelding #{id}</h1>
            <div className={styles.form}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className={inputStyles.formRow}>
                        <label htmlFor="leveringssted" className={inputStyles.label}>Leveringssted</label>
                        <input id="leveringssted" type="text" {...register('leveringssted')} className={inputStyles.input} />
                        {errors.leveringssted && <p className={inputStyles.error}>{errors.leveringssted.message}</p>}
                    </div>
                    <div className={inputStyles.formRow}>
                        <label htmlFor="tilgjengeligFraDato" className={inputStyles.label}>Tilgjengelig fra dato</label>
                        <input id="tilgjengeligFraDato" type="date" {...register('tilgjengeligFraDato')} className={inputStyles.input} />
                        {errors.tilgjengeligFraDato && <p className={inputStyles.error}>{errors.tilgjengeligFraDato.message}</p>}
                    </div>
                    <h2 className={styles.subTitle}>Fangstlinjer</h2>
                    {fields.map((field, index) => (
                        <div key={field.id} className={styles.ordrelinje}>
                            <input {...register(`fangstlinjer.${index}.fiskeslag`)} placeholder="Fiskeslag" className={inputStyles.input} />
                            <input {...register(`fangstlinjer.${index}.estimertKvantum`)} type="text" inputMode="decimal" placeholder="Kvantum (kg)" className={inputStyles.input} />
                            <input {...register(`fangstlinjer.${index}.utropsprisPerKg`)} type="text" inputMode="decimal" placeholder="Utropspris/kg" className={inputStyles.input} />
                            <Button type="button" variant="secondary" onClick={() => remove(index)}>Fjern</Button>
                        </div>
                    ))}
                     {errors.fangstlinjer?.root && <p className={inputStyles.error}>{errors.fangstlinjer.root.message}</p>}

                    <Button type="button" variant="secondary" onClick={() => append({ fiskeslag: '', estimertKvantum: '', utropsprisPerKg: '' })}>
                        + Legg til linje
                    </Button>
                    <div className={styles.actions}>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Lagrer...' : 'Lagre endringer'}
                        </Button>
                        <Button type="button" variant="secondary" onClick={() => navigate('/dashboard')}>Avbryt</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default RedigerFangstmeldingPage;