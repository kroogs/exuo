/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Ty Dira */

import React from 'react'
import { Box, Input, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useObserver } from 'mobx-react-lite'
import { Instance } from 'mobx-state-tree'

import { Graph } from 'store'
import { NodeList } from './NodeList'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
    },
    pane: {
      overflowY: 'auto',
      maxHeight: '100vh',
      flexDirection: 'column',
      position: 'relative',
    },
    addItem: {
      top: 0,
      position: 'sticky',
      zIndex: 9,
      backgroundColor: theme.palette.background.default,
    },
    title: {},
  }),
)

interface RootRegionProps {
  graph: Instance<typeof Graph>
}

export const RootRegion: React.FunctionComponent<RootRegionProps> = ({
  graph,
}) => {
  const classes = useStyles()
  const [createText, setCreateText] = React.useState<null | string>(null)

  return useObserver(() => {
    if (!graph) {
      throw Error('no graph!')
    }

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
      event.preventDefault()
      if (createText) {
        graph.createNode('Node', { label: createText })
        setCreateText(null)
      }
    }

    const nodes = Array.from(graph.nodesById.values()).reverse()

    return (
      <div className={classes.root}>
        <Box className={classes.pane}>
          <Box className={classes.addItem}>
            <Typography className={classes.title} variant="h5">
              Nodes
            </Typography>
            <form onSubmit={handleSubmit} noValidate autoComplete="off">
              <Input
                onChange={e => setCreateText(e.target.value)}
                placeholder="Create Item"
              />
            </form>
          </Box>

          <NodeList nodes={nodes} />
        </Box>
      </div>
    )
  })
}

export default RootRegion
