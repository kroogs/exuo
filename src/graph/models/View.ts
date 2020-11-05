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

import { nodeFactory } from 'exuo/src/graph'

const ViewItem = types
  .model('ViewItem', {
    expanded: types.optional(types.boolean, false),
  })

  .actions(self => ({
    setExpanded(value: boolean) {
      self.expanded = value
    },
  }))

const ViewBase = types
  .model('View', {
    items: types.map(ViewItem),
  })

  .views(self => ({
    getItem(path: string): Instance<typeof ViewItem> | void {
      if (self.items.size) {
        return self.items.get(path)
      }
    },
  }))

  .actions(self => ({
    initItem(path: string): Instance<typeof ViewItem> | void {
      let item = self.getItem(path)
      if (item) return item

      item = ViewItem.create()
      self.items.set(path, item)

      return self.getItem(path)
    },
  }))

export const View = nodeFactory(ViewBase)
