import React from 'react';
import styles from './StatusBadge.module.css';

type Status = 'KLADD' | 'SIGNERT_AV_FISKER' | 'BEKREFTET_AV_MOTTAK' | 'AVVIST';

interface StatusBadgeProps {
    status: Status;
}

const statusMap: Record<Status, { text: string; className: string }> = {
    KLADD: { text: 'Kladd', className: styles.kladd },
    SIGNERT_AV_FISKER: { text: 'Signert av Fisker', className: styles.signert_av_fisker },
    BEKREFTET_AV_MOTTAK: { text: 'Bekreftet', className: styles.bekreftet_av_mottak },
    AVVIST: { text: 'Avvist', className: styles.avvist },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const statusInfo = statusMap[status] || statusMap.KLADD;
    
    return <span className={`${styles.badge} ${statusInfo.className}`}>{statusInfo.text}</span>;
};

export default StatusBadge;