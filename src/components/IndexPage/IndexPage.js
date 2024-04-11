import React from 'react'
import { Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'; // useNavigate to link to other page
import exampleImage from './IMG_8758.JPG'; // 导入图片

const IndexPage = () => {
  const navigate = useNavigate(); // initialize


  return (
    <div style={{ padding: '0 100px', backgroundColor: '#FFFACD' } }> {/* space for the left and right side */}
      
      {/* Game Rule */}
      <Typography
        variant="h4"
        align="left"
        sx={{ 
          color: 'black',
          fontFamily: 'Monospace', 
          fontWeight: 700,
          fontSize: '60px', // word size
          marginBottom: '40px', // the distance to button
        }}
      >
        Game Rules:
      </Typography>
      {/* picture */}
      <img src={exampleImage} alt=" " style={{ maxWidth: '40%', height: 'auto' }} />
    

      {/* abcdefg, content*/}
      <Typography
        variant="body1"
        sx={{ 
          color: 'black',
          fontFamily: 'Monospace', 
          fontWeight: 700,
          fontSize: '40px', // word size
          textAlign: 'left', // make it to left
          marginBottom: '20px', // the distance to button
        }}
      >
        abcdefg<br />
        abcdefg<br />
        abcdefg<br />
        abcdefg<br />
        abcdefg<br />
        abcdefg<br />
        abcdefg<br />
        abcdefg<br />
        abcdefg<br />
        abcdefg<br />
      </Typography>
      <br />
      <Button
        onClick={() => navigate('/game_page')}
        variant="contained"
        color="primary"
        sx={{
          backgroundColor: '#ff5722', // Deep orange background
          color: 'white', // word color
          padding: '10px 20px',
          borderRadius: '20px', // round corner
          fontSize: '40px',
          margin: '15px 15px 15px 0',  // Add margin for spacing from the typography
          '&:hover': {
            backgroundColor: '#1565c0' // Darker orange on hover
          }
        }}
      >
        Game Page
      </Button>
      <Button
        onClick={() => navigate('/')} // Navigate back to Home Page
        variant="contained"
        color="primary"
        sx={{
          backgroundColor: '#ff5722', // Deep orange background
          color: 'white', // word color
          padding: '10px 20px',
          borderRadius: '20px', // round corner
          fontSize: '40px',
          margin: '15px 0',  // Add margin for spacing from the typography
          '&:hover': {
            backgroundColor: '#1565c0' // Darker orange on hover
          }
        }}
      >
        Home Page
      </Button>
    </div>
  );
};

export default IndexPage
