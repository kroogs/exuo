import React from 'react'
import {
  createMuiTheme,
  ThemeProvider as MUIThemeProvider,
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
        palette: {
          ...palette,
          type: prefersDarkMode ? 'dark' : 'light',
        },
        typography,
        props: {
          MuiButtonBase: {
            disableRipple: true,
          },
        },
      }),
    [prefersDarkMode],
  )

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  )
}
