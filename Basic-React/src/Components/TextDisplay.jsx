import React from 'react';

function TextDisplay({ text, fontSize, fontFamily, color }) {
    return (
        <div className="border p-4 rounded shadow bg-white" style={{ fontSize: `${fontSize}px`, fontFamily, color }}>
            { text || 'Enter Text...'}
        </div>
    );
}

export default TextDisplay;