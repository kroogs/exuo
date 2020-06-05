/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Ty Dira */

import React from 'react'
import { mount } from 'enzyme'
import { types } from 'mobx-state-tree'

import { StoreProvider } from 'store'
import * as models from 'store/models'
import { nodeFactory, edgeMapFactory, graphFactory } from 'store/graph'
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
      <StoreProvider value={graph}>
        <PaneManager />
      </StoreProvider>,
    ),
  ).toMatchSnapshot()
})
