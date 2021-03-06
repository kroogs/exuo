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
import { List } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { IAnyModelType, Instance } from 'mobx-state-tree'

import { useGraph } from 'exuo/src/graph'
import { NodeListItem } from './NodeListItem'
import { Node } from '../models/Node'

interface DragItem {
  type: string
  index: number
  path: string
  parentNode: Instance<typeof Node>
  childNode: Instance<typeof Node>
}

interface EdgeListProps {
  node: Instance<IAnyModelType>
  edgeTag: string
  outer?: boolean
  className?: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      padding: 0,

      '&.outer': {
        borderBottom: `.1px solid ${theme.palette.divider}`,

        '& > li:first-child': {
          border: 0,
        },
      },
    },
  }),
)

export const EdgeList: React.FunctionComponent<EdgeListProps> = observer(
  ({ node, edgeTag, outer, className }) => {
    const classes = useStyles()
    const edges = node.edgeMap.get(edgeTag)
    const graph = useGraph()
    const modes = graph.activeModes

    /* const [hasAnchor, setHasAnchor] = React.useState(true) */

    /* React.useEffect(() => { */
    /*   if (hasAnchor) { */
    /*     window.scroll({ top: document.body.scrollHeight, behavior: 'smooth' }) */
    /*   } */
    /* }, [hasAnchor]) */

    const moveItem = React.useCallback(
      (item: DragItem, dragIndex: number, hoverIndex: number): void => {
        item.parentNode.reorderEdge(
          'child',
          item.childNode,
          hoverIndex,
          dragIndex,
        )
      },
      [],
    )

    return edges?.length ? (
      <List
        aria-label="edge list"
        className={[
          classes.list,
          outer ? 'outer' : null,
          outer && modes.includes('edit') ? 'editMode' : null,
          outer && modes.includes('select') ? 'selectMode' : null,
          className,
        ].join(' ')}
      >
        {edges.map((item: Instance<typeof Node>, index: number) => (
          <NodeListItem
            key={`${node.id}-${edgeTag}-${item.id}`}
            index={index}
            node={item}
            parentNode={node}
            moveItem={moveItem}
          />
        ))}
      </List>
    ) : null
  },
)
