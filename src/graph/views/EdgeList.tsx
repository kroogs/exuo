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
import { List } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { IAnyModelType, Instance } from 'mobx-state-tree'

import { useGraph } from '../useGraph'
import { NodeListItem } from './NodeListItem'
import { Node } from '../models/Node'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      padding: 0,
      '&>li': {
        borderTop: `.01px solid ${theme.palette.divider}`,
      },

      '&.outer>li:first-child': {
        borderTop: 'unset',
      },
    },
  }),
)

interface EdgeListProps {
  node: Instance<IAnyModelType>
  edgeTag: string
  outer?: boolean
  className?: string
}

export const EdgeList: React.FunctionComponent<EdgeListProps> = ({
  node,
  edgeTag,
  outer,
  className,
}) => {
  const classes = useStyles()
  return useGraph(graph => (
    <List
      aria-label="edge list"
      className={[classes.list, outer ? 'outer' : '', className].join(' ')}
    >
      {node.edgeMap.get(edgeTag)?.map((item: Instance<typeof Node>) => (
        <NodeListItem
          node={item}
          parentNode={node}
          key={`${node.id}-${edgeTag}-${item.id}`}
        />
      ))}
    </List>
  ))
}
