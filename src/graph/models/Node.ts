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

import { types, IAnyType, Instance, getParentOfType } from 'mobx-state-tree'

import { nodeFactory, edgeMapFactory, Config, Graph } from 'graph'

// Avoid circular dependency
import { Unknown } from 'graph/models/Unknown'

export const Node = nodeFactory([
  edgeMapFactory(() =>
    types.union(
      types.late((): IAnyType => Node),
      Config,
    ),
  ),
])
  .props({
    content: types.union(types.string, Unknown),
  })

  .actions(self => ({
    setContent(content: string | Instance<typeof Unknown>): void {
      self.content = content
    },

    graphRoot(): Instance<IAnyType> {
      return getParentOfType(self, Graph)
    },

    getConfig(): Instance<typeof Config> {
      if (self.edgeMap.get('config')?.length) {
        return self.edgeMap.get('config')?.[0]
      }

      const config = self.graphRoot().createNode('Config', {})
      self.addEdge('config', config)

      return config
    },

    toggleExpand(node: Instance<IAnyType>, parentNode: Instance<IAnyType>) {
      return

      // const config = self.getConfig()
      // let expandedNodes = config.get('expandedNodes')

      // if (!expandedNodes) {
      //   expandedNodes = config.set('expandedNodes', {
      //     [parentNode.id]: [node.id],
      //   })
      // }

      // const nodeIds = expandedNodes.get(parentNode.id)

      // if (nodeIds) {
      //   if (nodeIds.includes(node.id)) {
      //     nodeIds.remove(node.id)
      //     if (nodeIds.length === 0) {
      //       expandedNodes.delete(parentNode.id)
      //     }
      //   } else {
      //     nodeIds.push(node.id)
      //   }
      // }
    },

    isExpanded(
      node: Instance<IAnyType>,
      parentNode: Instance<IAnyType>,
    ): boolean {
      return false

      // Something Fucky's Going On 8|
      // return Boolean(
      //   self
      //     .getConfig()
      //     .get('expandedNodes')
      //     ?.get(parentNode.id)
      //     ?.includes(node.id),
      // )
    },
  }))

  .views(self => ({
    get childCount(): number {
      return self.edgeMap.get('child')?.length ?? 0
    },

    get expandedNodes() {
      return self.getConfig().get('expandedNodes')
    },
  }))
