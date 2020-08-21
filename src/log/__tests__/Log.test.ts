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

import { getSnapshot } from 'mobx-state-tree'

import { Log } from '../'

describe('Log', () => {
  describe('#logEvent', () => {
    it('creates and stores an Event', () => {
      const now = Date.now()
      const spy = jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() => now)

      const item = Log.create()

      item.logEvent({ type: 'thing' })
      expect(getSnapshot(item).eventLog.thing[0]).toStrictEqual({
        type: 'thing',
        message: undefined,
        date: now,
      })

      spy.mockClear()
    })
  })
})