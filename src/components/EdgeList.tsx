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
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { IAnyModelType, Instance } from 'mobx-state-tree'
import { useObserver } from 'mobx-react-lite'

import { Node } from 'graph'
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
      margin: 0,
      '& > .MuiListItemText-primary': {
        overflowX: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
      },
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
  }),
)

type SelectHandler = (selected: Instance<typeof Node>) => void

interface EdgeListProps {
  node: Instance<IAnyModelType>
  tag: string
  onSelect?: SelectHandler
  className?: string
}

const EdgeList: React.FunctionComponent<EdgeListProps> = ({
  node,
  onSelect,
  tag,
  className,
}) => {
  const classes = useStyles()
  return useObserver(() => (
    <>
      <List aria-label="edge list" className={classes.list}>
        {node.edgeMap.get(tag)?.map((item: Instance<typeof Node>) => (
          <ListItem
            button
            onClick={e => onSelect?.(item)}
            key={`${tag}-${item.id}`}
            className={classes.listItem}
          >
            <ListItemText
              primary={item.label ?? item.id}
              className={classes.itemText}
            />
            <ListItemSecondaryAction className={classes.secondaryActions}>
              {item.childCount}
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <AddItem node={node} className={classes.addItem} />
    </>
  ))
}

export default EdgeList
