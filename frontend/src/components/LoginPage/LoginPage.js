import React, { useEffect } from 'react';
import { Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth, GoogleAuthProvider, signInWithPopup, signOut } from './firebase-config'; // Make sure this path is correct

// Import the Google icon image
import googleIcon from './giphy.gif';

const BACKEND_ENDPOINT = "http://localhost:3001";

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
      const result = await signInWithPopup(auth, provider)

      // TODO: Handle, 
      // check if login user not in User model database
      // that is, not yeat exist a User object,
      // create a User object based on the login Oauth.
      
      .then((result) => {
        // The signed-in user info
        const user = result.user;
  
        // Send the ID token directly to backend
        user.getIdToken().then((idToken) => {
          sendUserDataToServer(user, idToken);
        });
      })
      .catch((error) => {
        console.error(error);
      });
      

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


// Function to send user data and ID token to the server
const sendUserDataToServer = (user, idToken) => {
  const userInfo = {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    // numGamesCompleted: 0,
    // numGamesWon: 0,
    // conqueredCourNameUrl: [
    //     { name: 'Staples Center Lakers', url: 'https://c8.alamy.com/comp/AR6H8X/nba-la-lakers-staple-center-los-angeles-california-usa-AR6H8X.jpg' },
    //     { name: 'Pittsburgh Penguins Hockey', url: 'https://www.discovertheburgh.com/wp-content/uploads/2018/04/20180411_200128-600px.jpg' },
    // ],
  };
  const url = BACKEND_ENDPOINT + '/users/create';
  // console.log("url url url" , url)
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
    body: JSON.stringify(userInfo)
  })
  .then(response => response.json())
  .then(data => console.log('User data saved:', data))
  .catch(error => console.error('Failed to save user data:', error));
};

export default LoginPage;
