import React, { useState } from 'react';
import styles from './FeaturesSection.module.css';
import FadeIn from './FadeIn';
import Lightbox from './ui/Lightbox';
import { FaExternalLinkAlt } from 'react-icons/fa';

interface Feature {
    title: string;
    tagline: string;
    description: string;
    points: string[];
    imageSrc: string;
    altText: string;
}

interface FeaturesSectionProps {
    features: Feature[];
    title?: string;
    subtitle?: string;
    headerText?: string;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ features, title, subtitle, headerText }) => {
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    return (
        <>
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
                        <FadeIn key={index}>
                            <div className={styles.featureItem}>
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
                                <div className={styles.featureImageContainer} onClick={() => setLightboxImage(feature.imageSrc)}>
                                    <img src={feature.imageSrc} alt={feature.altText} className={styles.featureImage} />
                                    <div className={styles.imageOverlay}>
                                        <FaExternalLinkAlt />
                                        <span>Forstørr bilde</span>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                    </div>
                </div>
            </section>
            {lightboxImage && (
                <Lightbox 
                    src={lightboxImage} 
                    alt="Forstørret skjermbilde" 
                    onClose={() => setLightboxImage(null)} 
                />
            )}
        </>
    );
};

export default FeaturesSection;