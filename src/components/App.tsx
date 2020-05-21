/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Ty Dira */

import React from 'react'
import { Router, RouteComponentProps } from '@reach/router'
import { useObserver } from 'mobx-react-lite'

import { useStore } from 'store'
import RootRegion from './RootRegion'
import Settings from './Settings'

type Props = { component: React.FunctionComponent } & RouteComponentProps

const Route: React.FunctionComponent<Props> = ({
  component: Component,
  ...rest
}) => <Component {...rest} />

const App: React.FunctionComponent = () => {
  const graph = useStore(store => store.graph)
  return (
    <Router>
      <Route path="/" component={() => <RootRegion graph={graph} />} />
      <Route path="/settings" component={Settings} />
    </Router>
  )
}

export default App
