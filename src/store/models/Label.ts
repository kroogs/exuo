/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Justin Krueger */

import { types as t } from 'mobx-state-tree'

export const Label = t
  .model('Label', {
    label: t.maybe(t.string),
  })
  .actions(self => ({
    setLabel(label: string) {
      self.label = label
    },
  }))

export default Label
