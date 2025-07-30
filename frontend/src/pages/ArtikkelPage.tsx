import React from 'react';
import { useParams, Link } from 'react-router-dom';
import GenericInfoPage from '../components/info/GenericInfoPage';
import { getArtikkelBySlug } from '../data/bloggData';
import styles from './ArtikkelPage.module.css';
import { FaArrowLeft } from 'react-icons/fa';

const ArtikkelPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const artikkel = slug ? getArtikkelBySlug(slug) : null;

    if (!artikkel) {
        return (
            <GenericInfoPage>
                <div className={styles.notFound}>
                    <h2>Artikkel ikke funnet</h2>
                    <p>Beklager, vi fant ikke artikkelen du lette etter.</p>
                    <Link to="/blogg" className={styles.backLink}><FaArrowLeft /> Tilbake til bloggen</Link>
                </div>
            </GenericInfoPage>
        );
    }

    return (
        <GenericInfoPage>
            <div className={styles.articleWrapper}>
                <header className={styles.header}>
                    <Link to="/blogg" className={styles.backLink}><FaArrowLeft /> Tilbake til bloggen</Link>
                    <h1 className={styles.title}>{artikkel.title}</h1>
                    <div className={styles.meta}>
                        <span>Av {artikkel.author}</span>
                        <span>Publisert {artikkel.publicationDate}</span>
                    </div>
                </header>
                <div className={styles.imageContainer}>
                    <img src={artikkel.image} alt={artikkel.altText} />
                </div>
                <div 
                    className={styles.content}
                    dangerouslySetInnerHTML={{ __html: artikkel.content }}
                />
            </div>
        </GenericInfoPage>
    );
};

export default ArtikkelPage;