/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Ty Dira */

import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from '@material-ui/core/styles'
import App from './components/App'
import * as serviceWorker from './serviceWorker'
import { StoreProvider } from './store'
import theme from './theme'

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)

serviceWorker.register()
