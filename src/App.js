import './App.css'
import React, { useState } from 'react';
import HomePage from './components/HomePage/HomePage'
import NavBar from './components/NavBar/NavBar'
import TemplatePage from './components/TemplatePage/TemplatePage'
import GamePage from './components/GamePage/GamePage'
import ProfilePage from './components/ProfilePage/DesktopProfilePage'
import LoginPage from './components/LoginPage/LoginPage'
import LogoutPage from './components/LogoutPage/LogoutPage'
/**  TODO: set loggin*/
import { BrowserRouter, Routes, Route } from 'react-router-dom'


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  {/**  TODO: set if loggin*/}
  const handleLoginLogout = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar isLoggedIn={isLoggedIn} handleLoginLogout={handleLoginLogout} />
        <header className="App-header">
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/nav1" element={<TemplatePage />} />
            <Route path="/game_page" element={<GamePage />} />
            <Route path="/profilePage" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage isLoggedIn={isLoggedIn} handleLoginLogout={handleLoginLogout} />} /> {/**  TODO: set loggin: GamePage -> xxxPage*/}
            <Route path="/logout" element={<LogoutPage isLoggedIn={isLoggedIn} handleLoginLogout={handleLoginLogout} />} /> {/**  TODO: set loggin*/}
          </Routes>
        </header>
      </BrowserRouter>
    </div>
  )
}

export default App
