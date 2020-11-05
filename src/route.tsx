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

export {}
/* import { observer } from 'mobx-react-lite' */
/* import * as reach from '@reach/router' */

/* export const Link = reach.Link */

/* import { useGraph, NodeViewer } from 'exuo/src/graph' */
/* /1* import { PeerConnector } from 'peer' *1/ */

/* // Necessary for now because this routing library is bad. */
export const makeUrl = (path = ''): string => process.env.PUBLIC_URL + path
export const navigate = (path = ''): void => {
  /* reach.navigate(makeUrl(path)) */
}

export const Link: React.FunctionComponent = () => <></>

/* export type RouteProps<T = unknown> = { */
/*   component: React.FunctionComponent<T> */
/* } & reach.RouteComponentProps */

/* export const Route: React.FunctionComponent<RouteProps> = ({ */
/*   component: Component, */
/*   ...props */
/* }) => <Component {...props} /> */

/* export const Router: React.FunctionComponent = observer(() => { */
/*   const graph = useGraph() */
/*   return graph.rootNode ? ( */
/*     <reach.Router basepath={process.env.PUBLIC_URL}> */
/*       <Route path="/" component={NodeViewer} /> */
/*       <Route path=":type/:id" component={NodeViewer} /> */
/*       {/1* <Route path="peer/:id" component={PeerConnector} /> *1/} */
/*     </reach.Router> */
/*   ) : null */
/* }) */
