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
  getType,
  isIdentifierType,
  onPatch,
  SnapshotIn,
  isModelType,
  types,
} from 'mobx-state-tree'
import { v4 as uuid } from 'uuid'

export const nodeFactory = (
  models: IAnyModelType | Array<IAnyModelType> = [],
): IAnyModelType =>
  types
    .compose(
      // @ts-ignore
      ...[
        types.model({
          id: types.identifier,
        }),
      ].concat(models),
    )
    .named('Node')

export type ModelOrUnion = IAnyModelType | IAnyType
export type EdgeResolver = () => ModelOrUnion
export type ModelTable = Record<string, IAnyModelType>

export function edgeMapFactory(getEdgeType: EdgeResolver): IAnyModelType {
  return types
    .model('EdgeMap', {
      edgeMap: types.map(types.array(types.reference(types.late(getEdgeType)))),
    })
    .actions(self => ({
      hasEdge(tag: string, target: Instance<IAnyModelType>): boolean {
        return Boolean(self.edgeMap.get(tag)?.includes(target))
      },
    }))
    .actions(self => ({
      addEdge(tag: string, target: Instance<IAnyModelType>): void {
        if (!self.edgeMap.has(tag)) {
          self.edgeMap.set(tag, [])
        }

        self.edgeMap.get(tag)?.push(target)
      },

      getEdgeTag(tag: string): void | Array<Instance<IAnyModelType>> {
        return self.edgeMap.get(tag)
      },

      removeEdge(tag: string, target: Instance<IAnyModelType>): void {
        if (!self.hasEdge(tag, target)) {
          throw Error(`Node '${self}' has no '${tag}' edge for '${target}'`)
        }

        self.edgeMap.get(tag)?.remove(target)
      },
    }))
}

export const Node = nodeFactory(edgeMapFactory(() => Node))

export const graphFactory = (
  nodeModels: ModelTable = { Node },
  options = { makeId: () => uuid() },
): IAnyModelType =>
  types
    .model(
      'Graph',
      Object.fromEntries(
        Object.keys(nodeModels).map(key => {
          const model = nodeModels[key]

          if (isModelType(model) && isIdentifierType(model.properties.id)) {
            return [key, types.map(nodeModels[key])]
          }

          // We can't add an identifier ourselves because the model may already be referenced
          throw Error(`Model '${key}' requires 'id' identifier`)
        }),
      ),
    )
    .actions(self => ({
      createNode(
        modelName = 'Node',
        props: Omit<SnapshotIn<IAnyModelType>, 'id'> = {},
      ): Instance<IAnyModelType> {
        if (!nodeModels[modelName]) {
          throw Error(`No model named '${modelName}'`)
        }

        const node = nodeModels[modelName].create({
          id: options.makeId(),
          ...props,
        })

        self[modelName].put(node)

        return node
      },
    }))

export const Graph = graphFactory()
