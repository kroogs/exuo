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

// goals
// custom edgemap types
// custom default node type
// custom default graph type
// many node types
// getEdgeMapTypes()

export const edgeMapFactory = (
  referenceFunc: () => IAnyModelType,
): IAnyModelType =>
  t
    .model('EdgeMap', {
      edgeMap: t.map(t.array(t.reference(t.late(referenceFunc)))),
    })
    .actions(self => ({
      addEdge(tag: string, target: Instance<IAnyModelType>) {
        if (!self.edgeMap.has(tag)) {
          self.edgeMap.set(tag, [])
        }

        self.edgeMap.get(tag)?.push(target)
      },

      removeEdge(tag: string, target: Instance<IAnyModelType>) {
        self.edgeMap.get(tag)?.remove(target)
      },
    }))

const Node = t
  .compose(
    edgeMapFactory((): IAnyModelType => Node),
    t.model({
      id: t.identifier,
    }),
  )
  .named('Node')

// const NodeType = t.model('NodeType', {
//   name: t.identifier,
//   compose: t.maybe(t.array(t.late((): IAnyType => t.reference(NodeType)))),
//   props: t.array(t.array(t.string)),
// })

export function graphFactory(
  initialNodeModels: Record<
    string,
    IAnyModelType | ((x: IAnyModelType) => IAnyModelType)
  >,
): IAnyModelType {
  const modelCache = { Node, ...initialNodeModels }
  const GraphBase = modelCache.Node.props({
    nodesById: t.map(modelCache.Node),
    // typesById: t.map(NodeType),
  })

  const Graph = GraphBase.named('Graph').actions(self => {
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
      createNode<T extends IAnyModelType>(
        typeModelName: string,
        props: Omit<SnapshotIn<T>, 'id'>,
      ): Instance<T> {
        if (!typeModelCache[typeModelName]) {
          console.log('typeModelCache', typeModelCache)
          throw Error(`No type model named '${typeModelName}'`)
        }

        const instance = typeModelCache[typeModelName].create({
          ...props,
          id: uuid(),
        })

        self.nodesById.put(instance)

        return instance
      },
    }
  })

  return Graph
}

// export const Graph = graphFactory({
//   Node,
//   Graph,
// })
