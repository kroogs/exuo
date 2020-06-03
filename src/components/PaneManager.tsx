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
    root: {},
    paneHeader: {},
    paneBody: {
      overflowY: 'auto',
    },
    pane: {
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '100vh',
      minWidth: '200px',
    },
    rootPane: {
      position: 'sticky',
      left: 0,
      zIndex: 9,
      overflowY: 'auto',
      maxHeight: '100vh',
      minWidth: '200px',
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

    const rootNode = graph.Node.get(rootNodeId)
    const selectedNodeId = rootNode
      .getEdgeTag('config')?.[0]
      ?.items.get('selectedNodeId')

    let nodes = [rootNode]

    if (selectedNodeId) {
      nodes = nodes.concat()
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

    const makeAddItemHandler: MakeAddItemHandler = parent => snapshot => {
      const child = graph.createNode('Node', snapshot)
      parent.addEdge('child', child)
      child.addEdge('parent', parent)
    }

    // don't do nodes.map; recurse on selectedNodeId

    return (
      <Grid className={classes.root} container>
        {nodes.map((node, i) => (
          <Grid
            item
            key={node.id}
            className={i === 0 ? classes.rootPane : classes.pane}
          >
            <div className={classes.paneHeader}>
              <Typography variant="h5">{node.label}</Typography>
              <AddItem onSubmit={makeAddItemHandler(node)} />
            </div>
            <EdgeList
              node={node}
              onSelect={selectNodeHandler}
              mapKeyFilter={['config']}
              className={classes.paneBody}
            />
          </Grid>
        ))}
      </Grid>
    )
  })
}

export default PaneManager
