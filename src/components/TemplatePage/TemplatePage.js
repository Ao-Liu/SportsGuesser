import React from 'react'
import { Typography } from '@mui/material'

const TemplatePage = () => {
  const typoStyle = {
    color: '#424242',
    fontFamily: 'Monospace',
    fontWeight: 700
  }

  return (
    <div>
      <Typography style={typoStyle} variant="h2">
        Minim ea commodo commodo nulla.
      </Typography>
    </div>
  )
}

export default TemplatePage
