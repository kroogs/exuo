/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Justin Krueger */

import React from 'react'
import { types as t, Instance } from 'mobx-state-tree'

import { Graph } from './graph'
import { persist } from './utils'

export const Root = t.model('Root', {
  graph: Graph,
})

export const initStore = (): Instance<typeof Root> => {
  const store = Root.create({ graph: {} })

  // store.graph.init([persist])

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
