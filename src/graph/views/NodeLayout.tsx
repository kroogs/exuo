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
import { AppBar, Box } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Instance } from 'mobx-state-tree'

import { TitleBar } from 'common'

import { Node, useGraph, NodeActions } from 'graph'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    actions: {
      width: '100%',
      textAlign: 'center',
      color: theme.palette.text.secondary,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(0, 2, 0, 2),
    },
    children: {
      marginTop: -theme.spacing(1),
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
  return useGraph(graph => (
    <Box className={[classes.root, className].join(' ')}>
      <AppBar elevation={0} position="sticky">
        <TitleBar title={node.label} />
        <NodeActions node={node} className={classes.actions} />
      </AppBar>
      <Box className={classes.children}>{children}</Box>
    </Box>
  ))
}
