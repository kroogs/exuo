/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Justin Krueger */

import Dexie from 'dexie'
import {
  types as t,
  onPatch,
  IAnyStateTreeNode,
  applySnapshot,
  getSnapshot,
  getType,
  IAnyModelType,
  Instance,
  IAnyType,
} from 'mobx-state-tree'

export function applyModel<M extends IAnyModelType, C extends IAnyModelType>(
  model: M,
  instance: Instance<C>,
): Instance<M> {
  return t.compose(getType(instance) as C, model).create(getSnapshot(instance))
}

type PersistOptions = {
  pathFilter?: RegExp
  name?: string
}

// random old wants?:
// ref resolver that loads adjacent edges
// begin loading from 'last loaded' vertex in each region
// patch buffer to flush to bulkPut on debounce
// staleness stack used to free unused memory (free call)
// handle remove call (rather than free call)
// single Collection api for mobx and dexie? <3<3<3
// graph structure wide enough to make use of indexedDB tables for different schemas
// ERROR HANDLING.
// more sensible api?

export function persist<T extends IAnyStateTreeNode>(
  model: T,
  options: PersistOptions = {},
): void {
  const pathFilter = options.pathFilter ?? /\w+byId\/(.+)$/i
  const db = new Dexie(options.name ?? 'default')

  db.version(1).stores({
    graph: 'id',
  })

  const table = db.table('graph')

  table.toArray().then(rows => {
    applySnapshot(model, {
      vertexById: Object.fromEntries(rows.map(r => [r.id, r])),
    })

    onPatch(model, patch => {
      const match = patch.path.match(pathFilter)
      if (!match) {
        return
      }

      if (patch.op === 'add' || patch.op === 'replace') {
        table.put(patch.value)
      }
    })
  })
}
