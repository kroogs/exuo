/*
 * Copyright © 2020 Ty Dira <ty@dira.dev>

 * This file is part of Exuo.

 * Exuo is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * Exuo is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.

 * You should have received a copy of the GNU Affero General Public License
 * along with Exuo.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from 'react'
import { observer } from 'mobx-react-lite'

import { NodeLayout, EdgeList } from 'exuo/src/graph'

import { useStore } from 'exuo/src/store'

interface InstanceViewerProps {
  id?: string
  type?: string
}

export const InstanceViewer: React.FunctionComponent<InstanceViewerProps> = observer(
  ({ id, type }) => {
    const store = useStore()
    const node = store.graph.Node.get(id)
    let instance = store.graph.rootNode

    if (node) {
      instance = node
    }

    return instance ? (
      <NodeLayout node={instance}>
        <EdgeList node={instance} edgeTag="child" />
      </NodeLayout>
    ) : null
  },
)
