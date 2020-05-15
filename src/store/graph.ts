/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Justin Krueger */

import { v4 as uuid } from 'uuid'
import {
  types as t,
  SnapshotIn,
  SnapshotOrInstance,
  Instance,
  IAnyType,
  IAnyModelType,
  IAnyStateTreeNode,
} from 'mobx-state-tree'

// TODO
// improve TS types
// types from configuration
// custom default graph type
// getEdgeMapTypes()

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

      getEdgeTag(tag: string): Array<Instance<IAnyModelType>> {
        return self.edgeMap.get(tag) ?? []
      },

      removeEdge(tag: string, target: Instance<IAnyModelType>) {
        if (!self.hasEdge(tag, target)) {
          throw Error(
            `No edge target '${target}' for tag '${tag}' on '${self}'`,
          )
        }

        self.edgeMap.get(tag)?.remove(target)
      },
    }))

export const nodeFactory = (
  getEdgeType: EdgeTypeFn,
  composeModels: Array<IAnyModelType | EdgeTypeFn> = [],
): IAnyModelType =>
  t.compose(
    // @ts-ignore
    ...[
      edgeMapFactory,
      ...composeModels,
      t.model({
        id: t.identifier,
      }),
    ].map(item => (typeof item === 'function' ? item(getEdgeType) : item)),
  )

const Node = nodeFactory(() => Node)

// const NodeType = t.model('NodeType', {
//   name: t.identifier,
//   compose: t.maybe(t.array(t.late((): IAnyType => t.reference(NodeType)))),
//   props: t.array(t.array(t.string)),
// })

export function graphFactory(
  initialNodeModels: Record<string, IAnyModelType> = { Node },
): IAnyModelType {
  const modelCache = {
    ...initialNodeModels,
  }

  const modelValues = Object.values(modelCache)

  return modelCache.Node.props({
    nodesById: t.map(
      modelValues.length > 1 ? t.union(...modelValues) : modelCache.Node,
    ),
    // typesById: t.map(NodeType),
  })
    .named('Graph')
    .actions(self => {
      // const createNodeTypeModel = (typeName: string): void => {
      //   const typeModel = self.typesById.get(typeName)
      //   if (!typeModel) {
      //     throw Error(`No type named '${typeName}'`)
      //   }

      //   const typeModelProps = Object.fromEntries(typeModel.props)
      //   typeModelCache[typeModel.name] = t
      //     .compose(Node, t.model(typeModelProps))
      //     .named(typeModel.name)
      // }

      return {
        createNode(
          modelName: string,
          props: Omit<SnapshotIn<IAnyModelType>, 'id'>,
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
      }
    })
}

export const Graph = graphFactory()
