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

import { types as t, SnapshotIn, IAnyType, Instance } from 'mobx-state-tree'

const Basic = t.union(
  t.boolean,
  t.string,
  t.number,
  t.late((): IAnyType => t.array(Basic)),
)

// set and setItem?
export const Config = t
  .model('Config', {
    name: t.maybe(t.string),
    items: t.map(Basic),
  })
  .actions(self => ({
    set(key: string, value: SnapshotIn<typeof Basic>) {
      self.items.set(key, value)
    },
  }))
  .views(self => ({
    get(key: string): Instance<typeof Basic> {
      return self.items.get(key)
    },
  }))
