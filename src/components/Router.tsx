/*
 * Copyright © 2020 Ty Dira <ty@dira.dev>
 *
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
import { RouteComponentProps, Router as ReachRouter } from '@reach/router'
import { useNavigate } from '@reach/router'

import { useGraph } from 'graph'
import Debug from './Debug'
import InstanceViewer from './InstanceViewer'
import PropertyEditor from './PropertyEditor'
import Settings from './Settings'

type Props<T = unknown> = {
  component: React.FunctionComponent<T>
} & RouteComponentProps

const Route: React.FunctionComponent<Props> = ({
  component: Component,
  ...rest
}) => <Component {...rest} />

const Root: React.FunctionComponent = () => {
  const navigate = useNavigate()
  useGraph(graph => {
    if (graph.rootNode) {
      navigate(`/node/${graph.rootNode.id}/`)
    }
  })
  return <></>
}

export const Router: React.FunctionComponent = () => (
  <ReachRouter>
    <Route path="/" component={Root} />
    <Route path="/:type/:id/" component={InstanceViewer} />
    <Route path="/settings" component={Settings} />
  </ReachRouter>
)

export default Router
