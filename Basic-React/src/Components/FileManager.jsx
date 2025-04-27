import React, { useState, useEffect, useRef } from 'react';
import styles from './TextFileManager.module.css';
import TextDisplay from './TextDisplay';

export function TextFileManager({ userEmail }) {
    const [filename, setFilename] = useState('');
    const [files, setFiles] = useState([]);
    const [activeText, setActiveText] = useState('');
    const [activeTextId, setActiveTextId] = useState(0);
    const [activeTextRef, setActiveTextRef] = useState(null);
    const [multipleTexts, setMultipleTexts] = useState([]);
    const [draggedItem, setDraggedItem] = useState(null);
    const [showDropZone, setShowDropZone] = useState(false);
    const fileUploadRef = useRef(null);

    // Load user-specific files on component mount and when user changes
    useEffect(() => {
        refreshFiles();
    }, [userEmail]);

    const userFilePrefix = `file_${userEmail}_`;

    const refreshFiles = () => {
        if (!userEmail) return;

        const keys = Object.keys(localStorage)
            .filter((key) => key.startsWith(userFilePrefix));

        // Sort files alphabetically
        const sortedFiles = keys
            .map((key) => key.replace(userFilePrefix, ''))
            .sort((a, b) => a.localeCompare(b));

        setFiles(sortedFiles);
    };

    const handleSave = () => {
        if (!filename) {
            alert('Please enter a filename');
            return;
        }

        if (!activeText && !multipleTexts.length) {
            alert('No text to save');
            return;
        }

        // Save the active text or multiple texts
        const textToSave = multipleTexts.length ? JSON.stringify(multipleTexts) : activeText;
        localStorage.setItem(`${userFilePrefix}${filename}`, textToSave);
        refreshFiles();
        showNotification(`Saved as "${filename}"`, 'success');
    };

    const handleOpen = (name = filename) => {
        if (!name) {
            alert('Please enter a filename');
            return;
        }

        const loadedText = localStorage.getItem(`${userFilePrefix}${name}`);

        if (loadedText === null) {
            showNotification('File not found!', 'error');
            return;
        }

        try {
            // Try to parse as JSON (for multiple texts)
            const parsedData = JSON.parse(loadedText);
            if (Array.isArray(parsedData)) {
                setMultipleTexts(parsedData);
                // Update active text to the first one
                setActiveText(parsedData[0] || '');
            } else {
                // Single text stored as an object
                setActiveText(loadedText);
                setMultipleTexts([]);
            }
        } catch (e) {
            // Not JSON, just a single text string
            setActiveText(loadedText);
            setMultipleTexts([]);
        }

        setFilename(name);
        showNotification(`Opened "${name}"`, 'success');
    };

    const handleDelete = (name) => {
        const confirmDelete = window.confirm(`Delete file "${name}"?`);
        if (confirmDelete) {
            localStorage.removeItem(`${userFilePrefix}${name}`);
            refreshFiles();

            if (name === filename) {
                setFilename('');
                setActiveText('');
            }
            showNotification(`Deleted "${name}"`, 'info');
        }
    };

    const showNotification = (message, type = 'info') => {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `${styles.notification} ${styles[type]}`;
        notification.textContent = message;

        // Add to document
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.add(styles.visible);
        }, 10);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove(styles.visible);
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    };

    const handleTextChange = (id, newText) => {
        setActiveText(newText);
        setActiveTextId(id);
    };

    const handleTextFocus = (id, ref) => {
        setActiveTextId(id);
        setActiveTextRef(ref);
    };

    // Drag and drop functionality for files
    const handleDragStart = (e, index, fileName) => {
        setDraggedItem({ index, fileName });
        e.dataTransfer.effectAllowed = 'move';
        // Add styling to indicate dragging
        e.target.classList.add(styles.dragging);
    };

    const handleDragEnd = (e) => {
        e.target.classList.remove(styles.dragging);
        setDraggedItem(null);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        // Return if we're not dragging anything or the item is the same as the one we're dragging over
        if (draggedItem === null || draggedItem.index === index) return;

        // Reorder files in the UI
        const newFiles = [...files];
        const draggedItemName = newFiles[draggedItem.index];
        newFiles.splice(draggedItem.index, 1);
        newFiles.splice(index, 0, draggedItemName);

        setFiles(newFiles);
        setDraggedItem({ ...draggedItem, index });
    };

    // File uploading
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;

            // Use the file name without extension as the save name
            const fileName = file.name.replace(/\.[^/.]+$/, "");
            setFilename(fileName);
            setActiveText(content);

            // Auto save
            setTimeout(() => {
                localStorage.setItem(`${userFilePrefix}${fileName}`, content);
                refreshFiles();
                showNotification(`Imported "${fileName}"`, 'success');
            }, 100);
        };

        reader.readAsText(file);
    };

    // Handle file drop zone
    const handleDragEnterDropZone = (e) => {
        e.preventDefault();
        setShowDropZone(true);
    };

    const handleDragLeaveDropZone = (e) => {
        e.preventDefault();
        setShowDropZone(false);
    };

    const handleDropFile = (e) => {
        e.preventDefault();
        setShowDropZone(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            const reader = new FileReader();

            reader.onload = (event) => {
                const content = event.target.result;
                const fileName = file.name.replace(/\.[^/.]+$/, "");
                setFilename(fileName);
                setActiveText(content);

                // Auto save
                setTimeout(() => {
                    localStorage.setItem(`${userFilePrefix}${fileName}`, content);
                    refreshFiles();
                    showNotification(`Imported "${fileName}"`, 'success');
                }, 100);
            };

            reader.readAsText(file);
        }
    };

    return (
        <>
            <div className={styles.manager}>
                <h3 className={styles.title}>My Files</h3>
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        placeholder="Filename..."
                        value={filename}
                        onChange={(e) => setFilename(e.target.value)}
                        className={styles.input}
                    />
                    <div className={styles.buttonContainer}>
                        <button
                            onClick={handleSave}
                            className={`${styles.button} ${styles.saveButton}`}
                        >
                            Save
                        </button>
                        <button
                            onClick={() => handleOpen()}
                            className={`${styles.button} ${styles.openButton}`}
                        >
                            Open
                        </button>
                    </div>
                </div>

                <div
                    className={`${styles.dropZone} ${showDropZone ? styles.active : ''}`}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={handleDragEnterDropZone}
                    onDragLeave={handleDragLeaveDropZone}
                    onDrop={handleDropFile}
                    onClick={() => fileUploadRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileUploadRef}
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                        accept=".txt,.md,.html,.js,.css,.json"
                    />
                    <div className={styles.dropZoneContent}>
                        <span className={styles.dropIcon}>📄</span>
                        <p>Drop file here or click to upload</p>
                    </div>
                </div>

                <div className={styles.fileListContainer}>
                    <h4 className={styles.subtitle}>
                        Saved Files
                        <span className={styles.fileCount}>({files.length})</span>
                    </h4>
                    {files.length === 0 ? (
                        <p className={styles.noFiles}>No files saved yet</p>
                    ) : (
                        <ul className={styles.fileList}>
                            {files.map((file, index) => (
                                <li
                                    key={file}
                                    className={styles.fileItem}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, index, file)}
                                    onDragEnd={handleDragEnd}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                >
                                    <div className={styles.fileItemContent}>
                                        <span className={styles.dragHandle}>⠿</span>
                                        <span
                                            onClick={() => handleOpen(file)}
                                            className={styles.fileName}
                                        >
                                            {file}
                                        </span>
                                    </div>
                                    <button
                                        className={styles.deleteButton}
                                        onClick={() => handleDelete(file)}
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <TextDisplay
                text={activeText}
                onTextChange={handleTextChange}
                onTextFocus={handleTextFocus}
                multipleTexts={multipleTexts}
            />
        </>
    );
}

export default TextFileManager;