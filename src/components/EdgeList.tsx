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
import { List, ListItem, ListItemText, ListSubheader } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { IAnyModelType, Instance } from 'mobx-state-tree'
import { useObserver } from 'mobx-react-lite'

import { Node } from 'store'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listSection: {},
    listItem: {
      marginBottom: '1px',
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      borderRadius: theme.shape.borderRadius,
    },
    itemText: {
      margin: 0,
      '& > .MuiListItemText-primary': {
        overflowX: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
      },
    },
    group: { padding: 0 },
    groupHeader: {
      top: 0,
      position: 'sticky',
      fontWeight: 'bold',
      lineHeight: 2.5,
      backgroundColor: theme.palette.background.default,
    },
  }),
)

interface EdgeListProps {
  node: Instance<IAnyModelType>
  onSelect: (
    parent: Instance<typeof Node>,
    selected: Instance<typeof Node>,
  ) => void
  excludeMapKeys?: Array<string>
  className?: string
}

const EdgeList: React.FunctionComponent<EdgeListProps> = ({
  node,
  onSelect,
  excludeMapKeys,
  className,
}) => {
  const classes = useStyles()

  return useObserver(() => {
    const config = node.getEdgeTag('config')?.[0]
    let edgeKeys = Array.from(node.edgeMap.keys())

    if (excludeMapKeys) {
      edgeKeys = edgeKeys.filter(key => !excludeMapKeys.includes(key as string))
    }

    return (
      <>
        <List aria-label="edge list" subheader={<li />} className={className}>
          {edgeKeys.map(key => (
            <li key={`edge-${key}`} className={classes.listSection}>
              <ul className={classes.group}>
                {edgeKeys.length > 1 && (
                  <ListSubheader
                    disableGutters
                    className={classes.groupHeader}
                  >{`${key}`}</ListSubheader>
                )}
                {node.edgeMap
                  .get(key)
                  ?.slice()
                  .reverse()
                  .map((item: Instance<typeof Node>) => (
                    <ListItem
                      button
                      dense
                      disableGutters
                      onClick={() => onSelect(node, item)}
                      onDoubleClick={() => console.log('boop')}
                      selected={
                        config && config.items.get('selectedNodeId') === item.id
                      }
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
