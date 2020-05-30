/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Ty Dira */

import React from 'react'
import { mount } from 'enzyme'
import { types } from 'mobx-state-tree'

import PaneManager from '../PaneManager'
import { StoreProvider, initStore } from 'store'

test('Renders a basic graph', () => {
  const graph = initStore()
  const first = graph.createNode('Node', { id: '1' })
  const last = graph.createNode('Node', { id: '2' })

  let prev = null

  for (let i = 6; i < 9; i++) {
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
      <StoreProvider>
        <PaneManager />
      </StoreProvider>,
    ),
  ).toMatchSnapshot()
})
