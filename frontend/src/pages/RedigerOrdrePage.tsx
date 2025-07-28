import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { ordreSchema } from '../schemas/ordreSchema';
import type { OrdreFormData } from '../schemas/ordreSchema';
import { getOrdreById, updateOrdre } from '../services/apiService';
import styles from './NyOrdrePage.module.css';
import inputStyles from '../components/ui/Input.module.css';
import Button from '../components/ui/Button';

const RedigerOrdrePage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const ordreId = Number(id);

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<OrdreFormData>({
        resolver: zodResolver(ordreSchema),
    });

    useEffect(() => {
        if (!ordreId) return;
        
        const fetchOrdreData = async () => {
            try {
                const response = await getOrdreById(ordreId);
                const ordre = response.data;
                
                const formData = {
                    leveringssted: ordre.leveringssted,
                    forventetLeveringsdato: ordre.forventetLeveringsdato,
                    forventetLeveringstidFra: ordre.forventetLeveringstidFra || '08:00',
                    forventetLeveringstidTil: ordre.forventetLeveringstidTil || '16:00',
                    ordrelinjer: ordre.ordrelinjer.map(l => ({
                        fiskeslag: l.fiskeslag,
                        avtaltPrisPerKg: String(l.avtaltPrisPerKg),
                        forventetKvantum: String(l.forventetKvantum),
                        kvalitet: l.kvalitet || '',
                        storrelse: l.storrelse || '',
                    }))
                };
                reset(formData);
            } catch (error) {
                console.error("Kunne ikke hente ordredata", error);
                alert("Kunne ikke laste inn ordredata for redigering.");
                navigate('/dashboard');
            }
        };

        fetchOrdreData();
    }, [ordreId, reset, navigate]);

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'ordrelinjer',
    });

    const onSubmit = async (data: OrdreFormData) => {
        try {
            await updateOrdre(ordreId, data);
            navigate('/dashboard');
        } catch (error) {
            alert('En feil oppstod under oppdatering av ordre.');
            console.error(error);
        }
    };

    if (!id) {
        return <div>Laster ordre...</div>
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Rediger åpen ordre #{id}</h1>
            <div className={styles.form}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                     <div className={inputStyles.formRow}>
                        <label htmlFor="leveringssted" className={inputStyles.label}>Leveringssted</label>
                        <input id="leveringssted" type="text" {...register('leveringssted')} className={inputStyles.input} />
                        {errors.leveringssted && <p className={inputStyles.error}>{errors.leveringssted.message}</p>}
                    </div>
                    
                    <div className={styles.formGrid}>
                        <div className={inputStyles.formRow}>
                            <label htmlFor="forventetLeveringsdato" className={inputStyles.label}>Ønsket leveringsdato</label>
                            <input id="forventetLeveringsdato" type="date" {...register('forventetLeveringsdato')} className={inputStyles.input} />
                            {errors.forventetLeveringsdato && <p className={inputStyles.error}>{errors.forventetLeveringsdato.message}</p>}
                        </div>
                        <div className={inputStyles.formRow}>
                            <label htmlFor="forventetLeveringstidFra" className={inputStyles.label}>Levering mellom</label>
                            <input id="forventetLeveringstidFra" type="time" {...register('forventetLeveringstidFra')} className={inputStyles.input} />
                            {errors.forventetLeveringstidFra && <p className={inputStyles.error}>{errors.forventetLeveringstidFra.message}</p>}
                        </div>
                        <div className={inputStyles.formRow}>
                            <label htmlFor="forventetLeveringstidTil" className={inputStyles.label}>og</label>
                            <input id="forventetLeveringstidTil" type="time" {...register('forventetLeveringstidTil')} className={inputStyles.input} />
                            {errors.forventetLeveringstidTil && <p className={inputStyles.error}>{errors.forventetLeveringstidTil.message}</p>}
                        </div>
                    </div>

                    <h2 className={styles.subTitle}>Etterspørsel (ordrelinjer)</h2>
                    {fields.map((field, index) => (
                        <div key={field.id} className={styles.ordrelinje}>
                            <input {...register(`ordrelinjer.${index}.fiskeslag`)} placeholder="Fiskeslag" className={inputStyles.input} />
                            <input {...register(`ordrelinjer.${index}.avtaltPrisPerKg`)} type="text" inputMode="decimal" placeholder="Pris/kg" className={inputStyles.input} />
                            <input {...register(`ordrelinjer.${index}.forventetKvantum`)} type="text" inputMode="decimal" placeholder="Kvantum (kg)" className={inputStyles.input} />
                            <Button type="button" variant="secondary" onClick={() => remove(index)}>Fjern</Button>
                        </div>
                    ))}
                    {errors.ordrelinjer?.root && <p className={inputStyles.error}>{errors.ordrelinjer.root.message}</p>}

                    <Button type="button" variant="secondary" onClick={() => append({ fiskeslag: '', kvalitet: '', storrelse: '', avtaltPrisPerKg: '', forventetKvantum: '' })}>
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

export default RedigerOrdrePage;