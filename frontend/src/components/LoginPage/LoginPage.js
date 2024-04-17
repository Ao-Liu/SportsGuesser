import React, { useEffect } from 'react';
import { Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth, GoogleAuthProvider, signInWithPopup, signOut } from './firebase-config'; // Make sure this path is correct

// Import the Google icon image
import googleIcon from './giphy.gif';

const LoginPage = ({ isLoggedIn, handleLoginLogout }) => {
  const navigate = useNavigate();
  const typoStyle = {
    color: '#4169E1',
    fontFamily: '"Baloo 2", cursive',
    fontWeight: 'bold',
    fontSize: '80px',
    margin: '20px 0'
  };

  const buttonStyle = {
    fontSize: '35px',
    padding: '20px 40px',
    borderRadius: '20px', // Adjust the value to control the amount of rounding
    display: 'flex', // Add display flex to align icon and text horizontally
    alignItems: 'center', // Align items center to center vertically
  };

  // Function to handle signing in with Google
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('Authentication successful, redirecting...');
      handleLoginLogout();
      navigate('/'); // Redirect to the index page upon successful login
    } catch (error) {
      console.error('Error during Google sign-in:', error);
      alert('Login failed, please try again.');
    }
  };

  // Effect to check the user's auth status
  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
        console.log('User is logged in:', user);
        // navigate('/'); // Ensure redirect to index if already logged in
      } else {
        console.log('No user is logged in.');
      }
    });
  }, [navigate]);

  return (
    <div style={{ padding: 20 }}>
      {/* Insert the Google icon image */}
      <img src={googleIcon} alt="Google Icon" style={{ width: '300px', marginRight: '10px' }} />
      <Typography style={typoStyle} variant="h4">Login with Google!</Typography>
      <Button variant="contained" color="primary" onClick={signInWithGoogle} style={{ ...buttonStyle, marginTop: 50, marginLeft: 100 }}>
        Sign In with Google
      </Button>
    </div>
  );
};

export default LoginPage;
