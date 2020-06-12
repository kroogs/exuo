/*
 * Copyright © 2020 Ty Dira <ty@dira.dev>
 *
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
import { Instance } from 'mobx-state-tree'

import { useGraph, Node } from 'graph'
import ActionBar from './ActionBar'
import EdgeList from './EdgeList'

const NodeBrowser: React.FunctionComponent = () => {
  return useGraph(graph => {
    const rootConfig = graph.Config.get('graph')
    const rootNodeId = rootConfig?.get('rootNodeId')
    const rootNode = graph.Node.get(rootNodeId)

    if (!rootNode) {
      return <></> // Loading
    }

    const history = rootConfig.items.get('history')
    let currentNode = graph.Node.get(history[history.length - 1])

    /* const activeNode = graph.getActiveNode() */

    if (!currentNode) {
      currentNode = rootNode
    }

    const selectNodeHandler = (
      event: React.SyntheticEvent,
      parent: Instance<typeof Node>,
      selected: Instance<typeof Node>,
    ): void => {
      graph.historyPush(selected.id)
    }

    return (
      <>
        <ActionBar node={currentNode} />
        <EdgeList node={currentNode} tag="child" onSelect={selectNodeHandler} />
      </>
    )
  })
}

export default NodeBrowser
