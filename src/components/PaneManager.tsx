/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Ty Dira */

import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Instance, SnapshotIn } from 'mobx-state-tree'

import { Node, useStore } from 'store'
import EdgeList from './EdgeList'
import AddItem from './AddItem'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      overflowX: 'auto',
      height: '100vh',
    },
    paneHeader: {},
    paneBody: {
      overflowY: 'auto',
    },
    pane: {
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '100%',
      minWidth: '200px',
      maxWidth: '350px',
    },
    rootPane: {
      backgroundColor: theme.palette.background.default,
      position: 'sticky',
      left: 0,
      zIndex: 9,
      overflowY: 'auto',
      maxHeight: '100%',
      minWidth: '200px',
      maxWidth: '350px',
    },
  }),
)

type MakeAddItemHandler = (
  p: Instance<typeof Node>,
) => (s: SnapshotIn<typeof Node>) => void

const PaneManager: React.FunctionComponent = () => {
  const classes = useStyles()

  return useStore(graph => {
    const rootNodeId = graph.Config.get('graph')?.items?.get('rootNodeId')
    if (!rootNodeId) {
      return <></> // Loading
    }

    const makeAddItemHandler: MakeAddItemHandler = parent => snapshot => {
      const child = graph.createNode('Node', snapshot)
      parent.addEdge('child', child)
      child.addEdge('parent', parent)
    }

    const selectNodeHandler = (
      parent: Instance<typeof Node>,
      selected: Instance<typeof Node>,
    ): void => {
      let config = parent.getEdgeTag('config')?.[0]

      if (!config) {
        config = graph.createNode('Config')
        parent.addEdge('config', config)
      }

      config.set('selectedNodeId', selected.id)
    }

    const rootNode = graph.Node.get(rootNodeId)
    const nodes = [rootNode]
    let currentNode = rootNode

    for (let i = 0; i < 5; i++) {
      const selectedNodeId = currentNode
        .getEdgeTag('config')?.[0]
        ?.items.get('selectedNodeId')

      if (!selectedNodeId) {
        break
      }

      currentNode = graph.Node.get(selectedNodeId)
      nodes.push(currentNode)
    }

    return (
      <Grid className={classes.root} container>
        {nodes.map((node, i) => (
          <Grid
            item
            key={i + node.id}
            className={i === 0 ? classes.rootPane : classes.pane}
          >
            <div className={classes.paneHeader}>
              <Typography variant="h5">{node.label}</Typography>
              <AddItem onSubmit={makeAddItemHandler(node)} />
            </div>
            <EdgeList
              node={node}
              onSelect={selectNodeHandler}
              excludeMapKeys={['config', 'parent']}
              className={classes.paneBody}
            />
          </Grid>
        ))}
      </Grid>
    )
  })
}

export default PaneManager
