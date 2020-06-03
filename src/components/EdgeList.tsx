/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Ty Dira */

import React from 'react'
import { List, ListItem, ListItemText, ListSubheader } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { IAnyModelType, Instance } from 'mobx-state-tree'
import { useObserver } from 'mobx-react-lite'

import { Node } from 'store'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listSection: {},
    listItem: {},
    itemText: { margin: 0 },
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
  mapKeyFilter?: Array<string>
  className?: string
}

const EdgeList: React.FunctionComponent<EdgeListProps> = ({
  node,
  onSelect,
  mapKeyFilter,
  className,
}) => {
  const classes = useStyles()

  return useObserver(() => {
    const config = node.getEdgeTag('config')?.[0]
    let edgeKeys = Array.from(node.edgeMap.keys())

    if (mapKeyFilter) {
      edgeKeys = edgeKeys.filter(key => mapKeyFilter.indexOf(key as string))
    }

    return (
      <>
        <List
          disablePadding
          aria-label="edge list"
          subheader={<li />}
          className={className}
        >
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
                      dense
                      button
                      disableGutters
                      onClick={() => onSelect(node, item)}
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
