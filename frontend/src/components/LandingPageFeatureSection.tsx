import React from 'react';
import styles from './LandingPageFeatureSection.module.css';
import FadeIn from './FadeIn';

interface Feature {
    title: string;
    tagline: string;
    description: string;
    points: string[];
    imageSrc: string;
    altText: string;
}

interface LandingPageFeatureSectionProps {
    features: Feature[];
    headerText?: string;
    title?: string;
    subtitle?: string;
}

const LandingPageFeatureSection: React.FC<LandingPageFeatureSectionProps> = ({ features, headerText, title, subtitle }) => {
  return (
    <section className={styles.features}>
      {(title || subtitle || headerText) && (
        <div className={styles.wrapper}>
            <div className={styles.sectionHeader}>
                <div className={styles.container}>
                    {headerText && <span>{headerText}</span>}
                    {title && <h2>{title}</h2>}
                    {subtitle && <p>{subtitle}</p>}
                </div>
            </div>
        </div>
      )}

      <div className={styles.featureListContainer}>
        <div className={styles.container}>
          {features.map((feature, index) => (
            <FadeIn key={index} className={styles.featureItem}>
                <div className={styles.featureText}>
                    <h3>{feature.title}</h3>
                    <p className={styles.tagline}>{feature.tagline}</p>
                    <p>{feature.description}</p>
                    <ul>
                        {feature.points.map((point, i) => (
                            <li key={i}>{point}</li>
                        ))}
                    </ul>
                </div>
                <div className={styles.featureImageContainer}>
                    <img src={feature.imageSrc} alt={feature.altText} className={styles.featureImage} />
                </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingPageFeatureSection;