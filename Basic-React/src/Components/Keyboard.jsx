import React, { useState } from 'react';
import styles from './Keyboard.module.css'

const tabs = ['Character', 'Style', 'Scope', 'Special', 'Advanced'];

function Keyboard({ onKeyPress, onStyleChange, onAction }) {
    const [activeTab, setActiveTab] = useState('Character');
    const [language, setLanguage] = useState('ENG');

    const renderCharacterKeyboard = () => {
        const eng = [
            ['Q','W','E','R','T','Y','U','I','O','P'],
            ['A','S','D','F','G','H','J','K','L'],
            ['Z','X','C','V','B','N','M']
        ];
    
        const heb = [
            ['ק','ר','א','ט','ו','ן','ם','פ'],
            ['ש','ד','ג','כ','ע','י','ח','ל', 'ך', 'ף'],
            ['ז','ס','ב','ה','נ','מ','צ','ת','ץ']
        ];
    
        const emojis = [
            ['😀','😂','😍','🤔','👍'],
            ['💡','🎉','🔥','💻','📚']
        ];
    
        const chars = language === 'ENG' ? eng : language === 'HEB' ? heb : emojis;
    
        return (
            <>
                {chars.map((row, rowIndex) => (
                    <div key={rowIndex} className={styles.keyRow}>
                        {row.map((char, i) => (
                            <button key={i} onClick={() => onKeyPress(char)}>
                                {char}
                            </button>
                        ))}
                    </div>
                ))}
                <div className={styles.keyRow}>
                    <button onClick={() => setLanguage('ENG')}>ENG</button>
                    <button onClick={() => setLanguage('HEB')}>HEB</button>
                    <button onClick={() => setLanguage('EMOJI')}>EMOJI</button>
                </div>
            </>
        );
    };

    const renderStyleKeyboard = () => (
        <div className={styles.keyRow}>
            <button onClick={() => onStyleChange('font', 'Arial')}>Arial</button>
            <button onClick={() => onStyleChange('font', 'Courier New')}>Courier</button>
            <button onClick={() => onStyleChange('size', '12px')}>Small</button>
            <button onClick={() => onStyleChange('size', '24px')}>Large</button>
            <input type="color" onChange={(e) => onStyleChange('color', e.target.value)} />
        </div>
    );

    const renderScopeKeyboard = () => (
        <div className={styles.keyRow}>
            <button onClick={() => onStyleChange('scope', 'selection')}>To Selection</button>
            <button onClick={() => onStyleChange('scope', 'all')}>All Text</button>
        </div>
    );

    const renderSpecialKeyboard = () => (
        <div className={styles.keyRow}>
            <button onClick={() => onAction('deleteChar')}>Del Char</button>
            <button onClick={() => onAction('deleteWord')}>Del Word</button>
            <button onClick={() => onAction('clearAll')}>Clear All</button>
        </div>
    );

    const renderAdvancedKeyboard = () => (
        <div className={styles.keyRow}>
            <button onClick={() => onAction('search')}>Search</button>
            <button onClick={() => onAction('replace')}>Replace</button>
            <button onClick={() => onAction('undo')}>Undo</button>
            <button onClick={() => onAction('redo')}>Redo</button>
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
                    <button key={tab} className={activeTab === tab ? styles.activeTab : ''} onClick={() => setActiveTab(tab)}> {tab}
                    </button>
                ))}
            </div>
            <div className={styles.keyboardContent}>
                {renderTabContent()}
            </div>
        </div>
    );
}

export default Keyboard;