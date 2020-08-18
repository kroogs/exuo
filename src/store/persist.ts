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
  Instance,
  onPatch,
  getSnapshot,
  getMembers,
  applySnapshot,
  IAnyModelType,
  isStateTreeNode,
} from 'mobx-state-tree'
import Dexie from 'dexie'

export async function persist(
  instance: Instance<IAnyModelType>,
): Promise<void> {
  const db = new Dexie('default')
  const tableNames = Object.keys(getMembers(instance).properties)
  const tableConfig = Object.fromEntries(tableNames.map(name => [name, 'id']))

  db.version(1).stores(tableConfig)

  return Promise.all(
    tableNames.map(name =>
      db
        .table(name)
        .toArray()
        .then(rows => [name, Object.fromEntries(rows.map(r => [r.id, r]))]),
    ),
  ).then(resolved => {
    applySnapshot(instance, Object.fromEntries(resolved))
    onPatch(instance, patch => {
      const [typeName, id, propName] = patch.path.split('/').slice(1)

      if (patch.op === 'add') {
        db.table(typeName).put(getSnapshot(instance[typeName].get(id)))
      } else if (patch.op === 'replace' || patch.op === 'remove') {
        if (propName) {
          let propValue = instance[typeName].get(id)[propName]

          if (isStateTreeNode(propValue)) {
            propValue = getSnapshot(propValue)
          }

          db.table(typeName).update(id, {
            [propName]: propValue,
          })
        } else {
          db.table(typeName).delete(id)
        }
      } else {
        throw Error(`Unknown patch op '${patch.op}'`)
      }
    })
  })
}
