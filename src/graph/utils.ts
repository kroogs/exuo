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

import React from 'react'
import { Instance } from 'mobx-state-tree'

import { useStore } from 'exuo/src/store'
import { Graph, Node } from 'exuo/src/graph'

export const useGraph = (): Instance<typeof Graph> => useStore().graph

export const activeContext = React.createContext<Instance<typeof Node> | null>(
  null,
)

export const ActiveProvider = activeContext.Provider

export const useActive = (): Instance<typeof Node> => {
  const active = React.useContext(activeContext)
  if (active) {
    return active
  } else {
    throw Error('Cannot use active Node before setup')
  }
}
