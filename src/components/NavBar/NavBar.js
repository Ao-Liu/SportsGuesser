import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import { Link } from 'react-router-dom'
import { TouchBarBtn } from './styles'

const Navbar = () => {
  return (
    <AppBar elevation={0} position="static" color="inherit">
      <Toolbar>
        <TouchBarBtn component={Link} to="/" variant="text" size="large" color="primary">
          Home
        </TouchBarBtn>
        <TouchBarBtn component={Link} to="/login" variant="text" size="large" color="primary">
          login
        </TouchBarBtn>
        <TouchBarBtn component={Link} to="/logout" variant="text" size="large" color="primary">
          logout
        </TouchBarBtn>
        <TouchBarBtn component={Link} to="/nav3" variant="text" size="large" color="primary">
          nav3
        </TouchBarBtn>
        <TouchBarBtn component={Link} to="/nav4" variant="text" size="large" color="primary">
          nav4
        </TouchBarBtn>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
