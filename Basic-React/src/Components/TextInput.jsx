import React from 'react';
import styles from './TextInput.module.css';

function TextInput({ id, onFocus, value, onChange }) {
    return (
        <div className={styles.inputContainer}>
            <p>{id} {value}</p>
            <textarea className={styles.textarea} placeholder='Type Something...'></textarea>
        </div>
    );
};

export default TextInput;