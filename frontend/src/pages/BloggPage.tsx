import React from 'react';
import { Link } from 'react-router-dom';
import GenericInfoPage from '../components/info/GenericInfoPage';
import PageHeader from '../components/info/PageHeader';
import styles from './BloggPage.module.css';
import { artikler } from '../data/bloggData';

const BloggPage: React.FC = () => {
    return (
        <GenericInfoPage>
            <PageHeader
                title="Innsikt fra Fangstportalen"
                subtitle="Tanker om teknologi, design og fremtiden for sjømatnæringen."
            />
            <div className={styles.pageWrapper}>
                <div className={styles.articleGrid}>
                    {artikler.map(artikkel => (
                        <Link to={`/blogg/${artikkel.slug}`} key={artikkel.slug} className={styles.articleCard}>
                            <div className={styles.cardImageContainer}>
                                <img src={artikkel.image} alt={artikkel.altText} className={styles.cardImage} />
                            </div>
                            <div className={styles.cardContent}>
                                <h2 className={styles.cardTitle}>{artikkel.title}</h2>
                                <p className={styles.cardIngress}>{artikkel.ingress}</p>
                                <div className={styles.cardMeta}>
                                    <span>{artikkel.author}</span>
                                    <span>{artikkel.publicationDate}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </GenericInfoPage>
    );
};

export default BloggPage;