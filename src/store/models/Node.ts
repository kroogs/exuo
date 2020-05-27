/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Ty Dira */

import { IAnyModelType, IAnyType, types as t } from 'mobx-state-tree'

import { edgeMapFactory } from './EdgeMap'

type EdgeTypeFn = () => IAnyType

export const nodeFactory = (
  getEdgeType: EdgeTypeFn,
  composeModels: Array<IAnyModelType | EdgeTypeFn> = [],
): IAnyModelType =>
  t
    .compose(
      // @ts-ignore
      ...[
        edgeMapFactory,
        ...composeModels,
        t.model({
          id: t.identifier,
        }),
      ].map(item => (typeof item === 'function' ? item(getEdgeType) : item)),
    )
    .named('Node') // TODO composed names? ("Node+Label+Banana"?)

export const Node = nodeFactory(() => Node)
