/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Ty Dira */

import { getSnapshot } from 'mobx-state-tree'

import Config from '../Config'

describe('Config', () => {
  describe('#set', () => {
    it('sets #items key to a given value', () => {
      const config = Config.create()

      config.set('one', true)
      config.set('two', ['three', 3])
      config.set('three', [['four', 4], 5])

      expect(getSnapshot(config)).toStrictEqual({
        name: undefined,
        items: {
          one: true,
          two: ['three', 3],
          three: [['four', 4], 5],
        },
      })
    })
  })
})
