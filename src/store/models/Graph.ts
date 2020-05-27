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
import { v4 as uuid } from 'uuid'

import { Node } from './Node'

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
          throw Error(`No model named '${modelName}'`)
        }

        const node = nodeModels[modelName].create({
          ...props,
          id: options.idGenerator(),
        })

        self.nodes[modelName].put(node)

        return node
      },
    })),
})

export const Graph = graphFactory()
