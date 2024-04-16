import './App.css'
import HomePage from './components/HomePage/HomePage'
import NavBar from './components/NavBar/NavBar'
import TemplatePage from './components/TemplatePage/TemplatePage'
import LoginPage from './components/LoginPage/LoginPage'
import LogoutPage from './components/LogoutPage/LogoutPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <header className="App-header">
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route path="/nav3" element={<TemplatePage />} />
            <Route path="/nav4" element={<TemplatePage />} />
          </Routes>
        </header>
      </BrowserRouter>
    </div>
  )
}

export default App
