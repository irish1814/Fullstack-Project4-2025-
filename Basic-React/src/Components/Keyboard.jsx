import React from 'react';
import styles from './Keyboard.module.css';

function SimpleKeyboard() {
    const keys = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'],
        ['Space', 'Backspace', '😀', '😂', '😍']
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

export default SimpleKeyboard;
