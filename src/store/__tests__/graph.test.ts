/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Justin Krueger */

import { types as t, getSnapshot, IAnyModelType } from 'mobx-state-tree'
import { edgeMapFactory, nodeFactory, graphFactory } from '../graph'
import Label from '../models/Label'

const Item = t.compose(
  edgeMapFactory((): IAnyModelType => Item),
  t.model({ id: t.identifier }),
)
const Container = t.model({
  items: t.map(Item),
})

describe('edgeMapFactory', () => {
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

  test('#hasEdge returns a boolean indicating a stored tagged reference exists', () => {
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

describe('graphFactory', () => {
  test('works', () => {
    const Node = nodeFactory(() => t.union(Node, LabelNode))
    const LabelNode = nodeFactory(() => t.union(Node, LabelNode), [Label])
    const GraphModel = graphFactory({ Node, LabelNode })

    const graph = GraphModel.create({ id: 'root' })

    // graph.createNode([
    //   {
    //     name: 'Test',
    //     props: [['label', 'string']],
    //   },
    // ])

    const one = graph.createNode('Node', {})
    const two = graph.createNode('Node', {})

    two.addEdge('side', one)

    expect(graph.nodesById.get(two.id).edgeMap.get('side')?.[0]).toBe(one)

    const potato = graph.createNode('LabelNode', { label: 'potato' })
    one.addEdge('item', potato)

    expect(graph.nodesById.get(one.id).edgeMap.get('item')?.[0]).toBe(potato)

    potato.addEdge('inside', potato)
    expect(potato.edgeMap.get('inside')?.[0]).toBe(potato)
  })
})
