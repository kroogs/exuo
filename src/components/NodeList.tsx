/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Ty Dira */

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
