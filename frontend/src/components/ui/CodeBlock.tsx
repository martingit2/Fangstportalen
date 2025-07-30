import React, { useState } from 'react';
import styles from './CodeBlock.module.css';
import { FaCopy, FaCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface CodeBlockProps {
    code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        toast.success("Kopiert til utklippstavlen!");
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className={styles.container}>
            <pre>
                <code>{code}</code>
            </pre>
            <button onClick={handleCopy} className={styles.copyButton} aria-label="Kopier kode">
                {isCopied ? <FaCheck /> : <FaCopy />}
            </button>
        </div>
    );
};

export default CodeBlock;