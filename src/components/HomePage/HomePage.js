import React from 'react'
import { Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'; // useNavigate to link to other page


const HomePage = () => {
  const navigate = useNavigate(); // initialize

  const typoStyle = {
    color: '#424242',
    fontFamily: 'Monospace',
    fontWeight: 700
  }

  const descriptionStyle = {
    color: '#424242',
    fontFamily: 'Monospace',
    paddingLeft: 120,
    paddingRight: 120
  }

  return (
    <div>
      <Typography style={typoStyle} variant="h2">
        Title
      </Typography>
      <br />
      <Typography style={descriptionStyle} variant="h4">
        Sint enim nulla est eiusmod. Reprehenderit reprehenderit reprehenderit sunt irure aliqua non deserunt cupidatat ea tempor. Dolore occaecat minim exercitation exercitation duis pariatur anim ut
        duis. Aliquip sit ipsum proident irure.
      </Typography>
      <br />
      <br />
      <button onClick={() => navigate('/index')}>Go to Index Page</button> {/* add button to index page */}
      <br />
    </div>
  )
}

export default HomePage
