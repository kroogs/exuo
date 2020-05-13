/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Justin Krueger */

import { types as t } from 'mobx-state-tree'

const Event = t.model('Event', {
  type: t.string,
  message: t.maybeNull(t.string),
  timeStamp: t.Date,
})

export const Log = t
  .model('Log', {
    log: t.map(t.array(Event)),
  })
  .actions(self => ({
    addEvent(type: string, message?: string, timeStamp: Date = new Date()) {
      if (!self.log.has(type)) {
        self.log.set(type, [])
      }

      self.log.get(type)?.push(
        Event.create({
          type,
          message,
          timeStamp,
        }),
      )
    },
  }))

export default Log
