import './App.css'
import HomePage from './components/HomePage/HomePage'
import NavBar from './components/NavBar/NavBar'
import TemplatePage from './components/TemplatePage/TemplatePage'
import IndexPage from './components/IndexPage/IndexPage'
import GamePage from './components/GamePage/GamePage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <header className="App-header">
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/index" element={<IndexPage />} />
            <Route path="/nav1" element={<TemplatePage />} />
            <Route path="/nav2" element={<TemplatePage />} />
            <Route path="/nav3" element={<TemplatePage />} />
            <Route path="/nav4" element={<TemplatePage />} />
            <Route path="/game_page" element={<GamePage />} />
          </Routes>
        </header>
      </BrowserRouter>
    </div>
  )
}

export default App
