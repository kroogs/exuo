/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Justin Krueger */

import {
  types as t,
  getSnapshot,
  getType,
  IAnyModelType,
  Instance,
} from 'mobx-state-tree'

export function applyModel<M extends IAnyModelType, C extends IAnyModelType>(
  model: M,
  instance: Instance<C>,
): Instance<M> {
  return t.compose(getType(instance) as C, model).create(getSnapshot(instance))
}
