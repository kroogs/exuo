/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Ty Dira */

import { getSnapshot } from 'mobx-state-tree'

import EventLog from '../EventLog'

describe('EventLog', () => {
  describe('#logEvent', () => {
    it('creates and stores an Event', () => {
      const now = Date.now()
      const spy = jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() => now)

      const item = EventLog.create()

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
