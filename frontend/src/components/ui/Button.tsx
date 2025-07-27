import React from 'react';
import styles from './Button.module.css';
import { useNavigate } from 'react-router-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    to?: string;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', to, children, onClick, ...props }) => {
    const navigate = useNavigate();
    const className = `${styles.button} ${styles[variant]}`;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (to) {
            navigate(to);
        } else if (onClick) {
            onClick(event);
        }
    };

    return (
        <button className={className} onClick={handleClick} {...props}>
            {children}
        </button>
    );
};

export default Button;