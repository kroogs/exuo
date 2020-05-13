/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Justin Krueger */

import { types } from 'mobx-state-tree'

import Graph from './Graph'

export const System = types.model('System', {
  graph: Graph,
})

export default System
