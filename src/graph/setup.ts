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

import React from 'react'
import { Instance } from 'mobx-state-tree'
import { useObserver } from 'mobx-react-lite'

import { Graph } from './models'

export const graphContext = React.createContext<Instance<typeof Graph>>(null)
export const GraphProvider: React.FunctionComponent<{
  value?: Instance<typeof Graph>
}> = ({ children, value }) =>
  React.createElement(
    graphContext.Provider,
    { value: value ?? Graph.create() },
    children,
  )

export function useGraph<S>(selector: (s: Instance<typeof Graph>) => S): S {
  const graph = React.useContext(graphContext)

  if (graph) {
    return useObserver(() => selector(graph))
  }

  throw Error('Cannot use graph before setup')
}
