import React from 'react'
import {
  createMuiTheme,
  ThemeProvider as MuiThemeProvider,
} from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import CssBaseline from '@material-ui/core/CssBaseline'

export const ThemeProvider: React.FunctionComponent = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const theme = React.useMemo(
    () =>
      createMuiTheme({
        typography: {
          fontFamily: [
            '-apple-system',
            'system-ui',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
          ].join(', '),
        },

        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
          primary: { main: '#f94d94' },
          background: {
            default: prefersDarkMode ? '#000000' : '#ffffff',
          },
          text: {
            primary: prefersDarkMode
              ? 'rgba(255, 255, 255, .75)'
              : 'rgba(0, 0, 0, .75)',
          },
        },

        shape: {
          borderRadius: 6,
        },

        props: {
          /* MuiButtonBase: { */
          /*   disableRipple: true, */
          /* }, */
          MuiButton: {
            disableElevation: true,
          },
        },

        overrides: {
          MuiCssBaseline: {
            '@global': {
              html: {
                userSelect: 'none',
                overscrollBehavior: 'none',
                '-webkit-touch-callout': 'none',
                maxWidth: '600px',
                margin: 'auto',
                '&, & body': {
                  height: '100%',
                },
              },
              /* '#root': { */
              /*   height: '100%', */
              /*   backgroundImage: 'url(/background.jpg)', */
              /*   backgroundSize: 'cover', */
              /* }, */
            },
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
