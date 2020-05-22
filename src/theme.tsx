import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'
// '#9ce12e', // green
// '#a378fe', // purple
// '#34c3ff' // blue
// rgb(220, 0, 78) // pink?

export const palette = {
  primary: {
    main: '#34c3ff',
  },
  background: {
    default: 'black',
  },
  text: {
    primary: 'inherit',
    secondary: 'inherit',
  },
}

export const typography = {
  fontSize: 12,
  fontFamily:
    '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
}

export const theme = responsiveFontSizes(
  createMuiTheme({
    palette,
    typography,
    props: {
      MuiButtonBase: {
        disableRipple: true,
      },
    },
  }),
)

export default theme
