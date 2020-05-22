/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Ty Dira */

import {
  applySnapshot,
  getSnapshot,
  IAnyModelType,
  IAnyType,
  Instance,
  onPatch,
  SnapshotIn,
  types as t,
} from 'mobx-state-tree'
import Dexie from 'dexie'
import { v4 as uuid } from 'uuid'

type EdgeTypeFn = () => IAnyType

type PersistOptions = {
  pathFilter?: RegExp
  name?: string
}

export const edgeMapFactory = (getEdgeType: EdgeTypeFn): IAnyModelType =>
  t
    .model('EdgeMap', {
      edgeMap: t.map(t.array(t.reference(t.late(getEdgeType)))),
    })
    .actions(self => ({
      hasEdge(tag: string, target: Instance<IAnyModelType>): boolean {
        return Boolean(self.edgeMap.get(tag)?.includes(target))
      },
    }))
    .actions(self => ({
      addEdge(tag: string, target: Instance<IAnyModelType>) {
        if (!self.edgeMap.has(tag)) {
          self.edgeMap.set(tag, [])
        }

        self.edgeMap.get(tag)?.push(target)
      },

      getEdgeTag(tag: string): void | Array<Instance<IAnyModelType>> {
        return self.edgeMap.get(tag)
      },

      removeEdge(tag: string, target: Instance<IAnyModelType>) {
        if (!self.hasEdge(tag, target)) {
          throw Error(`Node '${self}' has no '${tag}' edge for '${target}'`)
        }

        self.edgeMap.get(tag)?.remove(target)
      },
    }))

export const getEdgeMapModels = (): void => {
  return
}

export const nodeFactory = (
  getEdgeType: EdgeTypeFn,
  composeModels: Array<IAnyModelType | EdgeTypeFn> = [],
): IAnyModelType =>
  t
    .compose(
      // @ts-ignore
      ...[
        edgeMapFactory,
        ...composeModels,
        t.model({
          id: t.identifier,
        }),
      ].map(item => (typeof item === 'function' ? item(getEdgeType) : item)),
    )
    .named('Node')

export const Node = nodeFactory(() => Node)

export const TypeConfig = t.model({
  name: t.identifier,
  compose: t.maybe(t.array(t.string)),
  props: t.array(t.array(t.string)),
})

export function graphFactory(
  initialNodeModels: Record<string, IAnyModelType> = { Node },
  makeId = () => uuid(),
): IAnyModelType {
  const modelCache = {
    ...initialNodeModels,
  }

  const modelValues = Object.values(modelCache)

  return (
    modelCache.Graph ??
    t.model('Graph', {
      nodesById: t.map(
        modelValues.length > 1 ? t.union(...modelValues) : modelCache.Node,
      ),
      typesById: t.map(TypeConfig),
    })
  ).actions(self => ({
    createTypeConfig(typeName: string): void {
      const typeModel = self.typesById.get(typeName)
      if (!typeModel) {
        throw Error(`No type config named '${typeName}'`)
      }

      const typeModelProps = Object.fromEntries(typeModel.props)
      modelCache[typeModel.name] = t
        .compose(Node, t.model(typeModelProps))
        .named(typeModel.name)
    },

    recompose(): Instance<IAnyModelType> | void {
      const newModels = {
        ...modelCache,
      }

      self.typesById.forEach((config: Instance<typeof TypeConfig>) => {
        let Model = t.model(Object.fromEntries(config.props))

        // TODO how should I use factories from a TypeConfig?
        // When a TypeConfig has compose: ['Node'] it won't get
        // properly bound edge types.
        if (config.compose) {
          Model = t.compose(
            // @ts-ignore
            ...[Model, ...config.compose.map(c => newModels[c])],
          )
        }

        Model = Model.named(config.name)
        newModels[config.name] = Model
      })

      const NewGraph = graphFactory(newModels)

      return NewGraph.create(getSnapshot(self))
    },

    createNode(
      modelName = 'Node',
      props: Omit<SnapshotIn<IAnyModelType>, 'id'> = {},
    ): Instance<IAnyModelType> {
      if (!modelCache[modelName]) {
        throw Error(`No model named '${modelName}'`)
      }

      const instance = modelCache[modelName].create({
        ...props,
        id: makeId(),
      })

      self.nodesById.put(instance)

      return instance
    },

    persist(options: PersistOptions = {}): void {
      // random old wants?:
      // ref resolver that loads adjacent edges
      // begin loading from 'last loaded' vertex in each region
      // patch buffer to flush to bulkPut on debounce
      // staleness stack used to free unused memory (free call)
      // handle remove call (rather than free call)
      // single Collection api for mobx and dexie? <3<3<3
      // graph structure wide enough to make use of indexedDB tables for different schemas
      // ERROR HANDLING.
      // more sensible api?
      const pathFilter = options.pathFilter ?? /\w+byId\/(.+)$/i
      const db = new Dexie(options.name ?? 'default')

      db.version(1).stores({
        graph: 'id',
      })

      const table = db.table('graph')

      onPatch(self, patch => {
        const match = patch.path.match(pathFilter)
        if (!match) {
          return
        }

        if (patch.op === 'add' || patch.op === 'replace') {
          table.put(patch.value)
        }
      })

      table.toArray().then(rows => {
        applySnapshot(self, {
          nodesById: Object.fromEntries(rows.map(r => [r.id, r])),
        })
      })
    },
  }))
}

export const Graph = graphFactory()
