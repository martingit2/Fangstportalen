import React from 'react';
import { useInView } from 'react-intersection-observer';
import styles from './FadeIn.module.css';

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
}

const FadeIn: React.FC<FadeInProps> = ({ children, className }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const combinedClassName = `${styles.fadeInSection} ${inView ? styles.isVisible : ''} ${className || ''}`;

  return (
    <div ref={ref} className={combinedClassName}>
      {children}
    </div>
  );
};

export default FadeIn;