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
