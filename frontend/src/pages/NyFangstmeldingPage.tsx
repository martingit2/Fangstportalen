import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { fangstmeldingSchema } from '../schemas/fangstmeldingSchema';
import type { FangstmeldingFormData } from '../schemas/fangstmeldingSchema'; 
import { createFangstmelding } from '../services/apiService';
import styles from './NyOrdrePage.module.css';
import inputStyles from '../components/ui/Input.module.css';
import Button from '../components/ui/Button';

const NyFangstmeldingPage: React.FC = () => {
    const navigate = useNavigate();
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FangstmeldingFormData>({
        resolver: zodResolver(fangstmeldingSchema),
        defaultValues: {
            leveringssted: '',
            tilgjengeligFraDato: new Date().toISOString().split('T')[0],
            fangstlinjer: [{ fiskeslag: '', estimertKvantum: '' }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'fangstlinjer',
    });

    const onSubmit = async (data: FangstmeldingFormData) => {
        try {
            await createFangstmelding(data);
            navigate('/dashboard');
        } catch (error) {
            alert('En feil oppstod under annonsering av fangst.');
            console.error(error);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Annonser ny fangst</h1>
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
                            <Button type="button" variant="secondary" onClick={() => remove(index)}>Fjern</Button>
                        </div>
                    ))}
                     {errors.fangstlinjer?.root && <p className={inputStyles.error}>{errors.fangstlinjer.root.message}</p>}

                    <Button type="button" variant="secondary" onClick={() => append({ fiskeslag: '', estimertKvantum: '', kvalitet: '', storrelse: '' })}>
                        + Legg til linje
                    </Button>

                    <div className={styles.actions}>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Annonserer...' : 'Annonser fangst'}
                        </Button>
                        <Button type="button" variant="secondary" onClick={() => navigate('/dashboard')}>Avbryt</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NyFangstmeldingPage;