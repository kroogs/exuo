/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Justin Krueger */

import React from 'react'

import {
  IAnyStateTreeNode,
  getMembers,
  getType,
  getChildType,
  isType,
  isMapType,
  isLateType,
  isArrayType,
  isModelType,
} from 'mobx-state-tree'
import { useObserver } from 'mobx-react-lite'

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
  }),
)

interface EdgeListProps {
  model: IAnyStateTreeNode
}

export const EdgeList: React.FunctionComponent<EdgeListProps> = props => {
  const classes = useStyles()
  return useObserver(() => {
    const modelMembers = getMembers(props.model)
    const edges: Array<string> = []

    console.log('props', props)
    Object.keys(modelMembers.properties).forEach(name => {
      // TODO uhhh? some kind of error going on here idk
      /* if (!isType(props.model[name])) { */
      /*   /1* console.log('thefk', props.model[name]) *1/ */
      /*   return */
      /* } */

      const propType = getType(props.model[name])
      const childType = getChildType(props.model[name])

      console.log('property', name, propType)

      if (isModelType(propType) || isModelType(childType)) {
        if (isArrayType(propType)) {
          edges.push(name)
        } else if (isMapType(propType)) {
          edges.push(name)
        } else if (isLateType(propType)) {
          edges.push(name)
        }
      }
    })

    return (
      <>
        <span>Edge List</span>
        <List className={classes.root}>
          {edges.map(value => (
            <ListItem key={value} role={undefined} dense button>
              <ListItemText id={`list-label-${value}`} primary={value} />
            </ListItem>
          ))}
        </List>
      </>
    )
  })
}

export default EdgeList
