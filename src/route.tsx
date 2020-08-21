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
import * as reach from '@reach/router'

import { useGraph } from 'graph'
import { NodeViewer } from 'graph'
import { PeerConnector } from 'peer'
import { Settings } from 'common'

// Necessary for now because this routing library is bad.
export function makeUrl(path = ''): string {
  return process.env.PUBLIC_URL + path
}

export type RouteProps<T = unknown> = {
  component: React.FunctionComponent<T>
} & reach.RouteComponentProps

export const Route: React.FunctionComponent<RouteProps> = ({
  component: Component,
  ...props
}) => <Component {...props} />

export const Router: React.FunctionComponent = () =>
  useGraph(graph =>
    graph.rootNode ? (
      <reach.Router basepath={process.env.PUBLIC_URL}>
        <Route path="/" component={NodeViewer} />
        <Route path=":type/:id" component={NodeViewer} />
        <Route path="peer/:id" component={PeerConnector} />
        <Route path="settings" component={Settings} />
      </reach.Router>
    ) : null,
  )
