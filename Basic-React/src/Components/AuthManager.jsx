import { useState } from 'react';
import styles from './AuthManager.module.css';
import { setCookie } from './Cookies.js';

function AuthManager({ onLogin }) {
    const [mode, setMode] = useState('login'); // login, signup, reset
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [notification, setNotification] = useState({ message: '', type: '', isOpen: false });

    const showNotification = (message, type) => {
        setNotification({ message, type, isOpen: true });
        setTimeout(() => {
            setNotification({ message, type: '', isOpen: false });
        }, 3000);
    };

    const handleSignup = () => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const existingUser = users.find(u => u.email === email);

        if (existingUser) {
            showNotification('Email already registered.', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showNotification('Passwords do not match.', 'error');
            return;
        }

        users.push({ email, password });
        localStorage.setItem('users', JSON.stringify(users));
        showNotification('Registration successful! Please login.', 'success');
        setMode('login');
    };

    const handleLogin = () => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            showNotification(`Welcome back!`, 'success');
            setCookie('userEmail', user.email, 1);
            onLogin(email);
        } else {
            showNotification('Invalid credentials.', 'error');
        }
    };

    const handleReset = () => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email);

        if (!user) {
            showNotification('Email not found.', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showNotification('Passwords do not match.', 'error');
            return;
        }

        const updatedUsers = users.map(u => 
            u.email === email ? { ...u, password } : u
        );
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        showNotification('Password reset successful! Please login.', 'success');
        setMode('login');
    };

    return (
        <div className={styles.form}>
            <h2 className={styles.title}>
                {mode === 'login' ? 'Login' : mode === 'signup' ? 'Sign Up' : 'Reset Password'}
            </h2>

            <div className={styles.flex}>
                <label>
                    <input
                        className={styles.input}
                        type="email"
                        placeholder=" "
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <span>Email</span>
                </label>

                <label>
                    <input
                        className={styles.input}
                        type="password"
                        placeholder=" "
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <span>Password</span>
                </label>

                {(mode === 'signup' || mode === 'reset') && (
                    <label>
                        <input
                            className={styles.input}
                            type="password"
                            placeholder=" "
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                        />
                        <span>Confirm Password</span>
                    </label>
                )}
            </div>

            {mode === 'login' && <button className={styles.submit} onClick={handleLogin}>Login</button>}
            {mode === 'signup' && <button className={styles.submit} onClick={handleSignup}>Sign Up</button>}
            {mode === 'reset' && <button className={styles.submit} onClick={handleReset}>Reset Password</button>}

            <div className={styles.signin}>
                {mode !== 'login' && (
                    <p className={styles.message}>
                        <a href="#" onClick={() => setMode('login')}>Back to Login</a>
                    </p>
                )}
                {mode === 'login' && (
                    <>
                        <p className={styles.message}>
                            Don't have an account? <a href="#" onClick={() => setMode('signup')}>Sign Up</a>
                        </p>
                        <p className={styles.message}>
                            Forgot password? <a href="#" onClick={() => setMode('reset')}>Reset</a>
                        </p>
                    </>
                )}
            </div>

            {notification.message && (
                <div className={`notification ${notification.type} ${notification.isOpen ? 'open' : 'close'}`}>
                    {notification.message}
                </div>
            )}
        </div>
    );
}

export default AuthManager;
