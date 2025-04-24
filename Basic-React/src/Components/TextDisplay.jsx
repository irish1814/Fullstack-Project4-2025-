import React from 'react';
import TextInput from './TextInput';
import styles from './TetxDisplay.module.css'

function TextDisplay() {
    return (
        <main className={styles.grid}>
            <TextInput/ >
            <TextInput/ >
            <TextInput/ >
            <TextInput/ >
        </main>
    );
}

export default TextDisplay;