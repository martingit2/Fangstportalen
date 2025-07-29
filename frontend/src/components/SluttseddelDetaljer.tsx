import React from 'react';
import type { SluttseddelResponseDto } from '../types/sluttseddel';
import styles from './SluttseddelDetaljer.module.css';

interface SluttseddelDetaljerProps {
    seddel: SluttseddelResponseDto;
}

const formatCurrency = (value: number) => new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK' }).format(value);
const formatNumber = (value: number) => new Intl.NumberFormat('nb-NO').format(value);

const SluttseddelDetaljer: React.FC<SluttseddelDetaljerProps> = ({ seddel }) => {
    return (
        <div className={styles.detaljerContainer}>
            <div className={styles.infoGrid}>
                <div>
                    <h4>Selger</h4>
                    <p>{seddel.selgerNavn}</p>
                </div>
                <div>
                    <h4>Kjøper</h4>
                    <p>{seddel.kjoperNavn}</p>
                </div>
                <div>
                    <h4>Fartøy</h4>
                    <p>{seddel.fartoyNavn}</p>
                </div>
            </div>
            <h4>Fangstdetaljer</h4>
            <table className={styles.linjeTabell}>
                <thead>
                    <tr>
                        <th>Fiskeslag</th>
                        <th className={styles.alignRight}>Kvantum</th>
                        <th className={styles.alignRight}>Pris per kg</th>
                        <th className={styles.alignRight}>Totalverdi</th>
                    </tr>
                </thead>
                <tbody>
                    {seddel.linjer.map(linje => (
                        <tr key={linje.id}>
                            <td>{linje.fiskeslag}</td>
                            <td className={styles.alignRight}>{formatNumber(linje.faktiskKvantum)} kg</td>
                            <td className={styles.alignRight}>{formatCurrency(linje.avtaltPrisPerKg)}</td>
                            <td className={styles.alignRight}>{formatCurrency(linje.totalVerdi)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={3}>Total Sum</td>
                        <td className={styles.alignRight}>{formatCurrency(seddel.totalVerdi)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default SluttseddelDetaljer;