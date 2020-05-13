import React from 'react'

// '#9ce12e', // green
// '#a378fe', // purple
// '#34c3ff' // blue
// rgb(220, 0, 78) // pink?

export const palette = {
  primary: {
    main: '#34c3ff',
  },
  background: {
    default: '#000000',
  },
  text: {
    primary: '#ffffff',
  },
}

export const typography = {
  fontFamily:
    '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
}

export default {
  palette,
  typography,
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
  },
}
