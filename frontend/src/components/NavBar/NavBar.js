import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Link } from 'react-router-dom';
import { TouchBarBtn } from './styles';

const Navbar = ({ isLoggedIn, handleLoginLogout }) => {
  return (
    <AppBar elevation={0} position="static" color="inherit" sx={{ fontFamily: '"Baloo 2", cursive' }}>
      <Toolbar>
        <TouchBarBtn component={Link} to="/" variant="text" size="large" color="primary" sx={{
          fontFamily: '"Baloo 2", cursive', 
          fontSize: '30px', 
          color: '#003366'
        }}>
          Home
        </TouchBarBtn>{/**  TODO: change profile page into game page*/}
        <TouchBarBtn component={Link} to="/profilePage" variant="text" size="large" color="primary" sx={{ 
          fontFamily: '"Baloo 2", cursive', 
          fontSize: '30px', 
          color: '#003366'
        }}>
          Profile
        </TouchBarBtn>
        <TouchBarBtn component={Link} to="/game" variant="text" size="large" color="primary" sx={{ 
          fontFamily: '"Baloo 2", cursive', 
          fontSize: '30px', 
          color: '#003366'
        }}>
          Game
        </TouchBarBtn>
        {isLoggedIn ? (
          <TouchBarBtn component={Link} to="/logout" variant="text" size="large" color="primary" sx={{
            fontFamily: '"Baloo 2", cursive',
            fontSize: '30px', 
            color: '#003366'
          }}>
            Log out
          </TouchBarBtn>
        ) : (
          <TouchBarBtn component={Link} to="/login" variant="text" size="large" color="primary" sx={{
            fontFamily: '"Baloo 2", cursive',
            fontSize: '30px', 
            color: '#003366'
          }}>
            Log in
          </TouchBarBtn>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
