/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Ty Dira */

import React from 'react'
import {
  types as t,
  Instance,
  onPatch,
  getSnapshot,
  getMembers,
  applySnapshot,
  IAnyStateTreeNode,
} from 'mobx-state-tree'
import { useObserver } from 'mobx-react-lite'
import Dexie from 'dexie'

import { graphFactory, nodeFactory, edgeMapFactory } from './graph'
import * as models from './models'

async function persist(graph: Instance<typeof Graph>): Promise<void> {
  const db = new Dexie('default')
  const tableNames = Object.keys(getMembers(graph).properties)
  const tableConfig = Object.fromEntries(tableNames.map(name => [name, 'id']))

  db.version(1).stores(tableConfig)

  return Promise.all(
    tableNames.map(name =>
      db
        .table(name)
        .toArray()
        .then(rows => [name, Object.fromEntries(rows.map(r => [r.id, r]))]),
    ),
  )
    .then(resolved => {
      applySnapshot(graph, Object.fromEntries(resolved))
      onPatch(graph, patch => {
        const [typeName, id] = patch.path.split('/').slice(1)
        if (patch.op === 'add' || patch.op === 'replace') {
          db.table(typeName).put(getSnapshot(graph[typeName].get(id)))
        }
      })
    })
    .catch(error => {
      throw Error(error)
    })
}

export async function initialize(graph: Instance<typeof Graph>): Promise<void> {
  if (graph.Config.has('graph')) {
    return
  }

  const root = graph.createNode('Node', { label: 'Lists' })
  graph.createNode('Config', {
    id: 'graph',
    items: { rootNodeId: root.id },
  })
}

export const Config = nodeFactory(models.Config)
export const Node = nodeFactory([
  models.Label,
  edgeMapFactory(() => t.union(Node, Config)),
])
export const Graph = graphFactory(
  { Node, Config },
  { adapters: [persist, initialize] },
)

export const storeContext = React.createContext<Instance<typeof Graph> | null>(
  null,
)

export const StoreProvider: React.FunctionComponent<{
  value?: Instance<typeof Graph>
}> = ({ children, value }) =>
  React.createElement(
    storeContext.Provider,
    { value: value ?? Graph.create() },
    children,
  )

export function useStore<S>(selector: (s: Instance<typeof Graph>) => S): S {
  const store = React.useContext(storeContext)

  if (!store) {
    throw Error('Cannot use store before setup')
  }

  return useObserver(() => selector(store))
}
