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

import { types, Instance } from 'mobx-state-tree'

import { nodeFactory } from 'graph'

const ViewerConfigItem = types
  .model('ViewerConfigItem', {
    expanded: types.optional(types.boolean, false),
  })
  .actions(self => ({
    setExpanded(value: boolean) {
      self.expanded = value
    },
  }))

const ViewerConfigBase = types
  .model('ViewerConfig', {
    items: types.map(types.map(ViewerConfigItem)),
  })

  .views(self => ({
    getItem(
      parentId: string,
      childId: string,
    ): Instance<typeof ViewerConfigItem> | void {
      if (self.items.size) {
        const parent = self.items.get(parentId)
        if (parent && parent.size) {
          return parent.get(childId)
        }
      }
    },
  }))

  .actions(self => ({
    initItem(
      parentId: string,
      childId: string,
    ): Instance<typeof ViewerConfigItem> | void {
      const item = self.getItem(parentId, childId)

      if (!item) {
        const parent = self.items.get(parentId)
        const item = ViewerConfigItem.create()

        if (parent) {
          parent.set(childId, item)
        } else {
          self.items.set(parentId, {
            [childId]: item,
          })
        }
      }

      return self.getItem(parentId, childId)
    },
  }))

export const ViewerConfig = nodeFactory(ViewerConfigBase)
