import React, { useState, useEffect, useCallback } from 'react';
import Button from '../components/ui/Button';
import { useClaims } from '../hooks/useClaims';
import styles from './InnstillingerPage.module.css';
import inputStyles from '../components/ui/Input.module.css';
import { getMineFartoy, getMineTeamMedlemmer, getMinProfil, updateMinProfil, getMinOrganisasjon, updateMinOrganisasjon } from '../services/apiService';
import type { FartoyResponseDto } from '../types/fartoy';
import type { TeamMedlemResponseDto } from '../types/team';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profilSchema, type ProfilFormData } from '../schemas/profilSchema';
import { organisasjonSchema, type OrganisasjonFormData } from '../schemas/organisasjonSchema';
import InviterMedlemModal from '../components/InviterMedlemModal';

const MinProfilSection: React.FC = () => {
    const [profil, setProfil] = useState<ProfilFormData | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProfilFormData>({ resolver: zodResolver(profilSchema) });

    const fetchData = useCallback(async () => {
        try {
            const { data } = await getMinProfil();
            setProfil(data);
            reset(data);
        } catch (error) { console.error("Kunne ikke hente profil", error); }
    }, [reset]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const onSubmit = async (data: ProfilFormData) => {
        const { data: updatedData } = await updateMinProfil(data);
        setProfil(updatedData);
        reset(updatedData);
        setIsEditing(false);
    };

    if (!profil) return <div className={styles.section}>Laster profil...</div>;

    return (
        <section className={styles.section}>
            <header className={styles.sectionHeader}><h2 className={styles.sectionTitle}>Min Profil</h2>{!isEditing && <Button variant="secondary" onClick={() => setIsEditing(true)}>Rediger</Button>}</header>
            <div className={styles.sectionContent}>
                {isEditing ? (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles.formGrid}>
                            <div className={inputStyles.formRow}><label className={inputStyles.label}>Fullt navn</label><input {...register('navn')} className={inputStyles.input} />{errors.navn && <p className={inputStyles.error}>{errors.navn.message}</p>}</div>
                            <div className={inputStyles.formRow}><label className={inputStyles.label}>Tittel</label><input {...register('tittel')} className={inputStyles.input} />{errors.tittel && <p className={inputStyles.error}>{errors.tittel.message}</p>}</div>
                        </div>
                        <div className={`${inputStyles.formRow} ${styles.fullWidth}`}><label className={inputStyles.label}>Telefon</label><input {...register('telefonnummer')} className={inputStyles.input} />{errors.telefonnummer && <p className={inputStyles.error}>{errors.telefonnummer.message}</p>}</div>
                        <div className={styles.actions}><Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Lagrer...' : 'Lagre'}</Button><Button variant="secondary" type="button" onClick={() => { setIsEditing(false); reset(profil); }}>Avbryt</Button></div>
                    </form>
                ) : (
                    <div className={styles.infoGrid}>
                        <div className={styles.infoBlock}><h4>Navn</h4><p>{profil.navn}</p></div>
                        <div className={styles.infoBlock}><h4>Tittel</h4><p>{profil.tittel || '-'}</p></div>
                        <div className={styles.infoBlock}><h4>Telefon</h4><p>{profil.telefonnummer || '-'}</p></div>
                    </div>
                )}
            </div>
        </section>
    );
};

const OrganisasjonSection: React.FC = () => {
    const [org, setOrg] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<OrganisasjonFormData>({ resolver: zodResolver(organisasjonSchema) });

    const fetchData = useCallback(async () => {
        try {
            const { data } = await getMinOrganisasjon();
            setOrg(data);
            reset(data);
        } catch (error) { console.error("Kunne ikke hente organisasjon", error); }
    }, [reset]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const onSubmit = async (data: OrganisasjonFormData) => {
        const { data: updatedData } = await updateMinOrganisasjon(data);
        setOrg(updatedData);
        reset(updatedData);
        setIsEditing(false);
    };

    if (!org) return <div className={styles.section}>Laster organisasjon...</div>;

    return (
        <section className={styles.section}>
            <header className={styles.sectionHeader}><h2 className={styles.sectionTitle}>Min Organisasjon</h2>{!isEditing && <Button variant="secondary" onClick={() => setIsEditing(true)}>Rediger</Button>}</header>
            <div className={styles.sectionContent}>
                {isEditing ? (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={inputStyles.formRow}><label className={inputStyles.label}>Navn</label><input {...register('navn')} className={inputStyles.input} />{errors.navn && <p className={inputStyles.error}>{errors.navn.message}</p>}</div>
                        <div className={inputStyles.formRow}><label className={inputStyles.label}>Adresse</label><input {...register('adresse')} className={inputStyles.input} />{errors.adresse && <p className={inputStyles.error}>{errors.adresse.message}</p>}</div>
                        <div className={styles.formGrid}>
                            <div className={inputStyles.formRow}><label className={inputStyles.label}>Postnummer</label><input {...register('postnummer')} className={inputStyles.input} />{errors.postnummer && <p className={inputStyles.error}>{errors.postnummer.message}</p>}</div>
                            <div className={inputStyles.formRow}><label className={inputStyles.label}>Poststed</label><input {...register('poststed')} className={inputStyles.input} />{errors.poststed && <p className={inputStyles.error}>{errors.poststed.message}</p>}</div>
                        </div>
                        <div className={inputStyles.formRow}><label className={inputStyles.label}>Telefon</label><input {...register('telefonnummer')} className={inputStyles.input} />{errors.telefonnummer && <p className={inputStyles.error}>{errors.telefonnummer.message}</p>}</div>
                        <div className={styles.actions}><Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Lagrer...' : 'Lagre'}</Button><Button variant="secondary" type="button" onClick={() => { setIsEditing(false); reset(org); }}>Avbryt</Button></div>
                    </form>
                ) : (
                    <div className={styles.infoGrid}>
                        <div className={styles.infoBlock}><h4>Navn</h4><p>{org.navn}</p></div>
                        <div className={styles.infoBlock}><h4>Org.nr</h4><p>{org.organisasjonsnummer}</p></div>
                        <div className={styles.infoBlock}><h4>Adresse</h4><p>{org.adresse}, {org.postnummer} {org.poststed}</p></div>
                        <div className={styles.infoBlock}><h4>Telefon</h4><p>{org.telefonnummer || '-'}</p></div>
                    </div>
                )}
            </div>
        </section>
    );
};

const FartoySection: React.FC = () => {
    const [fartoyList, setFartoyList] = useState<FartoyResponseDto[]>([]);
    useEffect(() => { getMineFartoy().then(res => setFartoyList(res.data)); }, []);

    return (
        <section className={styles.section}>
            <header className={styles.sectionHeader}><h2 className={styles.sectionTitle}>Fartøy</h2><Button to="/innstillinger/nytt-fartoy">+ Legg til nytt fartøy</Button></header>
            <div className={styles.sectionContent}>
                {fartoyList.length === 0 ? <p>Ingen fartøy registrert.</p> : (
                     <table className={styles.table}>
                        <thead><tr><th>Navn</th><th>Fiskerimerke</th><th>Kallesignal</th></tr></thead>
                        <tbody>{fartoyList.map((f) => (<tr key={f.id}><td>{f.navn}</td><td>{f.fiskerimerke}</td><td>{f.kallesignal}</td></tr>))}</tbody>
                    </table>
                )}
            </div>
        </section>
    );
};

const TeamSection: React.FC = () => {
    const [medlemmer, setMedlemmer] = useState<TeamMedlemResponseDto[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const fetchData = useCallback(async () => {
        getMineTeamMedlemmer().then(res => setMedlemmer(res.data));
    }, []);
    
    useEffect(() => { fetchData(); }, [fetchData]);

    const handleSuccess = () => {
        alert("Invitasjon sendt!");
        fetchData();
    };

    return (
        <>
            <section className={styles.section}>
                <header className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Team</h2>
                    <Button variant="secondary" onClick={() => setIsModalOpen(true)}>+ Inviter nytt medlem</Button>
                </header>
                <div className={styles.sectionContent}>
                    <table className={styles.table}>
                        <thead><tr><th>Bruker ID</th><th>Roller</th></tr></thead>
                        <tbody>{medlemmer.map((m) => (<tr key={m.brukerId}><td className={styles.brukerIdCell}>{m.brukerId}</td><td>{m.roller.join(', ')}</td></tr>))}</tbody>
                    </table>
                </div>
            </section>
            <InviterMedlemModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={handleSuccess} />
        </>
    );
}

const InnstillingerPage: React.FC = () => {
    const { claims, isLoading } = useClaims();
    if (isLoading) return <div>Laster innstillinger...</div>;
    const erAdmin = claims?.roles.some(r => r.endsWith('_ADMIN'));

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Innstillinger</h1>
            <MinProfilSection />
            {erAdmin && <OrganisasjonSection />}
            {erAdmin && <TeamSection />}
            {claims?.org_type === 'REDERI' && erAdmin && <FartoySection />}
        </div>
    );
};

export default InnstillingerPage;