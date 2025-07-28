import React from 'react';
import styles from './StatTable.module.css';

interface StatTableProps {
    title: string;
    data: Record<string, string | number>;
    valueFormatter: (value: number) => string;
    unit?: string;
}

const StatTable: React.FC<StatTableProps> = ({ title, data, valueFormatter, unit }) => {
    const sortedData = Object.entries(data).sort(([, a], [, b]) => (b as number) - (a as number));

    return (
        <div className={styles.tableCard}>
            <h2 className={styles.title}>{title}</h2>
            <table className={styles.table}>
                <tbody>
                    {sortedData.map(([key, value]) => (
                        <tr key={key}>
                            <td>{key}</td>
                            <td className={styles.alignRight}>
                                {valueFormatter(value as number)} {unit}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StatTable;