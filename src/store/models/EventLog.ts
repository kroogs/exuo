/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Justin Krueger */

import { types as t, SnapshotIn } from 'mobx-state-tree'

export const Event = t.model('Event', {
  type: t.string,
  date: t.Date,
  message: t.maybe(t.string),
})

export type EventLogOptions = Omit<SnapshotIn<typeof Event>, 'date'> & {
  replace?: boolean
}

export const Log = t
  .model('EventLog', {
    eventLog: t.map(t.array(Event)),
  })
  .actions(self => ({
    logEvent(options: EventLogOptions | Array<EventLogOptions>) {
      const allOptions = Array.isArray(options) ? options : [options]
      allOptions.forEach(item => {
        if (!self.eventLog.get(item.type)) {
          self.eventLog.set(item.type, [])
        }

        self.eventLog.get(item.type)?.push(
          Event.create({
            ...item,
            date: Date.now(),
          }),
        )
      })
    },
  }))

export default Log
