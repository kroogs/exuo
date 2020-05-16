/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Justin Krueger */

import {
  types as t,
  getType,
  getSnapshot,
  IAnyModelType,
  isType,
} from 'mobx-state-tree'
import { Graph, edgeMapFactory, nodeFactory, graphFactory } from '../graph'
import Label from '../models/Label'

describe('#edgeMapFactory', () => {
  const Item = t.compose(
    edgeMapFactory((): IAnyModelType => Item),
    t.model({ id: t.identifier }),
  )

  const Container = t.model({
    items: t.map(Item),
  })

  test('#addEdge stores a tagged reference to a target', () => {
    const box = Container.create({
      items: {
        one: { id: 'one' },
        two: { id: 'two' },
      },
    })

    const one = box.items.get('one')
    const two = box.items.get('two')

    one.addEdge('next', two)
    two.addEdge('prev', one)

    expect(getSnapshot(box)).toStrictEqual({
      items: {
        one: { id: 'one', edgeMap: { next: ['two'] } },
        two: { id: 'two', edgeMap: { prev: ['one'] } },
      },
    })
  })

  test('#hasEdge returns a boolean indicating whether a stored tagged reference exists', () => {
    const box = Container.create({
      items: {
        one: { id: 'one', edgeMap: { next: ['two'] } },
        two: { id: 'two' },
      },
    })

    const one = box.items.get('one')
    const two = box.items.get('two')

    expect(one.hasEdge('next', two)).toBe(true)
    expect(two.hasEdge('prev', one)).toBe(false)
  })

  test('#getEdgeTag returns an array of instances by tag', () => {
    const box = Container.create({
      items: {
        one: { id: 'one', edgeMap: { next: ['one', 'two'] } },
        two: { id: 'two' },
      },
    })

    const one = box.items.get('one')
    const two = box.items.get('two')

    expect(one.getEdgeTag('next')).toStrictEqual([one, two])
    expect(one.getEdgeTag('none')).toBe(undefined)
  })

  describe('#removeTest', () => {
    test('removes the first stored tagged reference to a target', () => {
      const box = Container.create({
        items: {
          one: { id: 'one', edgeMap: { next: ['two'] } },
          two: { id: 'two', edgeMap: { prev: ['one'] } },
        },
      })

      const one = box.items.get('one')
      const two = box.items.get('two')

      one.removeEdge('next', two)

      expect(getSnapshot(box).items).toStrictEqual({
        one: { id: 'one', edgeMap: { next: [] } },
        two: { id: 'two', edgeMap: { prev: ['one'] } },
      })

      two.removeEdge('prev', one)

      expect(getSnapshot(box).items).toStrictEqual({
        one: { id: 'one', edgeMap: { next: [] } },
        two: { id: 'two', edgeMap: { prev: [] } },
      })
    })

    test("throws an exception when an edge ref isn't found", () => {
      const box = Container.create({
        items: {
          one: { id: 'one' },
        },
      })

      const one = box.items.get('one')

      expect(() => one.removeEdge('next', one)).toThrowErrorMatchingSnapshot()
    })
  })
})

test.skip('getEdgeMapModels', () => {
  return
})

describe('#nodeFactory', () => {
  test('composes models into a custom Node type', () => {
    const Custom = nodeFactory(() => Custom, [t.model({ custom: t.string })])
    expect(isType(Custom)).toBe(true)

    const keys = Object.keys(Custom.properties)
    expect(keys).toContain('edgeMap')
    expect(keys).toContain('custom')
    expect(keys).toContain('id')
  })
})

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
