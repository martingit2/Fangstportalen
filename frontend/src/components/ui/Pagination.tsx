import React from 'react';
import styles from './Pagination.module.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface PaginationProps {
    currentPage: number; 
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) {
        return null;
    }

    return (
        <nav className={styles.pagination}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className={styles.button}
                aria-label="Forrige side"
            >
                <FaChevronLeft />
            </button>
            <span className={styles.pageInfo}>
                Side {currentPage + 1} av {totalPages}
            </span>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className={styles.button}
                aria-label="Neste side"
            >
                <FaChevronRight />
            </button>
        </nav>
    );
};

export default Pagination;