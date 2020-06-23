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
          primary: { main: '#f94d94' },
          type: prefersDarkMode ? 'dark' : 'light',
          background: {
            default: prefersDarkMode ? '#000000' : '#ffffff',
          },
        },

        shape: {
          borderRadius: 3,
        },

        props: {
          MuiButtonBase: {
            disableRipple: true,
          },
        },

        overrides: {
          MuiCssBaseline: {
            '@global': {
              html: {
                userSelect: 'none',
                overscrollBehavior: 'none',
                maxWidth: '600px',
                margin: 'auto',
              },
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
