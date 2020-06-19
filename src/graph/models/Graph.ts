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

import { Instance, SnapshotIn, IAnyModelType } from 'mobx-state-tree'

import { graphFactory } from 'graph/factories'
import { Node, Config } from './Node'

export const Graph = graphFactory({ Node, Config })
  .actions(self => ({
    createChild<T extends IAnyModelType>(
      node: Instance<typeof Node>,
      edgeProps: SnapshotIn<T>,
      edgeType = 'Node',
    ): Instance<typeof Node> {
      const child = self.createNode(edgeType, edgeProps)

      node.addEdge('child', child)
      child.addEdge('parent', node)

      return child
    },

    deleteNode(node: Instance<typeof Node>) {
      self.Node.delete(node.id)
    },

    toggleEditMode() {
      const editMode = self.Config.get('system').get('editMode')
      self.Config.get('system').set('editMode', !editMode)
    },
  }))
  .views(self => ({
    get rootNode() {
      const config = self.Config.get('system')
      return self.Node.get(config?.get('rootNodeId'))
    },

    get editMode() {
      const config = self.Config.get('system')
      return config?.get('editMode')
    },
  }))
