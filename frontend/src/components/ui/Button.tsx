import React from 'react';
import styles from './Button.module.css';
import { Link } from 'react-router-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    to?: string;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', to, children, ...props }) => {
    const className = `${styles.button} ${styles[variant]}`;

    if (to) {
        return (
            <Link to={to} className={className}>
                {children}
            </Link>
        );
    }

    return (
        <button className={className} {...props}>
            {children}
        </button>
    );
};

export default Button;