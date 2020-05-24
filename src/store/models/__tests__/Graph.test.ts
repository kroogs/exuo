/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Ty Dira */

import {
  types as t,
  getType,
  getSnapshot,
  IAnyModelType,
  isType,
} from 'mobx-state-tree'

import { Graph, graphFactory } from '../Graph'
import { nodeFactory } from '../Node'
import { edgeMapFactory } from '../EdgeMap'
import Label from '../Label'

describe('#graphFactory', () => {
  test('supports a custom base Node model', () => {
    const Node = nodeFactory(() => Node, [t.model({ custom: t.string })])
    const GraphModel = graphFactory({ Node })
    expect(
      getSnapshot(
        GraphModel.create({
          nodesById: { one: { id: 'one', custom: 'one' } },
        }),
      ),
    ).toStrictEqual({
      nodesById: { one: { id: 'one', custom: 'one', edgeMap: {} } },
      typesById: {},
    })
  })

  test('supports relationships with custom models', () => {
    const Node = nodeFactory(() => t.union(Node, LabelNode))
    const LabelNode = nodeFactory(() => t.union(Node, LabelNode), [Label])
    const GraphModel = graphFactory({ Node, Label: LabelNode })

    const graph = GraphModel.create()

    const one = graph.createNode()
    const two = graph.createNode()

    two.addEdge('side', one)
    expect(graph.nodesById.get(two.id).edgeMap.get('side')?.[0]).toBe(one)

    const potato = graph.createNode('Label', { label: 'potato' })
    one.addEdge('item', potato)
    expect(graph.nodesById.get(one.id).edgeMap.get('item')?.[0]).toBe(potato)

    potato.addEdge('inside', potato)
    expect(potato.edgeMap.get('inside')?.[0]).toBe(potato)
  })

  test.skip('#createTypeConfig creates and stores TypeConfig instances', () => {
    // graph.createTypeConfig([
    //   {
    //     name: 'Test',
    //     props: [['label', 'string']],
    //   },
    // ])
    return
  })

  test.skip('#recompose produces a new graph with configured types', () => {
    const graph = Graph.create({
      nodesById: {
        one: {
          id: 'one',
        },
      },
      typesById: {
        Custom: {
          name: 'Custom',
          compose: ['Node'],
          props: [['custom', 'string']],
        },
      },
    })

    const newGraph = graph.recompose()
    const custom = newGraph.createNode('Custom', { custom: 'sure' })
    newGraph.nodesById.get('one').addEdge('out', custom)
  })
})
