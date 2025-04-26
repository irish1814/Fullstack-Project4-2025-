import './App.css'
import Keyboard from './Components/Keyboard'
import { TextFileManager } from './Components/FileManager'
import TextDisplay from './Components/TextDisplay'
import AuthManager from './Components/AuthManager'
import { useState } from 'react';
import { getCookie, deleteCookie } from './Components/Cookies.js';

function App() {
  const [userEmail, setUserEmail] = useState(() => {
    return getCookie('userEmail') || null;
  });

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
    <>
      <header>
        <h2>Welcome Back {userEmail}</h2>
        <button onClick={handleLogout}> Logout </button>
      </header>

      <TextFileManager userEmail={userEmail} />
      <TextDisplay />
      <Keyboard />
    </>
  );
}

export default App;
