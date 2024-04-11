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
        <TouchBarBtn component={Link} to="/nav1" variant="text" size="large" color="primary">
          nav1
        </TouchBarBtn>
        <TouchBarBtn component={Link} to="/nav2" variant="text" size="large" color="primary">
          nav2
        </TouchBarBtn>
        <TouchBarBtn component={Link} to="/nav3" variant="text" size="large" color="primary">
          nav3
        </TouchBarBtn>
        <TouchBarBtn component={Link} to="/nav4" variant="text" size="large" color="primary">
          nav4
        </TouchBarBtn>
        <TouchBarBtn component={Link} to="/a-page" variant="text" size="large" color="secondary">
          aaaaa
        </TouchBarBtn>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
