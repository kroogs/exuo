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
import {
  types,
  Instance,
  onPatch,
  getSnapshot,
  getMembers,
  applySnapshot,
} from 'mobx-state-tree'
import { useObserver } from 'mobx-react-lite'
import Dexie from 'dexie'

import { graphFactory, nodeFactory, edgeMapFactory } from './graph'
import * as models from './models'

export async function persist(graph: Instance<typeof Graph>): Promise<void> {
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
  ).then(resolved => {
    applySnapshot(graph, Object.fromEntries(resolved))
    onPatch(graph, patch => {
      const [typeName, id] = patch.path.split('/').slice(1)
      if (patch.op === 'add' || patch.op === 'replace') {
        db.table(typeName).put(getSnapshot(graph[typeName].get(id)))
      }
    })
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
  edgeMapFactory(() => types.union(Node, Config)),
])
export const Graph = graphFactory(
  { Node, Config },
  { adapters: [persist, initialize] },
)

export const storeContext = React.createContext<Instance<typeof Graph>>(null)
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
