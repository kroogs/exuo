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
/* import { configure } from 'mobx' */
import { Instance } from 'mobx-state-tree'
import { Graph } from 'exuo/src/graph'

import { Store } from './models/Store'

/* if (process.env.NODE_ENV === 'development') { */
/*   configure({ */
/*     enforceActions: 'always', */
/*     computedRequiresReaction: true, */
/*     reactionRequiresObservable: true, */
/*     observableRequiresReaction: true, */
/*     disableErrorBoundaries: true, */
/*   }) */
/* } */

const store = Store.create({
  graph: Graph.create(),
})

export const storeContext = React.createContext<Instance<typeof Store>>(store)

export const StoreProvider: React.FunctionComponent = ({ children }) =>
  React.createElement(storeContext.Provider, { value: store }, children)
