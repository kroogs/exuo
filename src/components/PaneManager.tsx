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

const PaneManager: React.FunctionComponent = () => {
  const classes = useStyles()
  const [activeNodes, setActiveNodes] = React.useState<
    Array<Instance<typeof Node>>
  >([])

  const addActiveNode = (node: Instance<typeof Node>): void => {
    setActiveNodes([...activeNodes, node])
  }

  return useStore(graph => {
    // Pane shouldn't be here, hack
    const Pane: React.FC<{ node: Instance<typeof Node> }> = ({
      children,
      node,
    }) => {
      const [createText, setCreateText] = React.useState('')
      const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
        event.preventDefault()
        if (createText) {
          const newNode = graph.createNode('Node', { label: createText })
          node.addEdge('child', newNode)
          setCreateText('')
        }
      }

      return (
        <Box className={classes.pane}>
          <Box className={classes.addItem}>
            <Typography className={classes.heading} variant="h5">
              {node.label}
            </Typography>
            <form onSubmit={handleSubmit} noValidate autoComplete="off">
              <Input
                onChange={e => setCreateText(e.target.value)}
                value={createText}
                disableUnderline
                fullWidth
                placeholder="Create Item"
              />
            </form>
          </Box>
          {children}
        </Box>
      )
    }

    const rootNodeId = graph.Config.get('graph').items.get('rootNodeId')
    const rootNode = graph.Node.get(rootNodeId)

    console.log('PaneManager render')

    return (
      <Box
        className={classes.root}
        display="flex"
        flexDirection="row"
        flexWrap="nowrap"
      >
        {activeNodes.map(node => (
          <Pane key={node.id} node={node}>
            <EdgeList node={node} onSelect={addActiveNode} />
          </Pane>
        ))}
      </Box>
    )
  })
}

export default PaneManager
