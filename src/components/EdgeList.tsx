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
import { List, ClickAwayListener } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { IAnyModelType, Instance } from 'mobx-state-tree'

import { Node, useGraph } from 'graph'
import LabelEditor from './LabelEditor'
import NodeListItem from './NodeListItem'
import NodeActions from './NodeActions'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {},
    addItem: {},
    stickyActions: {
      position: 'sticky',
      bottom: 0,
      marginTop: -theme.spacing(1),
      background: theme.palette.background.default,
    },
  }),
)

interface EdgeListProps {
  node: Instance<IAnyModelType>
  edgeTag: string
  className?: string
}

const EdgeList: React.FunctionComponent<EdgeListProps> = ({
  node,
  edgeTag,
  className,
}) => {
  const classes = useStyles()

  return useGraph(graph => {
    const handleClickAway = (): void => {
      if (graph.editMode) {
        graph.toggleEditMode()
      }
    }

    return (
      <ClickAwayListener onClickAway={handleClickAway}>
        <div>
          <List aria-label="edge list" className={classes.list}>
            {node.edgeMap.get(edgeTag)?.map((item: Instance<typeof Node>) => (
              <NodeListItem node={item} key={`${edgeTag}-${item.id}`} />
            ))}
          </List>
          <div className={classes.stickyActions}>
            {graph.selectedNodes.length > -1 && graph.editMode ? (
              <NodeActions />
            ) : (
              <>
                <LabelEditor placeholder="Add item" node={node} />
              </>
            )}
          </div>
        </div>
      </ClickAwayListener>
    )
  })
}

export default EdgeList
