/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Ty Dira */

import React from 'react'
import { IAnyStateTreeNode, getMembers, isStateTreeNode } from 'mobx-state-tree'
import { useObserver } from 'mobx-react-lite'

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.default,
    },
  }),
)

interface PropertyListProps {
  model: IAnyStateTreeNode | null
  options?: Partial<{
    groupBy: null
  }>
}

export const PropertyList: React.FunctionComponent<PropertyListProps> = props => {
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
          <ListItem key={value} role={undefined} dense button>
            <ListItemText id={`list-label-${value}`} primary={value} />
          </ListItem>
        ))}
      </List>
    )
  })
}

export default PropertyList
