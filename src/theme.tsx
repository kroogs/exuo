import React from 'react'
import {
  createMuiTheme,
  ThemeProvider as MuiThemeProvider,
} from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import CssBaseline from '@material-ui/core/CssBaseline'

// '#9ce12e', // green
// '#a378fe', // purple
// '#34c3ff' // blue
// rgb(220, 0, 78) // pink?

export const palette = {
  primary: {
    main: '#34c3ff',
  },
}

export const typography = {
  fontFamily:
    '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
}

export const ThemeProvider: React.FunctionComponent = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const theme = React.useMemo(
    () =>
      createMuiTheme({
        typography,
        palette: {
          ...palette,
          type: prefersDarkMode ? 'dark' : 'light',
          background: {
            default: prefersDarkMode ? '#000000' : '#ffffff',
          },
        },
        props: {
          MuiButtonBase: {
            disableRipple: true,
          },
        },
      }),
    [prefersDarkMode],
  )

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  )
}
