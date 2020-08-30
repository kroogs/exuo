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
import { AppBar, Box, fade } from '@material-ui/core'
import { Instance } from 'mobx-state-tree'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useNavigate } from '@reach/router'

import { makeUrl } from 'route'
import { TitleBar } from 'common'

import { Node, useGraph, NodeActions, LabelEditor } from 'graph'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
    },

    appBar: {
      borderBottom: `.01px solid ${theme.palette.divider}`,
      background: `
        linear-gradient(
          to top,
          ${fade(theme.palette.background.default, 0.9)},
          ${fade(theme.palette.background.default, 1)} 72%
        )`,
      backdropFilter: 'blur(2px)',
    },

    titleBar: {
      background: 'unset',
    },

    actions: {
      position: 'sticky',
      bottom: 0,
      width: '100%',
      padding: theme.spacing(2, 2, 4, 2),
      borderTop: `.01px solid ${theme.palette.divider}`,
      background: `
        linear-gradient(
          to bottom,
          ${fade(theme.palette.background.default, 0.9)},
          ${fade(theme.palette.background.default, 1)} 72%
        )`,
      backdropFilter: 'blur(2px)',
    },

    children: {},

    labelEditor: {
      margin: theme.spacing(0, 2, 0, 2),
      width: '100%',
    },
  }),
)

interface LayoutProps {
  node: Instance<typeof Node>
  className?: string
}

export const NodeLayout: React.FunctionComponent<LayoutProps> = ({
  node,
  className,
  children,
}) => {
  const classes = useStyles()
  const navigate = useNavigate()
  return useGraph(graph => (
    <Box className={[classes.root, className].join(' ')}>
      <AppBar elevation={0} position="sticky" className={classes.appBar}>
        <TitleBar title={node.label} className={classes.titleBar} />
      </AppBar>
      <Box className={classes.children}>
        {children}
        {graph.activeModes.includes('insert') && (
          <LabelEditor
            className={classes.labelEditor}
            placeholder="Label"
            onValue={(value, event) => {
              if (value) {
                const child = graph.createChild(node, { label: value })
                if (event?.ctrlKey) {
                  navigate(makeUrl(`/node/${child.id}/`))
                } else {
                  return ''
                }
              } else {
                graph.toggleActiveMode('insert')
              }
            }}
          />
        )}
      </Box>
      <NodeActions node={node} className={classes.actions} />
    </Box>
  ))
}
