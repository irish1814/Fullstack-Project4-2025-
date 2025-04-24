import React from 'react';
import styles from './TextInput.module.css';

function TextInput() {
    return (
        <div className={styles.inputContainer}>
            <textarea className={styles.textarea}></textarea>
        </div>
    );
};

export default TextInput;