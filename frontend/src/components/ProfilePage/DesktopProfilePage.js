import React from 'react';
import { Typography, Avatar, Box } from '@mui/material';

const textStyles = {
  color: '#424242',
  fontFamily: 'Monospace',
  fontWeight: 700
};

const DesktopProfilePage = () => {
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

  // Sample user data
  const userData = {
    userName: 'Scotty',
    winningGames: 20,
    completedGames: 50,
    introduction: "Hi, I'm Scotty. I love playing games and exploring new places.",
    favoriteCity: "New York",
    conqueredCourNameUrl: [
      { name: 'Staples Center Lakers', url: 'https://c8.alamy.com/comp/AR6H8X/nba-la-lakers-staple-center-los-angeles-california-usa-AR6H8X.jpg' },
      { name: 'Pittsburgh Penguins Hockey', url: 'https://www.discovertheburgh.com/wp-content/uploads/2018/04/20180411_200128-600px.jpg' },
    ],
    photoUrl: 'https://www.cmu.edu/brand/brand-guidelines/images/scottycrop2-600x600.png' // URL to the user's photo
  };

  return (
    <div style={containerStyle}>
      <Box textAlign="center" mb={2}>
        <Avatar alt={userData.userName} src={userData.photoUrl} style={{ width: '15vw', height: '15vw', ...avatarStyle }} />
      </Box>
      <Typography style={{ ...textStyles, fontSize: '3vw' }} variant="h2">
        Welcome to {userData.userName}'s Profile Page.
      </Typography>

      <Box width="100%" textAlign="center">
        <hr style={hrStyle} />
      </Box>

      <Typography style={typoStyleIntro} variant="h5">
        {userData.introduction}
      </Typography>

      <Typography style={GamesRecord} variant="h4">
        <i className="bi bi-trophy"></i> Winning Games: {userData.winningGames}
      </Typography>

      <Typography style={GamesRecord} variant="h4">
       <i className="bi bi-bookmark-check"></i> Completed Games: {userData.completedGames}
      </Typography>

      <Typography style={ConqueredCourtStyle} variant="h4">
       Conquered Courts
      </Typography>

      <Box display="flex" justifyContent="center">
        {userData.conqueredCourNameUrl.map((court, index) => (
          <div key={index} style={{  marginLeft: '1.5vw', marginRight: '1.5vw', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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


