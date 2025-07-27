import { useInView } from 'react-intersection-observer';
import styles from './FadeIn.module.css';

interface FadeInProps {
  children: React.ReactNode;
}

const FadeIn: React.FC<FadeInProps> = ({ children }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref} className={`${styles.fadeInSection} ${inView ? styles.isVisible : ''}`}>
      {children}
    </div>
  );
};

export default FadeIn;