import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { getOrdrerKlareForSluttseddel, createSluttseddel } from '../services/apiService';
import type { OrdreResponseDto } from '../types/ordre';
import styles from './NySluttseddelPage.module.css';
import inputStyles from '../components/ui/Input.module.css';
import Button from '../components/ui/Button';
import { useClaims } from '../hooks/useClaims';
import toast from 'react-hot-toast';

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
    const { claims, isLoading: claimsLoading } = useClaims();
    const [avtalteOrdrer, setAvtalteOrdrer] = useState<OrdreResponseDto[]>([]);
    const [selectedOrdre, setSelectedOrdre] = useState<OrdreResponseDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const erSkipper = claims?.roles.some(r => r.startsWith('REDERI_'));

    const { register, control, handleSubmit, formState: { isSubmitting }, setValue } = useForm<SluttseddelFormData>();
    const { fields } = useFieldArray({ control, name: "linjer" });

    useEffect(() => {
        if (erSkipper) {
            getOrdrerKlareForSluttseddel()
                .then(res => setAvtalteOrdrer(res.data))
                .catch(err => {
                    console.error(err);
                    toast.error("Kunne ikke hente ordrer klare for sluttseddel.");
                })
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, [erSkipper]);

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
            toast.success("Sluttseddel ble opprettet og signert.");
            navigate('/dashboard');
        } catch (error) {
            toast.error('Kunne ikke opprette sluttseddel.');
        }
    };
    
    if (isLoading || claimsLoading) return <div>Laster...</div>;

    if (!erSkipper) {
        return (
             <div className={styles.container}>
                <h1 className={styles.title}>Ny Sluttseddel</h1>
                <div className={styles.emptyState}>
                    <p>Denne funksjonen er kun tilgjengelig for skippere.</p>
                </div>
            </div>
        );
    }

    if (!selectedOrdre) {
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>Opprett sluttseddel - Velg ordre</h1>
                {isLoading ? <p>Laster ordrer...</p> : avtalteOrdrer.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>Du har ingen avtalte ordrer som venter på sluttseddel.</p>
                        <Button variant="secondary" onClick={() => navigate('/dashboard')}>Tilbake til Markedsplass</Button>
                    </div>
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
                            <label className={styles.fiskeslagLabel}>{selectedOrdre.ordrelinjer[index].fiskeslag}</label>
                            <input 
                                type="text"
                                inputMode="decimal"
                                {...register(`linjer.${index}.faktiskKvantum`)}
                                className={inputStyles.input}
                            />
                             <span className={styles.enhetLabel}>kg</span>
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