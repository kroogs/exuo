/*
 * Copyright © 2020 Ty Dira <ty@dira.dev>

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

import {
  IAnyModelType,
  IAnyType,
  Instance,
  isIdentifierType,
  SnapshotIn,
  isModelType,
  types,
} from 'mobx-state-tree'
import { v4 as uuid } from 'uuid'

export type ModelOrUnion = IAnyModelType | IAnyType
export type EdgeResolver = () => ModelOrUnion
export type ModelTable = Record<string, IAnyModelType>

export const edgeMapFactory = (getEdgeType: EdgeResolver): IAnyModelType =>
  types
    .model('EdgeMap', {
      edgeMap: types.map(
        types.array(
          types.safeReference(types.late(getEdgeType), {
            acceptsUndefined: false,
          }),
        ),
      ),
    })
    .actions(self => ({
      hasEdge(tag: string, target?: Instance<IAnyModelType>): boolean {
        if (target) {
          return Boolean(self.edgeMap.get(tag)?.includes(target))
        } else {
          return Boolean(self.edgeMap.get(tag)?.length)
        }
      },
    }))
    .actions(self => ({
      addEdge(tag: string, target: Instance<IAnyModelType>): void {
        if (!self.edgeMap.has(tag)) {
          self.edgeMap.set(tag, [])
        }

        self.edgeMap.get(tag)?.push(target)
      },

      removeEdge(tag: string, target: Instance<IAnyModelType>): void {
        if (!self.edgeMap.get(tag)?.remove(target)) {
          throw Error(`Node '${self}' has no '${tag}' edge for '${target}'`)
        }
      },
    }))
    .views(self => ({
      getEdgeTag(tag: string): void | Array<Instance<IAnyModelType>> {
        return self.edgeMap.get(tag)
      },
    }))

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

interface GraphFactoryOptions {
  getId?: () => string
}

export const graphFactory = (
  nodeModels: ModelTable,
  options: GraphFactoryOptions = {},
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

          // Can't add an identifier because the model may be referenced
          throw Error(`Model '${key}' requires 'id' identifier`)
        }),
      ),
    )
    .actions(self => ({
      createNode(
        modelName = 'Node',
        props: SnapshotIn<IAnyModelType> = {},
      ): Instance<IAnyModelType> {
        if (!nodeModels[modelName]) {
          throw Error(`No model named '${modelName}'`)
        }

        const node = nodeModels[modelName].create({
          id: options.getId?.() ?? uuid(),
          ...props,
        })

        self[modelName].put(node)

        return node
      },
    }))

export const NodeBase = nodeFactory(edgeMapFactory(() => NodeBase))
export const GraphBase = graphFactory({ Node: NodeBase })
