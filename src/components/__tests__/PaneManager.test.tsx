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
import { mount } from 'enzyme'
import { types } from 'mobx-state-tree'

import { nodeFactory, edgeMapFactory, graphFactory } from 'graph/factories'
import { GraphProvider } from 'graph'
import * as models from 'graph/models'
import PaneManager from '../PaneManager'

export const Config = nodeFactory(models.Config)
export const Node = nodeFactory([
  models.Label,
  edgeMapFactory(() => types.union(Node, Config)),
])
export const Graph = graphFactory({ Node, Config })

test('Renders a edge list panes from a graph', () => {
  const graph = Graph.create()
  const first = graph.createNode('Node', { id: '1' })
  const last = graph.createNode('Node', { id: '2' })

  let prev = null

  for (let i = 3; i < 9; i++) {
    const node = graph.createNode('Node', { id: String(i) })

    node.addEdge('last', last)
    node.addEdge('first', first)
    first.addEdge('child', node)

    if (prev) {
      prev.addEdge('next', node)
      node.addEdge('prev', prev)
    }

    prev = node
  }

  expect(
    mount(
      <GraphProvider value={graph}>
        <PaneManager />
      </GraphProvider>,
    ),
  ).toMatchSnapshot()
})
