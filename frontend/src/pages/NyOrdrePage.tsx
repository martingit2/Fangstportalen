import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { ordreSchema } from '../schemas/ordreSchema';
import type { OrdreFormData } from '../schemas/ordreSchema';
import apiClient from '../services/apiService';
import styles from './NyOrdrePage.module.css';
import inputStyles from '../components/ui/Input.module.css';
import Button from '../components/ui/Button';

const NyOrdrePage: React.FC = () => {
    const navigate = useNavigate();
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<OrdreFormData>({
        resolver: zodResolver(ordreSchema),
        defaultValues: {
            forventetLeveringsdato: new Date().toISOString().split('T')[0],
            ordrelinjer: [{ fiskeslag: '', kvalitet: '', storrelse: '', avtaltPrisPerKg: '', forventetKvantum: '' }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'ordrelinjer',
    });

    const onSubmit = async (data: OrdreFormData) => {
        try {
            const payload = {
                ...data,
                ordrelinjer: data.ordrelinjer.map(linje => ({
                    ...linje,
                    avtaltPrisPerKg: parseFloat(linje.avtaltPrisPerKg),
                    forventetKvantum: parseFloat(linje.forventetKvantum),
                }))
            };
            await apiClient.post('/ordrer', payload);
            navigate('/dashboard', { replace: true });
        } catch (error) {
            alert('En feil oppstod under lagring av ordre.');
            console.error(error);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Opprett ny ordre</h1>
            <div className={styles.form}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className={inputStyles.formRow}>
                        <label htmlFor="forventetLeveringsdato" className={inputStyles.label}>Forventet Leveringsdato</label>
                        <input id="forventetLeveringsdato" type="date" {...register('forventetLeveringsdato')} className={inputStyles.input} />
                        {errors.forventetLeveringsdato && <p className={inputStyles.error}>{errors.forventetLeveringsdato.message}</p>}
                    </div>

                    <h2 className={styles.subTitle}>Ordrelinjer</h2>
                    {fields.map((field, index) => (
                        <div key={field.id} className={styles.ordrelinje}>
                            <input {...register(`ordrelinjer.${index}.fiskeslag`)} placeholder="Fiskeslag" className={inputStyles.input} />
                            <input {...register(`ordrelinjer.${index}.avtaltPrisPerKg`)} type="text" inputMode="decimal" placeholder="Pris/kg" className={inputStyles.input} />
                            <input {...register(`ordrelinjer.${index}.forventetKvantum`)} type="text" inputMode="decimal" placeholder="Kvantum (kg)" className={inputStyles.input} />
                            <Button type="button" variant="secondary" onClick={() => remove(index)}>Fjern</Button>
                        </div>
                    ))}
                     {errors.ordrelinjer && <p className={inputStyles.error}>{errors.ordrelinjer.message}</p>}
                     {errors.ordrelinjer?.root && <p className={inputStyles.error}>{errors.ordrelinjer.root.message}</p>}

                    <Button type="button" variant="secondary" onClick={() => append({ fiskeslag: '', kvalitet: '', storrelse: '', avtaltPrisPerKg: '', forventetKvantum: '' })}>
                        + Legg til linje
                    </Button>

                    <div className={styles.actions}>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Oppretter...' : 'Opprett ordre'}
                        </Button>
                        <Button type="button" variant="secondary" onClick={() => navigate('/dashboard')}>Avbryt</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NyOrdrePage;