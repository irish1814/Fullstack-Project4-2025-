import React, { useState, useEffect, useRef } from 'react';
import TextInput from './TextInput';
import Keyboard from './Keyboard';
import styles from './TextDisplay.module.css';

function TextDisplay({ userEmail }) {
    const [texts, setTexts] = useState(['']);
    const [activeInput, setActiveInput] = useState({ id: 0, ref: null });
    const [filename, setFilename] = useState('');
    const [files, setFiles] = useState([]);
    const [textHistory, setTextHistory] = useState([['']]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [draggedItem, setDraggedItem] = useState(null);
    const [showDropZone, setShowDropZone] = useState(false);
    const fileUploadRef = useRef(null);

    // User file management
    const userFilePrefix = `file_${userEmail}_`;

    // Load user files on component mount
    useEffect(() => {
        refreshFiles();
    }, [userEmail]);

    // Handle active text input on mount
    useEffect(() => {
        if (texts.length > 0) {
            handleFocus(0, null);
        }
    }, []);

    // Refresh the list of files
    const refreshFiles = () => {
        if (!userEmail) return;

        const keys = Object.keys(localStorage)
            .filter((key) => key.startsWith(userFilePrefix));

        const sortedFiles = keys
            .map((key) => key.replace(userFilePrefix, ''))
            .sort((a, b) => a.localeCompare(b));

        setFiles(sortedFiles);
    };

    // Handle input focus
    const handleFocus = (id, ref) => {
        setActiveInput({ id, ref });
    };

    // Handle text changes with undo/redo history
    const handleTextChange = (id, newText) => {
        if (id !== activeInput.id) {
            setActiveInput({ ...activeInput, id });
        }

        const newTexts = [...texts];
        newTexts[id] = newText;
        setTexts(newTexts);

        // Add to history if it's a new change (not from undo/redo)
        if (historyIndex === textHistory.length - 1) {
            // Limit history to 30 steps to prevent excessive memory usage
            const newHistory = [...textHistory.slice(-29), newTexts];
            setTextHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
        } else {
            // If we're in the middle of history (after undo), replace forward history
            const newHistory = [...textHistory.slice(0, historyIndex + 1), newTexts];
            setTextHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
        }
    };

    // Handle keyboard input
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

            // Maintain focus and cursor position after update
            setTimeout(() => {
                input.focus();
                input.selectionStart = input.selectionEnd = start + char.length;
            }, 0);
        } else if (id !== null) {
            // If no ref but we have an id, just append to the end
            handleTextChange(id, (texts[id] || '') + char);
        }
    };

    // Handle style changes
    const handleStyleChange = (property, value) => {
        if (activeInput.ref?.current) {
            const element = activeInput.ref.current;

            switch(property) {
                case 'font':
                    element.style.fontFamily = value;
                    break;
                case 'size':
                    element.style.fontSize = value;
                    break;
                case 'color':
                    element.style.color = value;
                    break;
                default:
                    break;
            }
        }
    };

    // Handle special actions
    const handleAction = (action) => {
        const { id, ref } = activeInput;
        if (!ref?.current && action !== 'undo' && action !== 'redo') return;

        switch (action) {
            case 'deleteChar':
                if (ref.current) {
                    const input = ref.current;
                    const start = input.selectionStart;
                    const end = input.selectionEnd;
                    const currentText = texts[id];

                    if (start === end && start > 0) {
                        // Delete one character before cursor
                        const updatedText = currentText.substring(0, start - 1) + currentText.substring(end);
                        handleTextChange(id, updatedText);

                        setTimeout(() => {
                            input.focus();
                            input.selectionStart = input.selectionEnd = start - 1;
                        }, 0);
                    } else if (start !== end) {
                        // Delete selection
                        const updatedText = currentText.substring(0, start) + currentText.substring(end);
                        handleTextChange(id, updatedText);

                        setTimeout(() => {
                            input.focus();
                            input.selectionStart = input.selectionEnd = start;
                        }, 0);
                    }
                }
                break;

            case 'deleteWord':
                if (ref.current) {
                    const input = ref.current;
                    const start = input.selectionStart;
                    const end = input.selectionEnd;
                    const currentText = texts[id];

                    if (start === end) {
                        // Find the start of the current/previous word
                        let wordStart = start;
                        while (wordStart > 0 && currentText[wordStart - 1] !== ' ') {
                            wordStart--;
                        }

                        const updatedText = currentText.substring(0, wordStart) + currentText.substring(end);
                        handleTextChange(id, updatedText);

                        setTimeout(() => {
                            input.focus();
                            input.selectionStart = input.selectionEnd = wordStart;
                        }, 0);
                    } else {
                        // Delete selection
                        const updatedText = currentText.substring(0, start) + currentText.substring(end);
                        handleTextChange(id, updatedText);

                        setTimeout(() => {
                            input.focus();
                            input.selectionStart = input.selectionEnd = start;
                        }, 0);
                    }
                }
                break;

            case 'clearAll':
                handleTextChange(id, '');
                break;

            case 'undo':
                if (historyIndex > 0) {
                    setHistoryIndex(historyIndex - 1);
                    setTexts(textHistory[historyIndex - 1]);
                }
                break;

            case 'redo':
                if (historyIndex < textHistory.length - 1) {
                    setHistoryIndex(historyIndex + 1);
                    setTexts(textHistory[historyIndex + 1]);
                }
                break;

            default:
                break;
        }
    };

    // File saving/loading
    const handleSave = () => {
        if (!filename) {
            showNotification('Please enter a filename', 'error');
            return;
        }

        if (texts.every(text => !text.trim())) {
            showNotification('No text to save', 'error');
            return;
        }

        // Save multiple texts as JSON if there are multiple, otherwise save as string
        const textToSave = texts.length > 1 ? JSON.stringify(texts) : texts[0];
        localStorage.setItem(`${userFilePrefix}${filename}`, textToSave);
        refreshFiles();
        showNotification(`Saved as "${filename}"`, 'success');
    };

    const handleOpen = (name = filename) => {
        if (!name) {
            showNotification('Please enter a filename', 'error');
            return;
        }

        const loadedText = localStorage.getItem(`${userFilePrefix}${name}`);

        if (loadedText === null) {
            showNotification('File not found!', 'error');
            return;
        }

        try {
            // Try to parse as JSON for multiple texts
            const parsedData = JSON.parse(loadedText);
            if (Array.isArray(parsedData)) {
                setTexts(parsedData);
                // Reset history with the loaded texts
                setTextHistory([parsedData]);
                setHistoryIndex(0);
            } else {
                // Single text stored as object
                setTexts([loadedText]);
                setTextHistory([[loadedText]]);
                setHistoryIndex(0);
            }
        } catch (e) {
            // Not JSON, just a single text string
            setTexts([loadedText]);
            setTextHistory([[loadedText]]);
            setHistoryIndex(0);
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
            }
            showNotification(`Deleted "${name}"`, 'info');
        }
    };

    // Add/Remove text areas
    const addTextInput = () => {
        const newTexts = [...texts, ''];
        setTexts(newTexts);

        // Add to history
        const newHistory = [...textHistory.slice(0, historyIndex + 1), newTexts];
        setTextHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const removeTextInput = (index) => {
        if (texts.length > 1) {
            const newTexts = texts.filter((_, i) => i !== index);
            setTexts(newTexts);

            // Add to history
            const newHistory = [...textHistory.slice(0, historyIndex + 1), newTexts];
            setTextHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);

            // Update active input if necessary
            if (activeInput.id === index) {
                const newActiveId = Math.min(index, newTexts.length - 1);
                setActiveInput({ id: newActiveId, ref: null });
            } else if (activeInput.id > index) {
                // Adjust active input index since we removed an item before it
                setActiveInput(prev => ({ ...prev, id: prev.id - 1 }));
            }
        }
    };

    // Notifications
    const showNotification = (message, type = 'info') => {
        const notification = document.createElement('div');
        notification.className = `${styles.notification} ${styles[type]}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add(styles.visible);
        }, 10);

        setTimeout(() => {
            notification.classList.remove(styles.visible);
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    };

    // Drag and drop functionality for files
    const handleDragStart = (e, index, fileName) => {
        setDraggedItem({ index, fileName });
        e.dataTransfer.effectAllowed = 'move';
        e.target.classList.add(styles.dragging);
    };

    const handleDragEnd = (e) => {
        e.target.classList.remove(styles.dragging);
        setDraggedItem(null);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        if (draggedItem === null || draggedItem.index === index) return;

        const newFiles = [...files];
        const draggedItemName = newFiles[draggedItem.index];
        newFiles.splice(draggedItem.index, 1);
        newFiles.splice(index, 0, draggedItemName);

        setFiles(newFiles);
        setDraggedItem({ ...draggedItem, index });
    };

    // File uploading
    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;

            // Use the file name without extension as the save name
            const fileName = file.name.replace(/\.[^/.]+$/, "");
            setFilename(fileName);
            setTexts([content]);

            // Reset history
            setTextHistory([[content]]);
            setHistoryIndex(0);

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
                setTexts([content]);

                // Reset history
                setTextHistory([[content]]);
                setHistoryIndex(0);

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
        <div className={styles.appLayout}>
            <div className={styles.fileSection}>
                <h3 className={styles.sectionTitle}>File Manager</h3>
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
                                        title="Delete file"
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className={styles.editorSection}>
                <div className={styles.buttonGroup}>
                    <button className={styles.addButton} onClick={addTextInput}>
                        Add Text Area
                    </button>
                </div>

                <div className={styles.textsContainer}>
                    {texts.map((text, i) => (
                        <div key={i} className={styles.textAreaWrapper}>
                            <TextInput
                                id={i}
                                value={text}
                                onChange={handleTextChange}
                                onFocus={handleFocus}
                            />
                            {texts.length > 1 && (
                                <button
                                    className={styles.removeButton}
                                    onClick={() => removeTextInput(i)}
                                    title="Remove this text area"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.keyboardSection}>
                <Keyboard
                    onKeyPress={handleKeyPress}
                    onStyleChange={handleStyleChange}
                    onAction={handleAction}
                />
            </div>
        </div>
    );
}

export default TextDisplay;