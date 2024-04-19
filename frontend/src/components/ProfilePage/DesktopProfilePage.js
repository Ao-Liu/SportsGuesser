// import React from 'react';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";

import { Typography, Avatar, Box } from '@mui/material';
// import './profilePage.css';

const BACKEND_ENDPOINT = "http://localhost:3001";

const textStyles = {
  color: '#424242',
  fontFamily: 'Monospace',
  fontWeight: 700
};

const DesktopProfilePage = () => {
  
  // ///////////////////////////////////// CSS /////////////////////////
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    textAlign: 'center'
  };

  const avatarStyle = {
    marginTop: '5vh'
  };

  const typoStyleIntro = {
    ...textStyles,
    margin: '0 auto 2vw auto',
    fontSize: '1.5vw'
  };

  const GamesRecord = {
    ...textStyles,
    marginTop: '1vw',
    fontSize: '2vw'
  };

  const hrStyle = {
    width: '100%',
    height: '0.5vw',
    backgroundColor: '#ccc',
    border: 'none',
    margin: '1vw 0 2vw 0'
  };

  const ConqueredCourtStyle = {
    ...textStyles,
    marginTop: '2vw',
    marginBottom: '0.5vw',
    fontSize: '2.5vw'
  }

  // ///////////////////////////////////// CSS /////////////////////////

  // /////////// fetch data from backend /////////////////////////////
  const { uid } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url =  BACKEND_ENDPOINT + `/users/${uid}`;  // Adjust this URL to match your API endpoint
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setUserInfo(data);  // Set the fetched data into state
        setLoading(false);  // Set loading to false once the data is received
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setError(err.message); 
        setLoading(false);
      });
  }, [uid]);  // The effect depends on userId and will re-run if userId changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!userInfo) return <div>No user data found</div>;
  // /////////// fetch backend Data /////////////////////////////

  return (
    <div style={containerStyle}>
      <Box textAlign="center" mb={2}>
        <Avatar alt={userInfo.userName} src={userInfo.photoURL} style={{ width: '15vw', height: '15vw', ...avatarStyle }} />
      </Box>
      <Typography style={{ ...textStyles, fontSize: '3vw' }} variant="h2">
        Welcome to {userInfo.displayName}'s Profile Page.
      </Typography>

      <Box width="100%" textAlign="center">
        <hr style={hrStyle} />
      </Box>

      <Typography style={typoStyleIntro} variant="h5">
        {userInfo.introduction}
      </Typography>

      <Typography style={GamesRecord} variant="h4">
        <i className="bi bi-trophy"></i> Winning Games: {userInfo.numGamesWon}
      </Typography>

      <Typography style={GamesRecord} variant="h4">
        <i className="bi bi-bookmark-check"></i> Completed Games: {userInfo.numGamesCompleted}
      </Typography>

      <Typography style={ConqueredCourtStyle} variant="h4">
        Conquered Courts
      </Typography>

      <Box display="flex" justifyContent="center">
        {userInfo.conqueredCourNameUrl.map((court, index) => (
          <div key={index} style={{ marginLeft: '1.5vw', marginRight: '1.5vw', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar alt={court.name} src={court.url} style={{ width: '15vw', height: '15vw', ...avatarStyle, marginTop: '2.5vw' }} />
            <Typography style={{ ...textStyles, fontSize: '1.5vw' }} variant="subtitle1">
              {court.name}
            </Typography>
          </div>
        ))}
      </Box>
    </div>
  );
};

export default DesktopProfilePage;


