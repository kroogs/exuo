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
