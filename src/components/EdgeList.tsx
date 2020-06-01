/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Ty Dira */

import React from 'react'
import {
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  ListItemIcon,
  Divider,
} from '@material-ui/core'
import * as icons from '@material-ui/icons'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useObserver } from 'mobx-react-lite'
import { IAnyModelType, IAnyStateTreeNode, Instance } from 'mobx-state-tree'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    listSection: {},
    listItem: {},
    itemText: { margin: 0 },
    group: { padding: 0 },
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

const EdgeList: React.FunctionComponent<EdgeListProps> = ({ node }) => {
  const classes = useStyles()
  const [selectedId, setSelectedId] = React.useState('')

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: string,
  ): void => {
    setSelectedId(id)
  }

  return useObserver(() => {
    const edgeKeys = Array.from(node.edgeMap.keys())

    return (
      <>
        <List disablePadding aria-label="edge list" subheader={<li />}>
          {edgeKeys.map(key => (
            <li key={`edge-${key}`} className={classes.listSection}>
              <ul className={classes.group}>
                {edgeKeys.length > 1 && (
                  <ListSubheader
                    className={classes.groupHeader}
                  >{`${key}`}</ListSubheader>
                )}
                {node.edgeMap
                  .get(key)
                  ?.reverse()
                  .map((item: IAnyStateTreeNode) => (
                    <ListItem
                      dense
                      button
                      disableGutters
                      onClick={event => handleListItemClick(event, item.id)}
                      selected={selectedId === item.id}
                      key={`edge-${key}-${item.id}`}
                      className={classes.listItem}
                    >
                      <ListItemText
                        primary={item.label ?? item.id}
                        className={classes.itemText}
                      />
                    </ListItem>
                  ))}
              </ul>
            </li>
          ))}
        </List>
      </>
    )
  })
}

export default EdgeList
