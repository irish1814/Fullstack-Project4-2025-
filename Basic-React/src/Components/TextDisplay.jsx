import React, { useState } from 'react';
import TextInput from './TextInput';
import Keyboard from './Keyboard';
import styles from './TextDisplay.module.css';

function TextDisplay() {
    const [texts, setTexts] = useState(['', '', '', '']);
    const [activeInput, setActiveInput] = useState({ id: null, ref: null });

    const handleFocus = (id, ref) => {
        setActiveInput({ id, ref });
    };

    const handleTextChange = (id, newText) => {
        const updated = [...texts];
        updated[id] = newText;
        setTexts(updated);
    };

    const handleKeyPress = (char) => {
        const { id, ref } = activeInput;
        if (ref?.current) {
            const input = ref.current;
            const start = input.selectionStart;
            const end = input.selectionEnd;
            const before = texts[id].substring(0, start);
            const after = texts[id].substring(end);
            const updatedText = before + char + after;

            handleTextChange(id, updatedText);

            // Manually update the cursor position after setState
            setTimeout(() => {
                input.focus();
                input.selectionStart = input.selectionEnd = start + char.length;
            }, 0);
        }
    };

    return (
        <main className={styles.main}>
            <div className={styles.grid}>
                {[0, 1, 2, 3].map((i) => (
                    <TextInput key={i} id={i} value={texts[i]} onChange={handleTextChange} onFocus={handleFocus} />
                ))}
            </div>
            <Keyboard onKeyPress={handleKeyPress} />
        </main>
    );
}

export default TextDisplay;
