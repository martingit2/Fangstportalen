import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.css';
import { FaTimes } from 'react-icons/fa';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEsc);
        }

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return ReactDOM.createPortal(
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <header className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    <button className={styles.closeButton} onClick={onClose} aria-label="Lukk modal">
                        <FaTimes />
                    </button>
                </header>
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;