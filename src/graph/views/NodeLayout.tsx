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
import { Typography, AppBar, Toolbar, IconButton, Box } from '@material-ui/core'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import SettingsIcon from '@material-ui/icons/Settings'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Instance } from 'mobx-state-tree'
import { getSnapshot } from 'mobx-state-tree'

import { Node, useGraph } from 'graph'
import { Link } from 'route'
import NodeActions from './NodeActions'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    appBar: {},
    header: {
      color: theme.palette.text.secondary,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(0, 2, 0, 2),
    },
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
    backButton: {
      '&[disabled]': {
        visibility: 'hidden',
        pointerEvents: 'none',
      },
    },
    settingsButton: {},
    title: {
      flexGrow: 1,
      textAlign: 'center',
      overflowX: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      color: theme.palette.text.primary,
    },
  }),
)

interface LayoutProps {
  node?: Instance<typeof Node>
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
        <Toolbar variant="dense" className={classes.header}>
          <IconButton
            disabled={
              window.location.pathname === process.env.PUBLIC_URL
                ? true
                : undefined
            }
            edge="start"
            aria-label="back"
            onClick={() => window.history.back()}
            className={classes.backButton}
          >
            <ChevronLeftIcon />
          </IconButton>

          {node.label && (
            <Typography variant="h6" className={classes.title}>
              {node.label}
            </Typography>
          )}

          <IconButton
            disabled
            edge="end"
            component={Link}
            to={`/settings`}
            aria-label="settings"
            className={classes.settingsButton}
          >
            {<SettingsIcon fontSize="small" />}
          </IconButton>
        </Toolbar>

        {node && <NodeActions node={node} className={classes.actions} />}
      </AppBar>

      <Box className={classes.children}>{children}</Box>
    </Box>
  ))
}
