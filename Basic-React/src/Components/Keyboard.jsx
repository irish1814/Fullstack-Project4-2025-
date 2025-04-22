// components/Keyboard.jsx
import React from 'react';
import styles from './Keyboard.module.css';

export function Keyboard({ onKeyPress }) {
    const keys = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
        ['Space', 'Backspace']
    ];

    const handleClick = (key) => {
    onKeyPress(key === 'Space' ? ' ' : key === 'Backspace' ? '⌫' : key);
    };

    return (
    <div className={styles.keyboard}>
        {keys.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
            {row.map((key) => (
            <button
                key={key}
                className={styles.key}
                onClick={() => handleClick(key)}
            >
                {key}
            </button>
            ))}
        </div>
        ))}
    </div>
    );
}
