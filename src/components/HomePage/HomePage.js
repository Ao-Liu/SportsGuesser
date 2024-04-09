import React from 'react'
import { Typography } from '@mui/material'

const HomePage = () => {
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
    </div>
  )
}

export default HomePage
