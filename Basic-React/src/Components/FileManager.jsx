import React, { useState } from 'react';
import styles from './TextFileManager.module.css';

export function TextFileManager({ text, setText }) {
    const [filename, setFilename] = useState('');
    const [files, setFiles] = useState(
        Object.keys(localStorage)
            .filter((key) => key.startsWith('file_'))
            .map((key) => key.replace('file_', ''))
    );

    const refreshFiles = () => {
        const keys = Object.keys(localStorage).filter((key) => key.startsWith('file_'));
        setFiles(keys.map((key) => key.replace('file_', '')));
    };

    const handleSave = () => {
        if (!filename) return alert('Save as...');
        localStorage.setItem(`file_${filename}`, text);
        refreshFiles();
        alert(`File saved as: "${filename}"`);
    };

    const handleOpen = (name = filename) => {
        if (!name) return alert('Save as...');
        const loadedText = localStorage.getItem(`file_${name}`);
        if (loadedText === null) {
            alert('File not found!');
        } else {
            setText(loadedText);
            setFilename(name);
        }
    };

    const handleDelete = (name) => {
        const confirmDelete = window.confirm(`Delete file "${name}"?`);
        if (confirmDelete) {
            localStorage.removeItem(`file_${name}`);
            refreshFiles();
        }
    };

    return (
        <>
            <div className={styles.manager}>
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        placeholder="Search for a file..."
                        value={filename}
                        onChange={(e) => setFilename(e.target.value)}
                        className={styles.input}
                    />
                    <button onClick={handleSave} className="p-1 bg-blue-500 text-white rounded">
                        Save
                    </button>
                    <button onClick={handleOpen} className="p-1 bg-green-500 text-white rounded">
                        Open
                    </button>
                </div>
            </div>

            <div className={styles.fileList}>
                {files.map((file) => (
                    <div key={file} className={styles.fileItem}>
                        <span className={styles.fileName} onClick={() => handleOpen(file)}>{file}</span>
                        <button className={styles.deleteButton} onClick={() => handleDelete(file)}>Delete</button>
                    </div>
                ))}
            </div>
        </>
    );
}
