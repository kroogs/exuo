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

import { types } from 'mobx-state-tree'

import { Graph } from 'graph'
import { History, route } from 'route'

export const Store = types
  .model('Store', {
    graph: Graph,
    history: History,
    location: types.maybe(types.string),
  })
  .actions(self => ({
    afterCreate() {
      const href = window.location.href
      const path = window.location.pathname
      const envUrl = process.env.PUBLIC_URL || '/'
      const index = href.indexOf(envUrl)

      let location

      if (index === 0) {
        location = href.replace(envUrl, '')
      } else if (index > 0 && path.indexOf(envUrl) === 0) {
        location = path.replace(envUrl, '')
      } else {
        location = path

        if (process.env.NODE_ENV === 'development') {
          console.warn(
            `Invalid 'homepage' value '${process.env.PUBLIC_URL}'` +
              ` in package.json, trying '${path}'`,
          )
        }
      }

      self.location = location.replace(/\/+/, '/')
    },
  }))
