import './App.css';
import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage/HomePage';
import NavBar from './components/NavBar/NavBar';
import TemplatePage from './components/TemplatePage/TemplatePage';
import GamePlayPage from './components/GamePlayPage/GamePlayPage';
import ProfilePage from './components/ProfilePage/DesktopProfilePage';
import GameIndexPage from './components/GameIndexPage/GameIndexPage';
import GameRoomPage from './components/GameRoomPage/GameRoomPage';
import LoginPage from './components/LoginPage/LoginPage'; // Import LoginPage
import LogoutPage from './components/LogoutPage/LogoutPage'; // Import LogoutPage
import GameResultPage from './components/GameResultPage/GameResultPage'
/**  TODO: set loggin*/
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { auth } from './firebase-config'; // Make sure this path is correct

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login state

  const handleLoginLogout = () => {
    setIsLoggedIn(!isLoggedIn); // Toggle login/logout state
  };

  useEffect(() => {
    // Firebase listens to the authentication state
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();  // Cleanup subscription
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar isLoggedIn={isLoggedIn} handleLoginLogout={handleLoginLogout} />
        <header className="App-header">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"></link>

          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/nav1" element={<TemplatePage />} />
            <Route path="/game_page" element={<GamePlayPage />} />
            <Route path="/users/:uid" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage isLoggedIn={isLoggedIn} handleLoginLogout={handleLoginLogout} />} />
            <Route path="/logout" element={<LogoutPage isLoggedIn={isLoggedIn} handleLoginLogout={handleLoginLogout} />} />
            <Route path="/game" element={<GameIndexPage />} />
            <Route path="/game/:roomId" element={<GameRoomPage />} />
            <Route path="/game/:roomId/play" element={<GamePlayPage />} />
            <Route path="/game/:roomId/results" element={<GameResultPage />} />
          </Routes>
        </header>
      </BrowserRouter>
    </div>
  )
}

export default App;
