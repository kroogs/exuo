/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Ty Dira */

import { Label } from '../Label'

describe('Label', () => {
  it('#setLabel sets the #label property', () => {
    const x = Label.create()
    x.setLabel('ten')
    expect(x.label).toBe('ten')
  })
})
