import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Link } from 'react-router-dom';
import { TouchBarBtn } from './styles';

import { auth } from '../LogoutPage/firebase-config.js'; // Make sure this path is correct

const Navbar = ({ isLoggedIn, handleLoginLogout }) => {
  
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const getProfilePageUrl = () => {
    const loginUserId = currentUser ? currentUser.uid : null;
    if (loginUserId) {
      return `/users/${loginUserId}`;
    } else {
      // if user is not login, prompt login
      return '/login';
    }
  };
    
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
        <TouchBarBtn component={Link} to={getProfilePageUrl()} variant="text" size="large" color="primary" sx={{ 
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
