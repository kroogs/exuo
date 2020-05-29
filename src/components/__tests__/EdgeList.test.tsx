/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Ty Dira */

import React from 'react'
import { mount } from 'enzyme'

import EdgeList from '../EdgeList'
import { graphFactory, Node } from 'store/models'

let nextId = 0
const makeId = (): string => String(++nextId)

const Graph = graphFactory({ Node }, { makeId })

test('Renders a list of associated nodes', () => {
  const graph = Graph.create()
  const first = graph.createNode()
  const last = graph.createNode()

  let prev = null

  for (let i = 0; i < 5; i++) {
    const node = graph.createNode()

    node.addEdge('last', last)
    node.addEdge('first', first)
    first.addEdge('child', node)

    if (prev) {
      prev.addEdge('next', node)
      node.addEdge('prev', prev)
    }

    prev = node
  }

  expect(mount(<EdgeList node={first} />)).toMatchSnapshot()
})
