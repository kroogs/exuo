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

import { TitleBar } from 'common'

import { Node, useGraph, NodeActions } from 'graph'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      position: 'relative',
      paddingBottom: theme.spacing(9),
    },

    appBar: {
      backdropFilter: 'blur(2px)',
      background: `
        linear-gradient(
          to top,
          ${fade(theme.palette.background.default, 0.9)},
          ${fade(theme.palette.background.default, 1)} 90%
        )`,
    },

    titleBar: {
      background: 'unset',
    },

    children: {},

    actions: {
      zIndex: theme.zIndex.appBar,
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '600px',
      },
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
      <AppBar elevation={0} position="sticky" className={classes.appBar}>
        <TitleBar title={node.label} className={classes.titleBar} />
      </AppBar>

      <NodeActions
        node={node}
        className={[
          classes.actions,
          graph.activeModes.includes('insert') ? 'fade' : '',
        ].join(' ')}
      />

      <Box
        className={[
          classes.children,
          graph.activeModes.includes('insert') ? 'fade' : '',
        ].join(' ')}
      >
        {children}
      </Box>
    </Box>
  ))
}
