/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Justin Krueger */

import React from 'react'
import { shallow } from 'enzyme'
import { types as t } from 'mobx-state-tree'

import EdgeList from '../EdgeList'
import Graph from 'store/models/Graph'
import Node from 'store/models/Node'
import Label from 'store/models/Label'

const LabelNode = t.compose(Label, Node)

test.skip('Renders a list of associated nodes', () => {
  throw Error('This fails.')
  const graph = Graph.create({
    id: 'graph',
  })

  const one = graph.createNode(LabelNode, { label: 'one' })
  const two = graph.createNode(LabelNode, { label: 'two' })

  one.addEdge('side', two)

  expect(shallow(<EdgeList model={graph} />)).toMatchSnapshot()
})
