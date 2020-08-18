/*
 * Copyright © 2020 Ty Dira <ty@dira.dev>

 * This file is part of Exuo.

 * Exuo is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * Exuo is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.

 * You should have received a copy of the GNU Affero General Public License
 * along with Exuo.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from 'react'
import {
  createMuiTheme,
  ThemeProvider as MuiThemeProvider,
} from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import CssBaseline from '@material-ui/core/CssBaseline'

export const useDarkMode = (): ReturnType<typeof useMediaQuery> =>
  useMediaQuery('(prefers-color-scheme: dark)')

export const ThemeProvider: React.FunctionComponent = ({ children }) => {
  const prefersDarkMode = useDarkMode()
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
              ? 'rgba(255, 255, 255, .8)'
              : 'rgba(0, 0, 0, .8)',
            secondary: prefersDarkMode
              ? 'rgba(255, 255, 255, .42)'
              : 'rgba(0, 0, 0, .42)',
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
