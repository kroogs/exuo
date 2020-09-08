/*
 * Copyright © 2020 Ty Dira <ty@dira.dev>

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
import {
  Toolbar,
  IconButton,
  Box,
  Button,
  createStyles,
  makeStyles,
  Theme,
  emphasize,
  fade,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import SearchIcon from '@material-ui/icons/Search'
import TuneIcon from '@material-ui/icons/Tune'
import GroupIcon from '@material-ui/icons/Group'
import { Instance } from 'mobx-state-tree'
import { useNavigate } from '@reach/router'

import { makeUrl } from 'route'
import { SelectButton } from 'select'
import { Node, useGraph, LabelEditor } from 'graph'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},

    toolbar: {
      justifyContent: 'space-evenly',
      [theme.breakpoints.up('sm')]: {
        justifyContent: 'center',
      },

      backdropFilter: 'blur(2px)',
      background: `
        linear-gradient(
          to bottom,
          ${fade(theme.palette.background.default, 0.9)},
          ${fade(theme.palette.background.default, 1)} 90%
        )`,

      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },

    insertButton: {
      color: theme.palette.background.default,
      textShadow: `3px 3px ${theme.palette.background.default}`,
      boxShadow: 'unset',
      margin: theme.spacing(0, 1, 0, 1),
      backgroundBlendMode: 'normal',
      background: `
        radial-gradient(
          circle at bottom,
          ${theme.palette.secondary.main},
          ${theme.palette.primary.main} 75%
        )`,

      '&:hover, &:focus': {
        boxShadow: 'unset',
        background: `
        radial-gradient(
          circle at bottom,
          ${emphasize(theme.palette.secondary.main, 0.3)},
          ${theme.palette.primary.main} 75%
        )`,
      },

      '&:active': {
        boxShadow: 'unset',
        background: `
        radial-gradient(
          circle at bottom,
          ${emphasize(theme.palette.secondary.main, 0.3)},
          ${theme.palette.primary.main} 75%
        )`,
      },
    },

    labelEditor: {
      background: `
          linear-gradient(
            to top,
            ${fade(theme.palette.background.default, 0)},
            ${fade(theme.palette.background.default, 1)} \
              ${theme.spacing(1) / 3}px calc(100% - ${theme.spacing(1) / 3}px),
            ${fade(theme.palette.background.default, 0)}
          ),
          linear-gradient(
            to right,
            ${theme.palette.primary.main},
            ${theme.palette.secondary.main} 
          )
        `,
    },
  }),
)

interface NodeActionsProps {
  node: Instance<typeof Node>
  className?: string
}

export const NodeActions: React.FunctionComponent<NodeActionsProps> = ({
  node,
  className,
}) => {
  const classes = useStyles()
  const navigate = useNavigate()

  // does LabelEditor need to behave like a fully controlled component?
  // the issue here is that it doesn't clear the label?

  return useGraph(graph => {
    const hasChildren = node.childCount > 0
    const selectedCount = graph.selectedNodes.size ?? 0

    return (
      <Box className={[classes.root, className].join(' ')}>
        {graph.activeModes.includes('insert') && (
          <LabelEditor
            className={classes.labelEditor}
            placeholder="Label"
            onValue={(value, event) => {
              if (value) {
                const child = graph.createChild(node, { label: value })

                if (event?.ctrlKey) {
                  graph.setCursorNode(child)
                  navigate(makeUrl(`/node/${child.id}/`))
                }
              } else {
                graph.toggleActiveMode('insert')
              }
            }}
          />
        )}

        <Toolbar className={classes.toolbar}>
          <IconButton
            disabled
            color={graph.activeModes.includes('edit') ? 'primary' : undefined}
            onClick={() => graph.toggleActiveMode('edit')}
          >
            <SearchIcon />
          </IconButton>

          <IconButton
            disabled={!hasChildren}
            color={graph.activeModes.includes('edit') ? 'primary' : undefined}
            onClick={() => graph.toggleActiveMode('edit')}
          >
            <EditIcon />
          </IconButton>

          <IconButton
            color="primary"
            onClick={() => {
              graph.setActiveMode('insert')
            }}
            className={classes.insertButton}
          >
            <AddIcon />
          </IconButton>

          <SelectButton
            disabled={!(hasChildren || selectedCount > 0)}
            node={node}
            color={graph.activeModes.includes('select') ? 'primary' : undefined}
            onClick={() => {
              graph.toggleActiveMode('select')
            }}
          />

          <IconButton
            disabled
            color={graph.activeModes.includes('edit') ? 'primary' : undefined}
            onClick={() => graph.toggleActiveMode('edit')}
          >
            <TuneIcon />
          </IconButton>

          {false && (
            <Button
              disabled
              startIcon={<GroupIcon />}
              onClick={() => {
                if (graph.activeModes.includes('share')) {
                  graph.closePeerConnection()
                } else {
                  graph.offerPeerConnection(node)
                }
              }}
              color={
                graph.activeModes.includes('share') ? 'primary' : undefined
              }
            >
              share
            </Button>
          )}
        </Toolbar>
      </Box>
    )
  })
}
