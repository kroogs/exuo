/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Ty Dira */

import React from 'react'
import { List, ListItem, ListItemText, ListSubheader } from '@material-ui/core'
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

interface EdgeListProps {
  node: Instance<IAnyModelType>
  onSelect?: React.MouseEventHandler
}

const getLabel = (item: IAnyStateTreeNode): string => item.label ?? item.id

const EdgeList: React.FunctionComponent<EdgeListProps> = ({ node }) => {
  const classes = useStyles()

  return useObserver(() => {
    const edgeKeys = Array.from(node.edgeMap.keys())
    return (
      <List className={classes.root} dense disablePadding subheader={<li />}>
        {edgeKeys.map(key => (
          <li key={`edge-${key}`} className={classes.listSection}>
            <ul className={classes.group}>
              {edgeKeys.length > 1 && (
                <ListSubheader
                  disableGutters
                  className={classes.groupHeader}
                >{`${key}`}</ListSubheader>
              )}
              {node.edgeMap.get(key)?.map((item: IAnyStateTreeNode) => (
                <ListItem
                  dense
                  disableGutters
                  key={`edge-${key}-${item.id}`}
                  className={classes.listItem}
                >
                  <ListItemText
                    primary={getLabel(item)}
                    className={classes.itemText}
                  />
                </ListItem>
              ))}
            </ul>
          </li>
        ))}
      </List>
    )
  })
}

export default EdgeList
