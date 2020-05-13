/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Justin Krueger */

import React from 'react'
import { shallow } from 'enzyme'

import RootRegion from '../RootRegion'

test.skip('Renders', () => {
  expect(shallow(<RootRegion />)).toMatchSnapshot()
})
