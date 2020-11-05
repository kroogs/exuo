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

import { nodeFactory, edgeMapFactory, View, Graph } from 'exuo/src/graph'

// Avoid circular dependency
import { Unknown } from 'exuo/src/graph/models/Unknown'

export const Node = nodeFactory([
  edgeMapFactory(() =>
    types.union(
      types.late((): IAnyType => Node),
      View,
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

    initView(value?: SnapshotIn<typeof View>): Instance<typeof View> | void {
      const view = self.view

      if (!view) {
        self.addEdge('view', self.graphRoot.createNode('View', value))
      }

      return self.view
    },
  }))

  .views(self => ({
    get childCount(): number {
      return self.edgeMap.get('child')?.length ?? 0
    },

    get graphRoot(): Instance<typeof Graph> {
      return getParentOfType(self, Graph)
    },

    get view(): Instance<typeof View> | void {
      if (self.edgeMap.size) {
        const edgeTag = self.edgeMap.get('view')
        if (edgeTag && edgeTag.length) {
          return edgeTag[0]
        }
      }

      return undefined
    },
  }))
