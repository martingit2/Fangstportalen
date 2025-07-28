import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { getMineAvtalteOrdrer, createSluttseddel } from '../services/apiService';
import type { OrdreResponseDto } from '../types/ordre';
import styles from './NySluttseddelPage.module.css';
import inputStyles from '../components/ui/Input.module.css';
import Button from '../components/ui/Button';

interface SluttseddelFormData {
    ordreId: number;
    landingsdato: string;
    linjer: {
        ordrelinjeId: number;
        faktiskKvantum: string;
    }[];
}

const NySluttseddelPage: React.FC = () => {
    const navigate = useNavigate();
    const [avtalteOrdrer, setAvtalteOrdrer] = useState<OrdreResponseDto[]>([]);
    const [selectedOrdre, setSelectedOrdre] = useState<OrdreResponseDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { register, control, handleSubmit, formState: { isSubmitting }, setValue } = useForm<SluttseddelFormData>();
    const { fields } = useFieldArray({ control, name: "linjer" });

    useEffect(() => {
        getMineAvtalteOrdrer()
            .then(res => setAvtalteOrdrer(res.data))
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    }, []);

    const handleSelectOrdre = (ordre: OrdreResponseDto) => {
        setSelectedOrdre(ordre);
        setValue('ordreId', ordre.id);
        setValue('landingsdato', new Date().toISOString().split('T')[0]);
        setValue('linjer', ordre.ordrelinjer.map(linje => ({
            ordrelinjeId: linje.id,
            faktiskKvantum: String(linje.forventetKvantum)
        })));
    };

    const onSubmit = async (data: SluttseddelFormData) => {
        const payload = {
            ...data,
            linjer: data.linjer.map(l => ({
                ...l,
                faktiskKvantum: parseFloat(l.faktiskKvantum)
            }))
        };
        try {
            await createSluttseddel(payload);
            navigate('/dashboard');
        } catch (error) {
            alert('Kunne ikke opprette sluttseddel.');
        }
    };
    
    if (isLoading) return <div>Laster avtalte ordrer...</div>;

    if (!selectedOrdre) {
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>Opprett sluttseddel - Velg ordre</h1>
                {avtalteOrdrer.length === 0 ? (
                    <p>Du har ingen avtalte ordrer som venter på sluttseddel.</p>
                ) : (
                    <div className={styles.ordreList}>
                        {avtalteOrdrer.map(ordre => (
                            <div key={ordre.id} className={styles.ordreCard} onClick={() => handleSelectOrdre(ordre)}>
                                <h3>Ordre #{ordre.id} til {ordre.kjoperOrganisasjonNavn}</h3>
                                <p>Levering til {ordre.leveringssted} den {new Date(ordre.forventetLeveringsdato).toLocaleDateString('nb-NO')}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Registrer landing for Ordre #{selectedOrdre.id}</h1>
            <div className={styles.form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={inputStyles.formRow}>
                        <label htmlFor="landingsdato" className={inputStyles.label}>Faktisk landingsdato</label>
                        <input id="landingsdato" type="date" {...register('landingsdato')} className={inputStyles.input} />
                    </div>
                    
                    <h2 className={styles.subTitle}>Veid kvantum</h2>
                    {fields.map((field, index) => (
                        <div key={field.id} className={styles.kvantumLinje}>
                            <span>{selectedOrdre.ordrelinjer[index].fiskeslag}</span>
                            <input 
                                type="text"
                                inputMode="decimal"
                                {...register(`linjer.${index}.faktiskKvantum`)}
                                className={inputStyles.input}
                            />
                             <span>kg</span>
                        </div>
                    ))}
                    
                    <div className={styles.actions}>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Lagrer...' : 'Opprett Sluttseddel'}</Button>
                        <Button type="button" variant="secondary" onClick={() => setSelectedOrdre(null)}>Tilbake til ordrevalg</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NySluttseddelPage;