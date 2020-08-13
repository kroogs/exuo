/*
 * Copyright © 2020 Ty Dira <ty@dira.dev>

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
import { getMembers, Instance, isStateTreeNode } from 'mobx-state-tree'

import { useGraph, Node } from 'graph'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    item: {},
    itemText: {},
  }),
)

interface PropertyEditorProps {
  node?: Instance<typeof Node> | string
  propName?: string
  minimal?: boolean
}

export const PropertyEditor: React.FunctionComponent<PropertyEditorProps> = props => {
  const classes = useStyles()

  return useGraph(graph => {
    let node = props.node
    if (typeof node === 'string') {
      node = graph.Node.get(props.node)
    }

    if (!isStateTreeNode(node)) {
      return <></> // Loading
    }

    const members = getMembers(node)
    const properties = Object.keys(members.properties)

    const handleSubmit: React.EventHandler<React.SyntheticEvent> = () => {
      console.log('submit')
    }

    return (
      <form onSubmit={handleSubmit}>
        <List className={classes.root}>
          {properties.map(value => (
            <ListItem dense button key={value} className={classes.item}>
              <ListItemText
                primary={value}
                id={`list-label-${value}`}
                className={classes.itemText}
              />
            </ListItem>
          ))}
        </List>
      </form>
    )
  })
}
