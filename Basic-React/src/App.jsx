import './App.css'
import TextDisplay from './Components/TextDisplay'
import AuthManager from './Components/AuthManager'
import { useState, useEffect } from 'react';
import { getCookie, deleteCookie } from './Components/Cookies.js';

function App() {
    const [userEmail, setUserEmail] = useState(null);

    // Load user from cookie on initial render
    useEffect(() => {
        const savedUser = getCookie('userEmail');
        if (savedUser) {
            setUserEmail(savedUser);
        }
    }, []);

    const handleLogin = (email) => {
        setUserEmail(email);
    };

    const handleLogout = () => {
        deleteCookie('userEmail');
        setUserEmail(null);
    };

    if (!userEmail) {
        return <AuthManager onLogin={handleLogin} />
    }

    return (
        <div className="app-container">
            <header className="app-header">
                <h2>Visual Text Editor</h2>
                <div className="user-section">
                    <span className="user-email">{userEmail}</span>
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                </div>
            </header>

            <main className="app-main">
                <TextDisplay userEmail={userEmail} />
            </main>

            <footer className="app-footer">
                <p>Full-Stack Web Development Project © {new Date().getFullYear()}</p>
            </footer>
        </div>
    );
}

export default App;