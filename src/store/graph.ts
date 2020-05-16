/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Justin Krueger */

import { v4 as uuid } from 'uuid'
import {
  types as t,
  SnapshotIn,
  Instance,
  IAnyType,
  IAnyModelType,
  getType,
  getSnapshot,
} from 'mobx-state-tree'

type EdgeTypeFn = () => IAnyType

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

const Node = nodeFactory(() => Node)

const TypeConfig = t.model({
  name: t.identifier,
  compose: t.maybe(t.array(t.string)),
  props: t.array(t.array(t.string)),
})

export function graphFactory(
  initialNodeModels: Record<string, IAnyModelType> = { Node },
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
        throw Error(`No type named '${typeName}'`)
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
        id: uuid(),
      })

      self.nodesById.put(instance)

      return instance
    },
  }))
}

export const Graph = graphFactory()
