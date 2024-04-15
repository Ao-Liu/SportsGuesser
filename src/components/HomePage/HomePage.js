import exampleImage from './GEO.jpg'; // Import image
import React, { useState, useEffect, useRef } from 'react';
import { Typography, Paper, Box, Grow, Divider } from '@mui/material'; // 引入 Divider 组件
import { styled } from '@mui/material/styles';
import ExploreIcon from '@mui/icons-material/Explore'; 
import PlaceIcon from '@mui/icons-material/Place'; 
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'; 
import ScoreIcon from '@mui/icons-material/Score'; 
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'; 

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(8),
  margin: theme.spacing(2),
  backgroundColor: theme.palette.grey[50],
}));

const IndexPage = () => {
  const ref = useRef();

  const renderItemText = (icon, text) => {
    const [pre, post] = text.split(':');
    return (
      <li>
        {icon}
        <span style={{ fontSize: '26px', color: 'darkBlue', fontWeight: 'bold' }}>{pre}:</span>
        <br />
        <span style={{ fontSize: '20px', color: '#4682B4' }}>{post}</span>
      </li>
    );
  };

  return (
    <Box sx={{ padding: '0 100px', maxWidth: 1800, margin: 'auto' }}>
      <Grow in={true} style={{ transformOrigin: '0 0 0' }} timeout={1000}>
        <StyledPaper elevation={3}>
          <Typography variant="h4" align="center" sx={{
            color: '#4169E1',
            fontFamily: '"Baloo 2", cursive',
            fontWeight: 'bold',
            fontSize: '70px',
            margin: '20px 0'
          }}>
            Welcome to <span style={{ color: '#1E90FF' }}>GeoGym Guess Quest</span> !
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <img src={exampleImage} alt="Example Scene" style={{ maxWidth: '80%', height: 'auto', borderRadius: '8px' }} />
          </Box>
          <Typography variant="h4" align="center" sx={{
            color: '#7B68EE',
            fontFamily: '"Baloo 2", cursive',
            fontWeight: 'bold',
            fontSize: '30px',
            margin: '20px 0'
          }}>
            Discover the thrill of exploration and test your geographical skills with "GeoGym Guess Quest"! Dive into an adventurous world where fitness meets fun in our exciting location-based game. Each round, you're dropped into a virtual Google Maps Street View at a random gym or sports venue. Can you figure out where you are?
          </Typography>
          <Typography variant="h4" align="center" sx={{
            color: '#7B68EE',
            fontFamily: '"Baloo 2", cursive',
            fontWeight: 'bold',
            fontSize: '30px',
            margin: '20px 0'
          }}>
            Your challenge is to explore your surroundings, pick up clues from the environment, and make your guess on the world map. The closer your guess is to the actual location, the higher your score!
          </Typography>
          {/* 灰色分隔条 */}
          <Divider sx={{ my: 16, bgcolor: 'lightgrey' }} /> 
          <Typography variant="h4" align="center" sx={{
            color: 'darkBlue',
            fontFamily: '"Baloo 2", cursive',
            fontWeight: 'bold',
            fontSize: '70px',
            margin: '20px 0'
          }}>
            Game Rules
          </Typography>
          <Typography variant="body1" align="left" sx={{
            fontFamily: '"Baloo 2", cursive',
            lineHeight: '1.8'
          }}>
            <ul ref={ref} style={{ listStyleType: 'none', padding: 0 }}>
              {renderItemText(<PlaceIcon />, "Placement: Players are placed in a random location using Google Maps Street View, but only at locations near gyms or fitness centers.")}
              {renderItemText(<ExploreIcon />, "Exploration: Players can explore their surroundings by navigating in Street View mode. Focus on identifying gyms or fitness centers.")}
              {renderItemText(<HelpOutlineIcon />, "Guessing: After exploring, place a marker on a world map provided by GeoGuessr. The goal is to accurately guess the gym's location.")}
              {renderItemText(<ScoreIcon />, "Scoring: Points are awarded based on the accuracy of the guess. The closer the guess to the gym, the more points earned.")}
              {renderItemText(<SportsEsportsIcon />, "Challenge Modes: Offers various single-player and multiplayer modes, focusing on gym locations.")}
            </ul>
          </Typography>
        </StyledPaper>
      </Grow>
    </Box>
  );
};

export default IndexPage;
