/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Ty Dira */

import React from 'react'
import { IAnyModelType, Instance, IAnyStateTreeNode } from 'mobx-state-tree'
import { useObserver } from 'mobx-react-lite'

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    section: {
      color: 'inherit',
      fontWeight: 'bold',
    },
    listSection: {},
    listItem: {},
    ul: {},
  }),
)

interface EdgeListProps {
  node: Instance<IAnyModelType>
}

export const EdgeList: React.FunctionComponent<EdgeListProps> = ({ node }) => {
  const classes = useStyles()

  return useObserver(() => {
    const edgeKeys = Array.from(node.edgeMap.keys())
    return (
      <List className={classes.root} subheader={<li />}>
        {edgeKeys.map(key => (
          <li key={`edge-${key}`} className={classes.listSection}>
            <ul className={classes.ul}>
              <ListSubheader
                className={classes.section}
              >{`${key}`}</ListSubheader>
              {node.edgeMap.get(key)?.map((item: IAnyStateTreeNode) => (
                <ListItem
                  className={classes.listItem}
                  key={`edge-${key}-${item.id}`}
                >
                  <ListItemText primary={item.label ?? item.id} />
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
