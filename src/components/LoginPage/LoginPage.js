import React, { useEffect } from 'react';
import { Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth, GoogleAuthProvider, signInWithPopup, signOut } from './firebase-config'; // Make sure this path is correct

const LoginPage = () => {
  const navigate = useNavigate();
  const typoStyle = {
    color: '#424242',
    fontFamily: 'Monospace',
    fontWeight: 700
  };

  // Function to handle signing in with Google
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('Authentication successful, redirecting...');
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
        navigate('/'); // Ensure redirect to index if already logged in
      } else {
        console.log('No user is logged in.');
      }
    });
  }, [navigate]);

  return (
    <div style={{ padding: 20 }}>
      <Typography style={typoStyle} variant="h4">Login with Google</Typography>
      <Button variant="contained" color="primary" onClick={signInWithGoogle} style={{ marginTop: 20 }}>
        Sign In with Google
      </Button>
    </div>
  );
};

export default LoginPage;
