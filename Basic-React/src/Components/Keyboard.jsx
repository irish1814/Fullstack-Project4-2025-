import React, { useState } from 'react';
import styles from './Keyboard.module.css';

const tabs = ['Character', 'Style', 'Scope', 'Special', 'Advanced'];

function Keyboard({ onKeyPress, onStyleChange, onAction }) {
    const [activeTab, setActiveTab] = useState('Character');
    const [language, setLanguage] = useState('ENG');
    const [capsLock, setCapsLock] = useState(false);

    const handleKeyClick = (char) => {
        // Apply caps lock if enabled and it's a letter
        if (capsLock && char.length === 1 && char.match(/[a-zA-Z]/)) {
            onKeyPress(char.toUpperCase());
        } else {
            onKeyPress(char);
        }
    };

    const toggleCapsLock = () => {
        setCapsLock(!capsLock);
    };

    const renderCharacterKeyboard = () => {
        // Define keyboard layouts for different languages
        const eng = [
            ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
            ['q','w','e','r','t','y','u','i','o','p'],
            ['a','s','d','f','g','h','j','k','l'],
            ['z','x','c','v','b','n','m'],
            [',', '.', '!', '?', ':', ';', "'", '"', '(', ')']
        ];

        const heb = [
            ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
            ['ק','ר','א','ט','ו','ן','ם','פ'],
            ['ש','ד','ג','כ','ע','י','ח','ל', 'ך', 'ף'],
            ['ז','ס','ב','ה','נ','מ','צ','ת','ץ'],
            [',', '.', '!', '?', ':', ';', "'", '"', '(', ')']
        ];

        const emojis = [
            ['😀','😂','😍','🤔','👍','👎','👏','🙏'],
            ['❤️','😊','🎉','🔥','💯','⭐','🌟','✨'],
            ['👋','🤝','👀','💪','🧠','💭','💬','🗯️'],
            ['🏆','🥇','🎯','⚡','💡','📚','💻','🎮']
        ];

        const chars = language === 'ENG' ? eng : language === 'HEB' ? heb : emojis;

        return (
            <div className={styles.keyboardContent}>
                {chars.map((row, rowIndex) => (
                    <div key={rowIndex} className={styles.keyRow}>
                        {row.map((char, i) => (
                            <button
                                key={i}
                                onClick={() => handleKeyClick(char)}
                                className={styles.key}
                            >
                                {/* Apply caps lock styling if enabled and it's a letter */}
                                {(capsLock && char.length === 1 && char.match(/[a-zA-Z]/))
                                    ? char.toUpperCase()
                                    : char}
                            </button>
                        ))}
                    </div>
                ))}

                <div className={styles.controlRow}>
                    <button
                        onClick={toggleCapsLock}
                        className={`${styles.controlKey} ${capsLock ? styles.activeKey : ''}`}
                    >
                        Caps Lock
                    </button>
                    <button
                        onClick={() => handleKeyClick(' ')}
                        className={styles.spaceKey}
                    >
                        Space
                    </button>
                    <button
                        onClick={() => onAction('deleteChar')}
                        className={styles.controlKey}
                    >
                        ⌫ Backspace
                    </button>
                </div>

                <div className={styles.languageRow}>
                    <button
                        onClick={() => setLanguage('ENG')}
                        className={`${styles.langKey} ${language === 'ENG' ? styles.activeKey : ''}`}
                    >
                        English
                    </button>
                    <button
                        onClick={() => setLanguage('HEB')}
                        className={`${styles.langKey} ${language === 'HEB' ? styles.activeKey : ''}`}
                    >
                        Hebrew
                    </button>
                    <button
                        onClick={() => setLanguage('EMOJI')}
                        className={`${styles.langKey} ${language === 'EMOJI' ? styles.activeKey : ''}`}
                    >
                        Emoji
                    </button>
                </div>
            </div>
        );
    };

    const renderStyleKeyboard = () => (
        <div className={styles.keyboardContent}>
            <div className={styles.styleSection}>
                <h4>Font</h4>
                <div className={styles.keyRow}>
                    <button onClick={() => onStyleChange('font', 'Arial')} className={styles.styleKey}>Arial</button>
                    <button onClick={() => onStyleChange('font', 'Times New Roman')} className={styles.styleKey}>Times New Roman</button>
                    <button onClick={() => onStyleChange('font', 'Courier New')} className={styles.styleKey}>Courier</button>
                    <button onClick={() => onStyleChange('font', 'Georgia')} className={styles.styleKey}>Georgia</button>
                </div>
            </div>

            <div className={styles.styleSection}>
                <h4>Size</h4>
                <div className={styles.keyRow}>
                    <button onClick={() => onStyleChange('size', '12px')} className={styles.styleKey}>Small</button>
                    <button onClick={() => onStyleChange('size', '16px')} className={styles.styleKey}>Medium</button>
                    <button onClick={() => onStyleChange('size', '20px')} className={styles.styleKey}>Large</button>
                    <button onClick={() => onStyleChange('size', '24px')} className={styles.styleKey}>X-Large</button>
                </div>
            </div>

            <div className={styles.styleSection}>
                <h4>Color</h4>
                <div className={styles.keyRow}>
                    <div className={styles.colorPicker}>
                        <input
                            type="color"
                            onChange={(e) => onStyleChange('color', e.target.value)}
                            className={styles.colorInput}
                        />
                    </div>
                    <button onClick={() => onStyleChange('color', 'black')} className={styles.colorKey}>Black</button>
                    <button onClick={() => onStyleChange('color', 'red')} className={styles.colorKey} style={{color: 'red'}}>Red</button>
                    <button onClick={() => onStyleChange('color', 'blue')} className={styles.colorKey} style={{color: 'blue'}}>Blue</button>
                    <button onClick={() => onStyleChange('color', 'green')} className={styles.colorKey} style={{color: 'green'}}>Green</button>
                </div>
            </div>
        </div>
    );

    const renderScopeKeyboard = () => (
        <div className={styles.keyboardContent}>
            <div className={styles.styleSection}>
                <h4>Apply Style To</h4>
                <div className={styles.keyRow}>
                    <button onClick={() => onStyleChange('scope', 'selection')} className={styles.scopeKey}>Selected Text</button>
                    <button onClick={() => onStyleChange('scope', 'all')} className={styles.scopeKey}>All Text</button>
                    <button onClick={() => onStyleChange('scope', 'fromCursor')} className={styles.scopeKey}>From Cursor</button>
                </div>
            </div>
        </div>
    );

    const renderSpecialKeyboard = () => (
        <div className={styles.keyboardContent}>
            <div className={styles.styleSection}>
                <h4>Delete Operations</h4>
                <div className={styles.keyRow}>
                    <button onClick={() => onAction('deleteChar')} className={styles.actionKey}>Delete Character</button>
                    <button onClick={() => onAction('deleteWord')} className={styles.actionKey}>Delete Word</button>
                    <button onClick={() => onAction('clearAll')} className={styles.actionKey}>Clear All</button>
                </div>
            </div>
        </div>
    );

    const renderAdvancedKeyboard = () => (
        <div className={styles.keyboardContent}>
            <div className={styles.styleSection}>
                <h4>Advanced Operations</h4>
                <div className={styles.keyRow}>
                    <button onClick={() => onAction('undo')} className={styles.advancedKey}>Undo</button>
                    <button onClick={() => onAction('redo')} className={styles.advancedKey}>Redo</button>
                </div>
            </div>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Character':
                return renderCharacterKeyboard();
            case 'Style':
                return renderStyleKeyboard();
            case 'Scope':
                return renderScopeKeyboard();
            case 'Special':
                return renderSpecialKeyboard();
            case 'Advanced':
                return renderAdvancedKeyboard();
            default:
                return null;
        }
    };

    return (
        <div className={styles.keyboardPanel}>
            <div className={styles.tabs}>
                {tabs.map(tab => (
                    <button
                        key={tab}
                        className={activeTab === tab ? styles.activeTab : styles.tab}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            {renderTabContent()}
        </div>
    );
}

export default Keyboard;