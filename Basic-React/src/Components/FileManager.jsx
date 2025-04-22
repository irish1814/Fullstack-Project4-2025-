// components/TextFileManager.jsx
import React, { useState, useEffect } from 'react';
import styles from './TextFileManager.module.css';

export function TextFileManager({ text, setText }) {
    const [filename, setFilename] = useState('');
    const [files, setFiles] = useState([]);

    useEffect(() => { loadFiles(); }, []);

    const loadFiles = () => {
        const keys = Object.keys(localStorage).filter((key) => key.startsWith('file_'));
        setFiles(keys.map((key) => key.replace('file_', '')));
    };

    const handleSave = () => {
        if (!filename) return alert('Save as...');
        localStorage.setItem(`file_${filename}`, text);
        loadFiles();
        alert(`File saved as: "${filename}"`);
    };

    const handleOpen = (name = filename) => {
        if (!name)
            return alert('Save as...');
        
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
            loadFiles();
        }
    };

    return (
        <>
        <div className={styles.manager}>
            <div className={styles.inputGroup}>
                <input type="text" placeholder="Search for a file..." value={filename} onChange={(e) => setFilename(e.target.value)} className={styles.input}/>
                <button onClick={() => handleSave()} className="p-1 bg-blue-500 text-white rounded">
                    Save
                </button>
                <button onClick={() => handleOpen()} className="p-1 bg-green-500 text-white rounded">
                    Open
                </button>
            </div>

            <div className={`${styles.button} ${styles.saveButton}`}>
                <strong>Saved Files</strong>
                {files.length === 0 ? (
                    <p className="text-gray-500">No Saved files</p>
                ) : (
                    <ul className="list-disc pl-5">
                    {files.map((file) => (
                        <li key={file} className="flex justify-between items-center">
                        <span
                            className="cursor-pointer text-blue-600 hover:underline"
                            onClick={() => handleOpen(file)}
                        >
                            {file}
                        </span>
                        <button
                            onClick={() => handleDelete(file)}
                            className="text-red-500 hover:text-red-700 text-sm"
                        >
                            מחק
                        </button>
                        </li>
                    ))}
                    </ul>
                )}
            </div>
            
        </div>
        
        <div className={styles.fileList}>
            {files.map(file => (
                <div key={file} className={styles.fileItem}>
                    <span className={styles.fileName} onClick={() => handleOpen(file)}>{file}</span>
                    <button className={styles.deleteButton} onClick={() => handleDelete(file)}>מחק</button>
                </div>
            ))}
        </div>
        </>
    );
}
