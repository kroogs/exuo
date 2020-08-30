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
      primary: { main: '#f94d94' },
      secondary: { main: '#ff8032' },
      background: {
        default: prefersDarkMode ? '#000000' : '#ffffff',
      },
      text: {
        primary: prefersDarkMode ? '#dddddd' : '#333333',
        secondary: prefersDarkMode ? '#aaaaaa' : '#777777',
      },
    }

    return createMuiTheme({
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

      palette,

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
              backgroundColor: fade(palette.primary.main, 0.3),
            },

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
