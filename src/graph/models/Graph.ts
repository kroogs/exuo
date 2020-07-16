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

import {
  Instance,
  SnapshotIn,
  SnapshotOut,
  IAnyModelType,
  applyPatch,
  onPatch,
  getSnapshot,
} from 'mobx-state-tree'
import { v4 as uuid } from 'uuid'
import Peer from 'peerjs'

import persist from '../persist'
import { graphFactory } from 'graph/factories'
import { Node, Config } from './Node'

const peerMaker = (graph: Instance<typeof Graph>, id: string): Peer => {
  const peer = new Peer(id, {
    host: 'peerbroker.herokuapp.com',
    port: 443,
    secure: true,
    // host: 'localhost',
    // port: 9000,
    // secure: false,
    debug: 3,
  })

  // let patchDisposer: null | ReturnType<typeof onPatch>

  // peer.on('connection', connection => {
  //   connection.on('open', () => {
  //     patchDisposer = onPatch(graph, patch => {
  //       const pathParts = patch.path.split('/').slice(1)
  //       if (pathParts[0] === 'Node') {
  //         connection?.send(patch)
  //       }
  //     })

  //     connection.on('close', () => {
  //       patchDisposer?.()
  //     })
  //   })
  // })

  return peer
}

// limit references to only those accessible beneath a Node
// and then produce a hash of Nodes ready to be applied to peer mst map
function getSafeFlatSnapshot(
  instance: Instance<typeof Node>,
): Record<string, SnapshotOut<typeof Node>> {
  return { [instance.id]: { ...getSnapshot(instance), edgeMap: {} } }
}

export const Graph = graphFactory({ Node, Config })
  // Peer
  .actions(self => {
    let peer: null | Peer = null
    let connection: null | Peer.DataConnection = null
    let patchDisposer: null | ReturnType<typeof onPatch>

    // TODO untangle

    return {
      offerPeerConnection(instance: Instance<typeof Node>) {
        peer = peerMaker(self, instance.id)

        peer.on('open', () => {
          self.setActiveMode('share')
        })

        peer.on('connection', c => {
          connection = c

          connection.on('open', () => {
            connection?.send({ ...getSnapshot(instance), edgeMap: {} })
          })

          connection.on('data', data => {
            if (data.op) {
              console.log('unsent to avoid loop', data)
              // applyPatch(self.Node.get(instance), data)
            }
          })

          connection.on('close', () => {
            self.unsetActiveMode('share')
          })
        })
      },

      async seekPeerConnection(peerId: string): Promise<Instance<typeof Node>> {
        peer = peerMaker(self, uuid())
        connection = peer.connect(peerId, { reliable: true })

        connection.on('close', () => {
          self.unsetActiveMode('share')
        })

        connection.on('disconnect', () => {
          self.unsetActiveMode('share')
        })

        return new Promise((resolve, reject) => {
          if (!connection) {
            throw Error('No connection to use')
          }

          connection.on('data', data => {
            if (data.id) {
              const child = self.createChild(self.rootNode, data)
              self.setActiveMode('share')
              resolve(child)
            } else if (data.op) {
              applyPatch(self, data)
            }
          })

          connection.on('error', error => {
            reject(error)
          })
        })
      },

      closePeerConnection() {
        connection?.close()
        peer?.disconnect()
        self.unsetActiveMode('share')
      },
    }
  })

  // Modes
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

      if (activeModes.includes(mode)) {
        activeModes.remove(mode)

        // TODO mode logic doesn't belong here
        if (mode === 'select') {
          self.clearSelectedNodes()
        }
      } else {
        activeModes.push(mode)
      }
    },
  }))

  // Selection
  .actions(self => ({
    clearSelectedNodes() {
      self.Config.get('system').get('selectedNodes')?.clear()
    },

    deleteSelectedNodes() {
      const selectedNodes = self.Config.get('system')?.get('selectedNodes')
      selectedNodes.forEach((id: string) => self.Node.delete(id))
      self.clearSelectedNodes()
      if (self.selectedNodes.length === 0) {
        self.unsetActiveMode('select')
      }
    },

    toggleSelectNode(node: Instance<typeof Node>) {
      const selectedNodes = self.Config.get('system').get('selectedNodes')
      if (selectedNodes?.includes(node.id)) {
        selectedNodes?.remove(node.id)
      } else {
        selectedNodes?.push(node.id)
      }

      if (selectedNodes.length === 0) {
        self.toggleActiveMode('select')
      }
    },

    // selectNode(node: Instance<typeof Node>) {

    // },

    // deselectNode(node: Instance<typeof Node>) {

    // },

    selectAllChildNodes(node: Instance<typeof Node>) {
      node.edgeMap
        .get('child')
        .forEach((child: Instance<typeof Node>) => console.log('child'))
    },

    // deselectAllChildNodes(node: Instance<typeof Node>) {

    // },
  }))

  .actions(self => ({
    afterCreate() {
      persist(self).then(() => {
        if (!self.Config.has('system')) {
          const root = self.createNode('Node', { label: 'Exuo' })

          self.createNode('Config', {
            id: 'system',
            items: {
              rootNodeId: root.id,
              activeModes: [],
              selectedNodes: [],
            },
          })

          self.createNode('Config', {
            id: 'user',
            items: {
              global: {
                dividers: false,
              },
              lists: {
                checkbox: false,
                dividers: false,
                showChildCount: true,
                showEdgeChips: false,
              },
            },
          })
        }
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

    toggleGlobalDividerSetting() {
      const value = self.Config.get('user').get('global')?.get('dividers')
      self.Config.get('user').get('global')?.set('dividers', !value)
    },

    toggleListCheckboxSetting() {
      const value = self.Config.get('user').get('lists')?.get('checkbox')
      self.Config.get('user').get('lists')?.set('checkbox', !value)
    },
  }))
  .views(self => ({
    get rootNode() {
      const config = self.Config.get('system')
      return config && self.Node.get(config.get('rootNodeId'))
    },

    get activeModes() {
      const config = self.Config.get('system')
      return config?.get('activeModes')
    },

    get selectedNodes() {
      return self.Config.get('system')?.get('selectedNodes')
    },

    get listCheckboxSetting() {
      return self.Config.get('user')?.get('lists')?.get('checkbox')
    },
  }))
