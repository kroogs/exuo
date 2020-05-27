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

// test.skip('getEdgeMapModels', () => {
//   return
// })
