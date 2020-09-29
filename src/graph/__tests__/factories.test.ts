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

import {
  types as t,
  getType,
  getSnapshot,
  IAnyModelType,
  isType,
} from 'mobx-state-tree'

import { nodeFactory, edgeMapFactory, graphFactory } from '../models/factories'

describe('graph', () => {
  describe('#nodeFactory', () => {
    test('composes models into a custom Node type', () => {
      const Custom = nodeFactory([
        edgeMapFactory(() => Custom),
        t.model({ custom: t.string }),
      ])

      expect(isType(Custom)).toBe(true)

      const keys = Object.keys(Custom.properties)

      expect(keys).toContain('edgeMap')
      expect(keys).toContain('custom')
      expect(keys).toContain('id')
    })
  })

  describe('#edgeMapFactory', () => {
    const Item = t.compose(
      t.model({
        id: t.identifier,
      }),
      edgeMapFactory((): IAnyModelType => Item),
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

      one?.addEdge('next', two)
      two?.addEdge('prev', one)

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

    describe('#removeEdge', () => {
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
    })
  })

  describe('#graphFactory', () => {
    test('supports a custom base Node model', () => {
      const Node = nodeFactory([
        t.model({ custom: t.string }),
        edgeMapFactory(() => Node),
      ])
      const Graph = graphFactory({ Node })
      expect(
        getSnapshot(
          Graph.create({
            Node: { one: { id: 'one', custom: 'one' } },
          }),
        ),
      ).toStrictEqual({
        Node: { one: { id: 'one', custom: 'one', edgeMap: {} } },
      })
    })

    test('supports relationships with custom models', () => {
      const Text = t.model({ text: t.string })
      const Node = nodeFactory(edgeMapFactory(() => t.union(Node, TextNode)))
      const TextNode = nodeFactory([
        Text,
        edgeMapFactory(() => t.union(Node, TextNode)),
      ])
      const Graph = graphFactory({ Node, Text: TextNode })

      const graph = Graph.create()
      const one = graph.createNode()
      const two = graph.createNode()

      two.addEdge('side', one)
      expect(graph.Node.get(two.id).edgeMap.get('side')?.[0]).toBe(one)

      const potato = graph.createNode('Text', { text: 'potato' })
      one.addEdge('item', potato)
      expect(graph.Node.get(one.id).edgeMap.get('item')?.[0]).toBe(potato)

      potato.addEdge('inside', potato)
      expect(potato.edgeMap.get('inside')?.[0]).toBe(potato)
    })
  })
})
