/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Ty Dira */

import React from 'react'
import { types as t, Instance } from 'mobx-state-tree'

import { graphFactory, nodeFactory, Label } from './models'

export const Node = nodeFactory(() => Node, [Label])
export const { Graph } = graphFactory({ Node })

// TODO
// a composed graph type with a View node type that stores
// colors, sizes, history, etc. per view. Then we won't need
// a rootNode.

export const Root = t.model('Root', {
  graph: Graph,
})

export const initStore = (): Instance<typeof Root> => {
  const store = Root.create({ graph: {} })

  // store.graph.persist() TODO Causes error when adding edges

  return store
}

export const storeContext = React.createContext<Instance<typeof Root> | null>(
  null,
)

export const StoreProvider: React.FunctionComponent = ({ children }) =>
  React.createElement(storeContext.Provider, { value: initStore() }, children)

export function useStore<S>(selector: (s: Instance<typeof Root>) => S): S {
  const store = React.useContext(storeContext)

  if (!store) {
    throw Error('Cannot use store before setup.')
  }

  return selector(store)
}
