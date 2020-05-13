/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Justin Krueger */

import React from 'react'
import { shallow } from 'enzyme'
import { types } from 'mobx-state-tree'

import Node from 'store/models/Node'
import Label from 'store/models/Label'
import PropertyList from '../PropertyList'

test('Renders a list of properties', () => {
  const model = types.compose(Node, Label).create({
    id: 'fruit',
    label: 'Fruit!',
  })

  expect(shallow(<PropertyList model={model} />)).toMatchSnapshot()
})
