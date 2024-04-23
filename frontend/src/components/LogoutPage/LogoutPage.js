import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button } from '@mui/material';
import { auth } from './firebase-config'; // Ensure this path correctly points to your Firebase config file

// Import the GIF image
import logoutGif from './icons8-logout.gif';

const LogoutPage = ({ isLoggedIn, handleLoginLogout }) => {
  const navigate = useNavigate();
  const typoStyle = {
    color: '#4169E1',
    fontFamily: '"Baloo 2", cursive',
    fontWeight: 'bold',
    fontSize: '80px',
    margin: '20px 0',
    textAlign: 'center', // Center align text
    marginTop: '20px' // Add some margin at the top
  };

  const buttonStyle = {
    fontSize: '35px',
    padding: '20px 40px',
    borderRadius: '20px', // Adjust the value to control the amount of rounding
    marginTop: '20px' // Add some margin at the top
  };

  // Function to handle logging out
  const handleLogout = () => {
    auth.signOut().then(() => {
      console.log('Logout successful');
      handleLoginLogout();
      navigate('/login'); // Redirect to the login page after logout
    }).catch((error) => {
      console.error('Logout failed:', error);
      alert('Logout failed, please try again.'); // Display an alert if logout fails
    });
  };

  return (
    <div style={{ padding: 20 }}>
      {/* Insert the GIF image */}
      <img src={logoutGif} alt="Logout GIF" style={{ width: '125px', marginBottom: '20px' }} />
      <Typography style={typoStyle} variant="h4">
        Ready to leave?
      </Typography>
      <Button variant="contained" color="primary" onClick={handleLogout} style={buttonStyle}>
        Logout
      </Button>
    </div>
  );
};



export default LogoutPage;
