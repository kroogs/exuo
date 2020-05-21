/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Ty Dira */

import React from 'react'
import { shallow } from 'enzyme'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

import { StoreProvider } from 'store'

import App from '../App'

const theme = createMuiTheme()

const Wrapper: React.FunctionComponent = () => (
  <React.StrictMode>
    <StoreProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </StoreProvider>
  </React.StrictMode>
)

test('Renders', () => {
  expect(shallow(<Wrapper />)).toMatchSnapshot()
})
