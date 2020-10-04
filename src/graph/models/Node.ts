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
  IAnyType,
  Instance,
  getParentOfType,
  SnapshotIn,
} from 'mobx-state-tree'

import { nodeFactory, edgeMapFactory, ViewerConfig, Graph } from 'graph'

// Avoid circular dependency
import { Unknown } from 'graph/models/Unknown'

export const Node = nodeFactory([
  edgeMapFactory(() =>
    types.union(
      types.late((): IAnyType => Node),
      ViewerConfig,
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

    initConfig(
      value?: SnapshotIn<typeof ViewerConfig>,
    ): Instance<typeof ViewerConfig> | void {
      const config = self.config

      if (!config) {
        self.addEdge('config', self.graphRoot.createNode('ViewerConfig', value))
      }

      return self.config
    },
  }))

  .views(self => ({
    get childCount(): number {
      return self.edgeMap.get('child')?.length ?? 0
    },

    get graphRoot(): Instance<typeof Graph> {
      return getParentOfType(self, Graph)
    },

    get config(): Instance<typeof ViewerConfig> | void {
      if (self.edgeMap.size) {
        const edgeTag = self.edgeMap.get('config')
        if (edgeTag && edgeTag.length) {
          return edgeTag[0]
        }
      }

      return undefined
    },
  }))
