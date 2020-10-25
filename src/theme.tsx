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
  // https://github.com/mui-org/material-ui/issues/13394
  // TODO Remove when Material UI v5 is out.
  unstable_createMuiStrictModeTheme as createMuiTheme,
  ThemeProvider as MuiThemeProvider,
  fade,
} from '@material-ui/core/styles'
import { useMediaQuery, CssBaseline, PaletteType } from '@material-ui/core'

export const useDarkMode = (): ReturnType<typeof useMediaQuery> =>
  useMediaQuery('(prefers-color-scheme: dark)')

export const ThemeProvider: React.FunctionComponent = ({ children }) => {
  const prefersDarkMode = useDarkMode()

  const theme: ReturnType<typeof createMuiTheme> = React.useMemo(() => {
    const palette = {
      type: (prefersDarkMode ? 'dark' : 'light') as PaletteType,

      primary: { main: '#FF2EA2' },
      secondary: { main: '#FF8F00' },

      divider: prefersDarkMode ? '#222222' : '#e0e0e0',

      background: {
        default: prefersDarkMode ? '#000000' : '#ffffff',
        paper: prefersDarkMode ? '#141414' : '#fbfbfb',
      },

      text: {
        primary: prefersDarkMode ? '#dddddd' : '#212121',
        secondary: prefersDarkMode ? '#aaaaaa' : '#595959',
      },
    }

    if (process.env.NODE_ENV === 'development') {
      palette.primary.main = '#718C00'
      palette.secondary.main = '#fd971f'
    }

    return createMuiTheme({
      palette,

      // TODO use responsiveFontSizes
      typography: {
        fontSize: 16,

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

      shape: {
        borderRadius: 6,
      },

      props: {
        MuiButton: {
          disableElevation: true,
        },

        MuiButtonGroup: {
          disableElevation: true,
        },
      },

      overrides: {
        MuiButtonBase: {
          root: {
            cursor: 'default',
          },
        },

        MuiCssBaseline: {
          '@global': {
            '*::selection': {
              backgroundColor: fade(palette.primary.main, 0.2),
            },

            html: {
              userSelect: 'none',
              overscrollBehavior: 'none',
              '-webkit-touch-callout': 'none',

              height: '100%',
              margin: 'auto',
              maxWidth: '900px',
            },

            body: {
              height: '100%',
            },
          },
        },
      },
    })
  }, [prefersDarkMode])

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  )
}
