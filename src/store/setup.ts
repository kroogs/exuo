/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Ty Dira */

import React from 'react'
import { types as t, Instance } from 'mobx-state-tree'
import { useObserver } from 'mobx-react-lite'

import { graphFactory, nodeFactory, edgeMapFactory } from './graph'
import * as models from './models'

export const Config = nodeFactory(models.Config)
export const Node = nodeFactory([
  models.Label,
  edgeMapFactory(() => t.union(Node, Config)),
])
export const Graph = graphFactory({ Node, Config })

export const initStore = (): Instance<typeof Graph> => {
  const graph = Graph.create()
  const root = graph.createNode('Node', { label: 'Lists' })

  graph.createNode('Config', {
    id: 'graph',
    name: 'Graph',
    items: { rootNodeId: root.id },
  })

  return graph
}

export const storeContext = React.createContext<Instance<typeof Graph> | null>(
  null,
)

export const StoreProvider: React.FunctionComponent<{
  value?: Instance<typeof Graph>
}> = ({ children, value }) =>
  React.createElement(
    storeContext.Provider,
    { value: value ?? initStore() },
    children,
  )

export function useStore<S>(selector: (s: Instance<typeof Graph>) => S): S {
  const store = React.useContext(storeContext)

  if (!store) {
    throw Error('Cannot use store before setup')
  }

  return useObserver(() => selector(store))
}
