import React, { useState } from 'react';
import styles from './AccordionItem.module.css';
import { FaChevronDown } from 'react-icons/fa';

interface AccordionItemProps {
    title: string;
    children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={styles.accordionItem}>
            <button className={styles.header} onClick={toggleOpen} aria-expanded={isOpen}>
                <span className={styles.title}>{title}</span>
                <span className={`${styles.icon} ${isOpen ? styles.open : ''}`}>
                    <FaChevronDown />
                </span>
            </button>
            <div className={`${styles.content} ${isOpen ? styles.open : ''}`}>
                <div className={styles.contentInner}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AccordionItem;