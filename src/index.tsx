/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Ty Dira */

import React from 'react'
import ReactDOM from 'react-dom'
import 'mobx-react-lite/batchingForReactDom'
import * as serviceWorker from './serviceWorker'

import App from './components/App'
import { StoreProvider } from './store'
import { ThemeProvider } from './theme'

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)

serviceWorker.register()
