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
import { Link } from '@reach/router'
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@material-ui/core'
import { Clear } from '@material-ui/icons'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { IAnyModelType, Instance } from 'mobx-state-tree'

import { Node, useGraph } from 'graph'
import AddItem from './AddItem'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {},
    listItem: {
      padding: theme.spacing(2),
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    itemText: {
      display: 'inline-block',
      margin: 0,
      overflowX: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      ...theme.typography.body1,
    },
    secondaryActions: {
      color: theme.palette.text.secondary,
    },
    addItem: {
      position: 'sticky',
      bottom: 0,
      marginTop: -theme.spacing(1),
      ...theme.typography.body1,
    },
    deleteButton: {
      color: theme.palette.error.main,
    },
  }),
)

interface EdgeListProps {
  node: Instance<IAnyModelType>
  tag: string
  className?: string
}

const EdgeList: React.FunctionComponent<EdgeListProps> = ({
  node,
  tag,
  className,
}) => {
  const classes = useStyles()
  return useGraph(graph => (
    <>
      <List aria-label="edge list" className={classes.list}>
        {node.edgeMap.get(tag)?.map((item: Instance<typeof Node>) => (
          <ListItem
            button
            to={`/${item.id}`}
            key={`${tag}-${item.id}`}
            component={Link}
            className={classes.listItem}
          >
            <ListItemText
              primary={item.label ?? item.id}
              className={classes.itemText}
            />
            <ListItemSecondaryAction className={classes.secondaryActions}>
              {item.childCount}
              {graph.editMode && (
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => graph.deleteNode(item)}
                  className={classes.deleteButton}
                >
                  <Clear fontSize="small" />
                </IconButton>
              )}
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <AddItem node={node} className={classes.addItem} />
    </>
  ))
}

export default EdgeList
