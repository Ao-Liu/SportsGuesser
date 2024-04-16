import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button } from '@mui/material';
import { auth } from './firebase-config'; // Ensure this path correctly points to your Firebase config file

const LogoutPage = () => {
  const navigate = useNavigate();
  const typoStyle = {
    color: '#424242',
    fontFamily: 'Monospace',
    fontWeight: 700,
    textAlign: 'center', // Center align text
    marginTop: '20px' // Add some margin at the top
  };

  // Function to handle logging out
  const handleLogout = () => {
    auth.signOut().then(() => {
      console.log('Logout successful');
      navigate('/login'); // Redirect to the login page after logout
    }).catch((error) => {
      console.error('Logout failed:', error);
      alert('Logout failed, please try again.'); // Display an alert if logout fails
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography style={typoStyle} variant="h4">
        Ready to leave?
      </Typography>
      <Button variant="contained" color="primary" onClick={handleLogout} style={{ marginTop: 20 }}>
        Logout
      </Button>
    </div>
  );
};

export default LogoutPage;
