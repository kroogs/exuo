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
      height: '100vh',
    },
    paneHeader: {},
    paneHeaderText: {
      overflowX: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
    paneBody: {
      overflowY: 'auto',
    },
    pane: {
      maxHeight: '100%',
      padding: theme.spacing(1),
    },
    rootPane: {
      backgroundColor: theme.palette.background.default,
    },
    selectedPane: {
      '& .Mui-selected': {
        backgroundColor: theme.palette.primary.main,
        '&:hover': {
          backgroundColor: theme.palette.primary.light,
        },
      },
    },
    contentPane: {},
  }),
)

type MakeAddItemHandler = (
  p: Instance<typeof Node>,
) => (s: SnapshotIn<typeof Node>) => void

const PaneManager: React.FunctionComponent = () => {
  const classes = useStyles()

  return useStore(graph => {
    const rootConfig = graph.Config.get('graph')
    const rootNodeId = rootConfig?.get('rootNodeId')
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

      rootConfig.set('selectedPaneNodeId', parent.id)
      config.set('selectedNodeId', selected.id)
    }

    const rootNode = graph.Node.get(rootNodeId)
    const nodes = [rootNode]
    let currentNode = rootNode

    for (let i = 0; i < 2; i++) {
      const selectedNodeId = currentNode
        .getEdgeTag('config')?.[0]
        ?.items.get('selectedNodeId')

      if (!selectedNodeId) {
        break
      }

      currentNode = graph.Node.get(selectedNodeId)
      nodes.push(currentNode)
    }

    const selectedPaneNodeId = rootConfig.get('selectedPaneNodeId')

    return (
      <Grid className={classes.root} container>
        {nodes.map((node, i) => (
          <Grid
            item
            sm={4}
            lg={2}
            key={i + node.id}
            className={[
              classes.pane,
              i === 0 ? classes.rootPane : '',
              node.id === selectedPaneNodeId ? classes.selectedPane : '',
            ].join(' ')}
          >
            <div className={classes.paneHeader}>
              <Typography className={classes.paneHeaderText} variant="h5">
                {node.label}
              </Typography>
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
        <Grid
          item
          sm={12}
          lg={6}
          className={[classes.pane, classes.contentPane].join(' ')}
        >
          Bananas
        </Grid>
      </Grid>
    )
  })
}

export default PaneManager
