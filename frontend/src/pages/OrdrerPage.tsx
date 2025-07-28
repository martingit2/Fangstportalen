import React, { useState, useEffect, useCallback } from 'react';
import styles from './OrdrerPage.module.css';
import { getMineOrdrer } from '../services/apiService'; 
import type { OrdreResponseDto } from '../types/ordre';
import Button from '../components/ui/Button';
import { useRoles } from '../hooks/usePermissions';

const OrdrerPage: React.FC = () => {
    const [ordrer, setOrdrer] = useState<OrdreResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [aktivFane, setAktivFane] = useState('AVTALT');
    const { roles } = useRoles();
    const erSkipper = roles.includes('REDERI_SKIPPER');

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            // TODO: Trenger separate API-kall for skipper og innkjøper
            const response = await getMineOrdrer(); 
            setOrdrer(response.data);
        } catch (error) {
            console.error("Kunne ikke hente ordrer", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filtrerteOrdrer = ordrer.filter(o => o.status === aktivFane);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Mine Ordrer</h1>
                {!erSkipper && <Button to="/ny-ordre">Opprett Åpen Ordre</Button>}
            </header>

            <div className={styles.faneContainer}>
                <button onClick={() => setAktivFane('AVTALT')} className={aktivFane === 'AVTALT' ? styles.faneAktiv : styles.fane}>Ventende Leveranse</button>
                <button onClick={() => setAktivFane('AKTIV')} className={aktivFane === 'AKTIV' ? styles.faneAktiv : styles.fane}>Åpne i Markedet</button>
                <button onClick={() => setAktivFane('FULLFØRT')} className={aktivFane === 'FULLFØRT' ? styles.faneAktiv : styles.fane}>Fullførte</button>
            </div>

            <div className={styles.content}>
                {isLoading ? <p>Laster...</p> : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Ordre ID</th>
                                <th>{erSkipper ? 'Kjøper' : 'Selger'}</th>
                                <th>Leveringssted</th>
                                <th>Dato</th>
                                <th>Handling</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtrerteOrdrer.length === 0 ? (
                                <tr><td colSpan={5} className={styles.empty}>Ingen ordrer i denne kategorien.</td></tr>
                            ) : filtrerteOrdrer.map(ordre => (
                                <tr key={ordre.id}>
                                    <td>#{ordre.id}</td>
                                    <td>{ordre.kjoperOrganisasjonNavn}</td>
                                    <td>{ordre.leveringssted}</td>
                                    <td>{new Date(ordre.forventetLeveringsdato).toLocaleDateString('nb-NO')}</td>
                                    <td>
                                        {ordre.status === 'AVTALT' && erSkipper && (
                                            <Button to="/ny-sluttseddel">Registrer landing</Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default OrdrerPage;