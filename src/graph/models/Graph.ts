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
  Instance,
  applySnapshot,
  getSnapshot,
  SnapshotIn,
  IAnyModelType,
} from 'mobx-state-tree'

import { persist } from 'store/persist'

import { graphFactory } from './factories'
import { Node, Config, Note } from './Node'

export const Graph = graphFactory({ Node, Config, Note })
  .actions(self => ({
    setActiveMode(mode: string) {
      const activeModes = self.Config.get('system').get('activeModes')
      if (activeModes && !activeModes?.includes(mode)) {
        activeModes.push(mode)
      }
    },

    unsetActiveMode(mode: string) {
      const activeModes = self.Config.get('system').get('activeModes')
      if (activeModes?.includes(mode)) {
        activeModes.remove(mode)
      }
    },

    toggleActiveMode(mode: string) {
      const activeModes = self.Config.get('system').get('activeModes')

      if (!activeModes) {
        return
      }

      // TODO mode logic doesn't belong here
      if (activeModes.includes(mode)) {
        activeModes.remove(mode)

        if (mode === 'select') {
          self.clearSelectedNodes()
        }
      } else {
        activeModes.push(mode)

        if (mode === 'select') {
          activeModes.remove('edit')
        }

        if (mode === 'edit') {
          activeModes.remove('select')
          self.clearSelectedNodes()
        }
      }
    },
  }))

  .actions(self => ({
    toggleSelectNode(node: Instance<typeof Node>) {
      const selectedNodes = self.Config.get('system').get('selectedNodes')
      if (!selectedNodes) {
        return
      }

      const nodeIds = selectedNodes.get(self.cursorNode.id)

      if (nodeIds) {
        if (nodeIds.includes(node.id)) {
          nodeIds.remove(node.id)
          if (nodeIds.length === 0) {
            selectedNodes.delete(self.cursorNode.id)
          }
        } else {
          nodeIds.push(node.id)
        }
      } else {
        selectedNodes.set(self.cursorNode.id, [node.id])
      }

      if (selectedNodes.size === 0) {
        self.unsetActiveMode('select')
      }
    },

    clearSelectedNodes() {
      self.Config.get('system').get('selectedNodes')?.clear()
      if (self.selectedNodes.size === 0) {
        self.unsetActiveMode('select')
      }
    },

    deleteSelectedNodes() {
      // check if there are other
      self.selectedNodes.forEach((nodeIds: Array<string>) =>
        nodeIds.forEach((nodeId: string) => self.Node.delete(nodeId)),
      )

      self.clearSelectedNodes()
    },

    moveSelectedNodes() {
      for (const [accessorId, nodeIds] of self.selectedNodes) {
        const accessor = self.Node.get(accessorId)
        for (const nodeId of nodeIds) {
          const node = self.Node.get(nodeId)
          if (node) {
            node.removeEdge('parent', accessor)
            accessor.removeEdge('child', node)

            node.addEdge('parent', self.cursorNode)
            self.cursorNode.addEdge('child', node)
          }
        }
      }

      self.clearSelectedNodes()
    },

    copySelectedNodes() {
      //
    },

    linkSelectedNodes() {
      for (const nodeIds of self.selectedNodes.values()) {
        for (const nodeId of nodeIds) {
          const node = self.Node.get(nodeId)
          if (node) {
            node.addEdge('parent', self.cursorNode)
            self.cursorNode.addEdge('child', node)
          }
        }
      }

      self.clearSelectedNodes()
    },

    unlinkSelectedNodes() {
      for (const [accessorId, nodeIds] of self.selectedNodes) {
        const accessor = self.Node.get(accessorId)
        for (const nodeId of nodeIds) {
          const node = self.Node.get(nodeId)
          if (node) {
            node.removeEdge('parent', accessor)
            accessor.removeEdge('child', node)
          }
        }
      }

      self.clearSelectedNodes()
    },

    removeSelectedNodes() {
      for (const [accessorId, nodeIds] of self.selectedNodes) {
        const accessor = self.Node.get(accessorId)
        for (const nodeId of nodeIds) {
          const node = self.Node.get(nodeId)
          if (node) {
            node.removeEdge('parent', accessor)
            accessor.removeEdge('child', node)
            if (node.edgeMap.get('parent').size === 0) {
              self.deleteNode(node)
            }
          }
        }
      }

      self.clearSelectedNodes()
    },

    setCursorNode(node: Instance<typeof Node>) {
      self.Config.get('system')?.set('cursorNodeId', node.id)
    },
  }))

  .actions(self => ({
    afterCreate() {
      persist(self).then(() => {
        let rootNode = self.rootNode
        if (!rootNode) {
          rootNode = self.createNode('Node', { label: 'Exuo' })
        }

        const cursorNodeId =
          self.Config.get('system')?.get('cursorNodeId') ?? ''

        applySnapshot(self.Config, {
          system: {
            id: 'system',
            items: {
              cursorNodeId,
              rootNodeId: rootNode.id,
              activeModes: [],
              selectedNodes: {},
            },
          },

          user: {
            id: 'user',
            items: {
              global: {},
              lists: {},
            },
          },
        })
      })
    },

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
  }))

  .views(self => ({
    get rootNode() {
      const config = self.Config.get('system')
      return config && self.Node.get(config.get('rootNodeId'))
    },

    get cursorNode() {
      const config = self.Config.get('system')
      return config && self.Node.get(config.get('cursorNodeId'))
    },

    get activeModes() {
      const config = self.Config.get('system')
      return config?.get('activeModes')
    },

    get selectedNodes() {
      return self.Config.get('system')?.get('selectedNodes')
    },
  }))
