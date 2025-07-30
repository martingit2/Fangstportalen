import React, { useEffect } from 'react';
import styles from './Lightbox.module.css';
import { FaTimes } from 'react-icons/fa';

interface LightboxProps {
    src: string;
    alt: string;
    onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ src, alt, onClose }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [onClose]);

    return (
        <div className={styles.overlay} onClick={onClose}>
            <button className={styles.closeButton} onClick={onClose} aria-label="Lukk bildevisning">
                <FaTimes />
            </button>
            <div className={styles.content} onClick={(e) => e.stopPropagation()}>
                <img src={src} alt={alt} className={styles.image} />
            </div>
        </div>
    );
};

export default Lightbox;