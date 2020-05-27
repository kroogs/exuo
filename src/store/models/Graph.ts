/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Ty Dira */

import {
  applySnapshot,
  getSnapshot,
  IAnyModelType,
  Instance,
  onPatch,
  SnapshotIn,
  types,
} from 'mobx-state-tree'
import Dexie from 'dexie'
import { v4 as uuid } from 'uuid'

import { Node } from './Node'

// TODO
// persist, TypeConfig, recompose
// support a per-type custom node initializer?

// type PersistOptions = {
//   pathFilter?: RegExp
//   name?: string
// }

// export const TypeConfig = t.model({
//   name: t.identifier,
//   compose: t.maybe(t.array(t.string)),
//   props: t.array(t.array(t.string)),
// })

type ModelTable = Record<string, IAnyModelType>

const nodeStoreFactory = (nodeModels: ModelTable) =>
  types.model(
    'NodeStore',
    Object.fromEntries(
      Object.keys(nodeModels).map(key => [key, types.map(nodeModels[key])]),
    ),
  )

export const graphFactory = (
  nodeModels: ModelTable = { Node },
  options = { idGenerator: () => uuid() },
): ModelTable => ({
  ...nodeModels,
  Graph: types
    .model('Graph', {
      nodes: types.optional(nodeStoreFactory(nodeModels), {}),
    })
    .actions(self => ({
      createNode(
        modelName = 'Node',
        props: Omit<SnapshotIn<IAnyModelType>, 'id'> = {},
      ): Instance<IAnyModelType> {
        if (!nodeModels[modelName]) {
          // TODO Support using a Model in addition to a modelName
          throw Error(`No model named '${modelName}'`)
        }

        const instance = nodeModels[modelName].create({
          ...props,
          id: options.idGenerator(),
        })

        self.nodes[modelName].put(instance)

        return instance
      },

      // This should be a wrapper of graphFactory() maybe?
      // createTypeConfig(typeName: string): void {
      //   typesById: t.map(TypeConfig),
      //   const typeModel = self.typesById.get(typeName)
      //   if (!typeModel) {
      //     throw Error(`No type config named '${typeName}'`)
      //   }
      //   const typeModelProps = Object.fromEntries(typeModel.props)
      //   modelCache[typeModel.name] = t
      //     .compose(Node, t.model(typeModelProps))
      //     .named(typeModel.name)
      // },

      // recompose(): Instance<IAnyModelType> | void {
      //   // !!! TODO if I have a NodeStore (nodeStoreFactory()), I can put
      //   // the recompose machinery in Graph instead of further up the tree
      //   const newModels = {
      //     ...modelCache,
      //   }
      //   self.typesById.forEach((config: Instance<typeof TypeConfig>) => {
      //     let Model = t.model(Object.fromEntries(config.props))
      //     // TODO how should I use factories from a TypeConfig?
      //     // When a TypeConfig has compose: ['Node'] it won't get
      //     // properly bound edge types.
      //     if (config.compose) {
      //       Model = t.compose(
      //         // @ts-ignore
      //         ...[Model, ...config.compose.map(c => newModels[c])],
      //       )
      //     }
      //     Model = Model.named(config.name)
      //     newModels[config.name] = Model
      //   })
      //   const NewGraph = graphFactory(newModels)
      //   return NewGraph.create(getSnapshot(self))
      // },

      // persist(options: PersistOptions = {}): void {
      //   random old wants?:
      //   ref resolver that loads adjacent edges
      //   begin loading from 'last loaded' vertex in each region
      //   patch buffer to flush to bulkPut on debounce
      //   staleness stack used to free unused memory (free call)
      //   handle remove call (rather than free call)
      //   single Collection api for mobx and dexie?
      //   const pathFilter = options.pathFilter ?? /\w+byId\/(.+)$/i
      //   const db = new Dexie(options.name ?? 'default')
      //   db.version(1).stores({
      //     graph: 'id',
      //   })
      //   const table = db.table('graph')
      //   onPatch(self, patch => {
      //     const match = patch.path.match(pathFilter)
      //     if (!match) {
      //       return
      //     }
      //     if (patch.op === 'add' || patch.op === 'replace') {
      //       table.put(patch.value)
      //     }
      //   })
      //   table.toArray().then(rows => {
      //     applySnapshot(self, {
      //       nodesById: Object.fromEntries(rows.map(r => [r.id, r])),
      //     })
      //   })
      // },
    })),
})

export const Graph = graphFactory()
