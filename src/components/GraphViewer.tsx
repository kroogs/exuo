/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Ty Dira */

import React from 'react'
import { Box, Input, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useObserver } from 'mobx-react-lite'
import { Instance } from 'mobx-state-tree'

import { Graph, Node, useStore } from 'store'
import EdgeList from './EdgeList'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
    },
  }),
)

const GraphViewer: React.FunctionComponent = () => {
  const classes = useStyles()

  return useStore(graph => {
    const rootNodeId = graph.Config.get('graph').items.get('rootNodeId')
    const rootNode = graph.Node.get(rootNodeId)

    return <Box className={classes.root}>rootregion</Box>
  })
}

export default GraphViewer
