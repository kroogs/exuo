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

    actions: {
      position: 'fixed',
      bottom: theme.spacing(6),
      left: '50%',
      transform: 'translateX(-50%)',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.background.default, 0.9),
      backdropFilter: 'blur(2px)',
      padding: theme.spacing(1),
    },

    children: {
      paddingBottom: theme.spacing(6) * 2 + theme.spacing(1),
    },

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
      <AppBar elevation={0} position="sticky">
        <TitleBar title={node.label} />
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
