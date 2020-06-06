/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Ty Dira */

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
