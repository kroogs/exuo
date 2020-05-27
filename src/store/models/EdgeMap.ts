/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Ty Dira */

import { IAnyModelType, IAnyType, Instance, types } from 'mobx-state-tree'

type EdgeTypeFn = () => IAnyType

export const edgeMapFactory = (getEdgeType: EdgeTypeFn): IAnyModelType =>
  types
    .model('EdgeMap', {
      edgeMap: types.map(types.array(types.reference(types.late(getEdgeType)))),
    })
    .actions(self => ({
      hasEdge(tag: string, target: Instance<IAnyModelType>): boolean {
        return Boolean(self.edgeMap.get(tag)?.includes(target))
      },
    }))
    .actions(self => ({
      addEdge(tag: string, target: Instance<IAnyModelType>): void {
        if (!self.edgeMap.has(tag)) {
          self.edgeMap.set(tag, [])
        }

        self.edgeMap.get(tag)?.push(target)
      },

      getEdgeTag(tag: string): void | Array<Instance<IAnyModelType>> {
        return self.edgeMap.get(tag)
      },

      removeEdge(tag: string, target: Instance<IAnyModelType>): void {
        if (!self.hasEdge(tag, target)) {
          throw Error(`Node '${self}' has no '${tag}' edge for '${target}'`)
        }

        self.edgeMap.get(tag)?.remove(target)
      },
    }))

// export const getEdgeMapModels = (): void => {
//   return
// }
