import React, { useState, useMemo } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import apiClient from '../services/apiService';
import styles from './OnboardingPage.module.css';
import inputStyles from '../components/ui/Input.module.css';
import Button from '../components/ui/Button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createOnboardingSchema, type OnboardingFormData, type OrgType } from '../schemas/onboardingSchema';

const OnboardingPage: React.FC = () => {
    const [orgType, setOrgType] = useState<OrgType | null>(null);
    const { logout, user } = useAuth0();
    
    const schema = useMemo(() => createOnboardingSchema(orgType || 'FISKEBRUK'), [orgType]);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<OnboardingFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            adminNavn: (user?.name && !user.name.includes('@')) ? user.name : '',
        }
    });

    const onSubmit = async (data: OnboardingFormData) => {
        const payload = {
            ...data,
            type: orgType,
            fartoy: orgType === 'REDERI' ? [{ 
                navn: data.fartoyNavn, 
                fiskerimerke: data.fiskerimerke, 
                kallesignal: data.kallesignal 
            }] : []
        };
        try {
            await apiClient.post('/onboarding/registrer', payload);
            alert("Registrering vellykket! Logg inn på nytt for å få tilgang til ditt nye dashboard.");
            logout({ logoutParams: { returnTo: window.location.origin } });
        } catch (error) {
            alert('En feil oppstod under registrering.');
        }
    };
    
    if (!orgType) {
        return (
            <div className={`${styles.container} ${styles.centered}`}>
                <div className={styles.card}>
                    <div className={styles.welcomeContent}>
                        <h1>Velkommen til Fangstportalen!</h1>
                        <p>For å fortsette, velg hvilken type organisasjon du representerer.</p>
                        <div className={styles.choiceButtons}>
                            <Button onClick={() => setOrgType('REDERI')}>Rederi</Button>
                            <Button onClick={() => setOrgType('FISKEBRUK')}>Fiskebruk</Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1>Registrer {orgType === 'REDERI' ? 'Rederi' : 'Fiskebruk'}</h1>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className={styles.formLayout}>
                        <div className={styles.column}>
                            <div className={styles.formSection}>
                                <h3 className={styles.sectionTitle}>Organisasjonsinformasjon</h3>
                                <div className={styles.fieldGroup}>
                                    <div className={inputStyles.formRow}><label className={inputStyles.label}>Navn på organisasjon</label><input {...register('navn')} className={inputStyles.input} />{errors.navn && <p className={inputStyles.error}>{errors.navn.message}</p>}</div>
                                    <div className={styles.pair}>
                                        <div className={inputStyles.formRow}><label className={inputStyles.label}>Organisasjonsnummer</label><input {...register('organisasjonsnummer')} className={inputStyles.input} />{errors.organisasjonsnummer && <p className={inputStyles.error}>{errors.organisasjonsnummer.message}</p>}</div>
                                        <div className={inputStyles.formRow}><label className={inputStyles.label}>Telefon (sentralbord)</label><input {...register('telefonnummer')} className={inputStyles.input} />{errors.telefonnummer && <p className={inputStyles.error}>{errors.telefonnummer.message}</p>}</div>
                                    </div>
                                    <div className={inputStyles.formRow}><label className={inputStyles.label}>Forretningsadresse</label><input {...register('adresse')} className={inputStyles.input} />{errors.adresse && <p className={inputStyles.error}>{errors.adresse.message}</p>}</div>
                                    <div className={styles.pair}>
                                        <div className={inputStyles.formRow}><label className={inputStyles.label}>Postnummer</label><input {...register('postnummer')} className={inputStyles.input} />{errors.postnummer && <p className={inputStyles.error}>{errors.postnummer.message}</p>}</div>
                                        <div className={inputStyles.formRow}><label className={inputStyles.label}>Poststed</label><input {...register('poststed')} className={inputStyles.input} />{errors.poststed && <p className={inputStyles.error}>{errors.poststed.message}</p>}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.column}>
                            <div className={styles.formSection}>
                                <h3 className={styles.sectionTitle}>Din informasjon (Administrator)</h3>
                                <div className={styles.fieldGroup}>
                                    <div className={styles.pair}>
                                        <div className={inputStyles.formRow}><label className={inputStyles.label}>Fullt navn</label><input {...register('adminNavn')} className={inputStyles.input} />{errors.adminNavn && <p className={inputStyles.error}>{errors.adminNavn.message}</p>}</div>
                                        <div className={inputStyles.formRow}><label className={inputStyles.label}>Tittel (valgfri)</label><input {...register('adminTittel')} className={inputStyles.input} placeholder="F.eks. Daglig leder"/>{errors.adminTittel && <p className={inputStyles.error}>{errors.adminTittel.message}</p>}</div>
                                    </div>
                                    <div className={inputStyles.formRow}><label className={inputStyles.label}>Ditt telefonnummer (valgfri)</label><input {...register('adminTelefonnummer')} className={inputStyles.input} />{errors.adminTelefonnummer && <p className={inputStyles.error}>{errors.adminTelefonnummer.message}</p>}</div>
                                </div>
                            </div>
                            {orgType === 'REDERI' && (
                                <div className={styles.formSection}>
                                    <h3 className={styles.sectionTitle}>Registrer ditt første fartøy</h3>
                                    <div className={styles.fieldGroup}>
                                        <div className={inputStyles.formRow}><label className={inputStyles.label}>Fartøynavn</label><input {...register('fartoyNavn')} className={inputStyles.input} />{errors.fartoyNavn && <p className={inputStyles.error}>{errors.fartoyNavn.message}</p>}</div>
                                        <div className={styles.pair}>
                                            <div className={inputStyles.formRow}><label className={inputStyles.label}>Fiskerimerke</label><input {...register('fiskerimerke')} className={inputStyles.input} placeholder="Eks: F-123-A"/>{errors.fiskerimerke && <p className={inputStyles.error}>{errors.fiskerimerke.message}</p>}</div>
                                            <div className={inputStyles.formRow}><label className={inputStyles.label}>Kallesignal</label><input {...register('kallesignal')} className={inputStyles.input} />{errors.kallesignal && <p className={inputStyles.error}>{errors.kallesignal.message}</p>}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={styles.formActions}>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Registrerer...' : 'Fullfør registrering'}</Button>
                        <Button variant="secondary" onClick={() => setOrgType(null)}>Tilbake</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OnboardingPage;