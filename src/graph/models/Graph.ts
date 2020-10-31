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
  types,
  Instance,
  applySnapshot,
  SnapshotIn,
  SnapshotOut,
  IAnyModelType,
  getSnapshot,
} from 'mobx-state-tree'

import { persist } from 'store/persist'

import { graphFactory } from './factories'
import { Node } from './Node'
import { Config } from './Config'
import { View } from './View'

export const Graph = graphFactory({
  Node,
  Config,
  View,
})
  .actions(self => ({
    // TODO mode and select stuff don't belong here

    setActiveMode(mode: string) {
      const activeModes = self.activeModes
      if (!activeModes?.includes(mode)) {
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

    unsetActiveMode(mode: string) {
      const activeModes = self.activeModes
      if (activeModes?.includes(mode)) {
        activeModes.remove(mode)
      }
    },

    toggleActiveMode(mode: string) {
      const activeModes = self.activeModes

      if (!activeModes) {
        return
      }

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

  .actions(self => {
    function processExportNode(
      itemId: string,
      allIds: Array<string>,
    ): SnapshotIn<typeof Node> {
      const json = { ...self['Node'].get(itemId).toJSON() }
      const parentIds = json.edgeMap.parent

      delete json.edgeMap

      if (parentIds) {
        const localIds = parentIds.filter((id: string) => allIds.includes(id))
        if (localIds.length) {
          json.edgeMap = { parent: localIds }
        }
      }

      return json
    }

    return {
      selectNode(
        node: Instance<typeof Node>,
        parentNode: Instance<typeof Node>,
      ): void {
        const nodes = self.selectedNodes
        const container = nodes.get(parentNode.id)

        if (container) {
          if (!container.includes(node.id)) {
            container.push(node.id)
          }
        } else {
          nodes.set(parentNode.id, [node.id])
        }
      },

      deselectNode(
        node: Instance<typeof Node>,
        parentNode: Instance<typeof Node>,
      ): void {
        const nodes = self.selectedNodes
        const container = nodes.get(parentNode.id)

        if (!container) return

        container.remove(node.id)

        if (container.length === 0) {
          nodes.delete(parentNode.id)
        }
      },

      toggleSelectNode(
        node: Instance<typeof Node>,
        parentNode: Instance<typeof Node>,
      ): void {
        const selectedNodes = self.Config.get('system').get('selectedNodes')
        if (!selectedNodes) {
          return
        }

        const nodeIds = selectedNodes.get(parentNode.id)

        if (nodeIds) {
          if (nodeIds.includes(node.id)) {
            nodeIds.remove(node.id)
            if (nodeIds.length === 0) {
              selectedNodes.delete(parentNode.id)
            }
          } else {
            nodeIds.push(node.id)
          }
        } else {
          selectedNodes.set(parentNode.id, [node.id])
        }
      },

      clearSelectedNodes(): void {
        self.Config.get('system').get('selectedNodes')?.clear()
        if (self.selectedNodes.size === 0) {
          self.unsetActiveMode('select')
        }
      },

      deleteSelectedNodes(): void {
        self.selectedNodes.forEach((nodeIds: Array<string>) =>
          nodeIds.forEach((nodeId: string) => self.Node.delete(nodeId)),
        )

        self.clearSelectedNodes()
      },

      moveSelectedNodes(target: Instance<typeof Node>): void {
        for (const [accessorId, nodeIds] of self.selectedNodes) {
          const accessor = self.Node.get(accessorId)
          for (const nodeId of nodeIds) {
            const node = self.Node.get(nodeId)
            if (node) {
              node.removeEdge('parent', accessor)
              accessor.removeEdge('child', node)

              node.addEdge('parent', target)
              target.addEdge('child', node)
            }
          }
        }

        self.clearSelectedNodes()
      },

      copySelectedNodes(): void {
        //
      },

      linkSelectedNodes(target: Instance<typeof Node>): void {
        for (const nodeIds of self.selectedNodes.values()) {
          for (const nodeId of nodeIds) {
            const node = self.Node.get(nodeId)
            if (node) {
              node.addEdge('parent', target)
              target.addEdge('child', node)
            }
          }
        }

        self.clearSelectedNodes()
      },

      unlinkSelectedNodes(): void {
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

      removeSelectedNodes(): void {
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

      exportSelectedItems(): Blob {
        const itemIds = Object.values(self.selectedNodes.toJSON()).flatMap(
          value => value,
        ) as Array<string>

        const snapshot = Object.fromEntries(
          itemIds.map(id => [id, processExportNode(id, itemIds)]),
        )

        return new Blob([JSON.stringify(snapshot, null, 2)], {
          type: 'application/json',
        })
      },

      exportAllItems(): Blob | void {
        return new Blob([JSON.stringify(getSnapshot(self), null, 2)], {
          type: 'application/json',
        })
      },

      importItems(file: File): void {
        file
          .text()
          .then(text => JSON.parse(text))
          .then(json => applySnapshot(self, json))
          .catch(error => {
            throw Error(`Import error ${error}`)
          })
      },
    }
  })

  .actions(self => ({
    afterCreate() {
      persist(self)
        .then(() => {
          if (!self.rootNode) {
            const rootNode = self.createNode('Node', { content: 'Locus' })
            applySnapshot(self.Config, {
              system: {
                id: 'system',
                items: {
                  rootNodeId: rootNode.id,
                  selectedNodes: {},
                  lastSelectedNodeId: '',
                  activeModes: [],
                },
              },
            })
          }
        })
        .catch(e => {
          console.error('Persist error', e)
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
      return self.Node.get(config?.get('rootNodeId'))
    },

    get activeModes() {
      const config = self.Config.get('system')
      return config?.get('activeModes')
    },

    get selectedNodes() {
      const config = self.Config.get('system')
      return config?.get('selectedNodes')
    },

    get lastSelectedNode() {
      const config = self.Config.get('system')
      return self.Node.get(config?.get('lastSelectedNodeId'))
    },

    get selectedNodeCount() {
      let count = 0

      for (const [, value] of self.selectedNodes) {
        count += value.length
      }

      return count
    },
  }))
