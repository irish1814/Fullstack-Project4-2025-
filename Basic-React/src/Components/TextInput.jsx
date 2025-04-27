import React, { useRef, useEffect } from 'react';
import styles from './TextInput.module.css';

function TextInput({ id, onFocus, value, onChange }) {
    const inputRef = useRef(null);

    useEffect(() => {
        // Set initial focus on first render if id is 0
        if (id === 0 && inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    // Handle focus events
    const handleFocus = () => {
        onFocus(id, inputRef);
    };

    // Handle text changes
    const handleChange = (e) => {
        onChange(id, e.target.value);
    };

    return (
        <div className={styles.inputContainer}>
            <p className={styles.inputTitle}>Text Area {id + 1}</p>
            <textarea
                ref={inputRef}
                className={styles.textarea}
                value={value}
                onChange={handleChange}
                onFocus={handleFocus}
                onClick={handleFocus}
                placeholder='Type something or use the keyboard below...'
            />
        </div>
    );
}

export default TextInput;