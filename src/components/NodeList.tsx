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
import { List, ListItem, ListItemText } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useObserver } from 'mobx-react-lite'
import { IAnyModelType, IAnyStateTreeNode, Instance } from 'mobx-state-tree'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    listSection: {},
    listItem: {},
    itemText: { margin: 0 },
    group: { padding: theme.spacing(0) },
    groupHeader: {
      color: 'inherit',
      fontWeight: 'bold',
      lineHeight: 2,
    },
  }),
)

interface NodeListProps {
  nodes: Array<Instance<IAnyModelType>>
  onSelect: React.MouseEventHandler
}

const getLabel = (item: IAnyStateTreeNode): string => item.label ?? item.id

const NodeList: React.FunctionComponent<NodeListProps> = ({
  nodes,
  onSelect,
}) => {
  const classes = useStyles()

  return useObserver(() => {
    return (
      <List className={classes.root} dense disablePadding>
        {nodes.map(node => (
          <ListItem
            key={`node-${node.id}`}
            className={classes.listItem}
            button
            dense
            disableGutters
            onClick={() => onSelect(node)}
          >
            <ListItemText
              className={classes.itemText}
              primary={getLabel(node)}
            />
          </ListItem>
        ))}
      </List>
    )
  })
}

export default NodeList
