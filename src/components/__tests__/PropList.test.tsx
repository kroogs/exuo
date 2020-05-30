/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Ty Dira */

import React from 'react'
import { shallow } from 'enzyme'
import { types as t } from 'mobx-state-tree'

import PropList from '../PropList'

test('Renders a list of properties', () => {
  const Model = t.model({
    one: t.number,
    two: t.string,
    three: t.boolean,
  })

  const instance = Model.create({
    one: 100,
    two: 'graphs',
    three: true,
  })

  expect(shallow(<PropList model={instance} />)).toMatchSnapshot()
})
