/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Ty Dira */

import React from 'react'
import { Grid, TextField, Box, Input, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useObserver } from 'mobx-react-lite'
import { Instance } from 'mobx-state-tree'

import { Graph, Node } from 'store'
import EdgeList from './EdgeList'
import CreateNode from './CreateNode'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pane: {
      overflowY: 'auto',
      maxHeight: '100vh',
      position: 'relative',
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
    addItem: {
      position: 'sticky',
      top: 0,
      zIndex: 9,
    },
    heading: {},
  }),
)

type MakeCreateHandler = (
  p: Instance<typeof Node>,
) => (c: Instance<typeof Node>) => void

interface PaneManagerProps {
  nodes: Array<Instance<typeof Node>>
}

const PaneManager: React.FunctionComponent<PaneManagerProps> = ({ nodes }) => {
  const classes = useStyles()

  const makeCreateHandler: MakeCreateHandler = parent => child => {
    parent.addEdge('child', child)
    child.addEdge('parent', parent)
  }

  return useObserver(() => {
    console.log('PaneManager render')
    return (
      <Grid container spacing={0}>
        {nodes.map(node => (
          <Grid item key={node.id}>
            <Typography className={classes.heading} variant="h5">
              {node.label}
            </Typography>
            <CreateNode onCreate={makeCreateHandler(node)} />
            <EdgeList node={node} />
          </Grid>
        ))}
      </Grid>
    )
  })
}

export default PaneManager
