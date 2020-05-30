/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Ty Dira */

import React from 'react'
import { List, ListItem, ListItemText } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useObserver } from 'mobx-react-lite'
import { getMembers, IAnyStateTreeNode, isStateTreeNode } from 'mobx-state-tree'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    item: {},
    itemText: {},
  }),
)

interface PropListProps {
  model: IAnyStateTreeNode | null
  options?: Partial<{
    groupBy: null
  }>
}

const PropList: React.FunctionComponent<PropListProps> = props => {
  const classes = useStyles()

  return useObserver(() => {
    if (!isStateTreeNode(props.model)) {
      throw Error('Invalid model')
    }

    const members = getMembers(props.model)
    const properties = Object.keys(members.properties)

    return (
      <List className={classes.root}>
        {properties.map(value => (
          <ListItem
            className={classes.item}
            key={value}
            role={undefined}
            dense
            button
          >
            <ListItemText
              className={classes.itemText}
              id={`list-label-${value}`}
              primary={value}
            />
          </ListItem>
        ))}
      </List>
    )
  })
}

export default PropList
