import './App.css'
import HomePage from './components/HomePage/HomePage'
import NavBar from './components/NavBar/NavBar'
import TemplatePage from './components/TemplatePage/TemplatePage'
import GamePage from './components/GamePage/GamePage'
import ProfilePage from './components/ProfilePage/DesktopProfilePage'
/**  TODO: set loggin*/
import { BrowserRouter, Routes, Route } from 'react-router-dom'


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <header className="App-header">
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/nav1" element={<TemplatePage />} />
            <Route path="/game_page" element={<GamePage />} />
            <Route path="/profilePage" element={<ProfilePage />} />
            <Route path="/login" element={<GamePage />} /> {/**  TODO: set loggin: GamePage -> xxxPage*/}
            <Route path="/logout" element={<GamePage />} /> {/**  TODO: set loggin*/}
          </Routes>
        </header>
      </BrowserRouter>
    </div>
  )
}

export default App
