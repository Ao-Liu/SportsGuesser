import './App.css';
import React, { useState } from 'react';
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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login state

  const handleLoginLogout = () => {
    setIsLoggedIn(!isLoggedIn); // Toggle login/logout state
  };

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar isLoggedIn={isLoggedIn} handleLoginLogout={handleLoginLogout} />
        <header className="App-header">
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
