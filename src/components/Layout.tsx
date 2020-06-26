/*
 * Copyright © 2020 Ty Dira <ty@dira.dev>
 *
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
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Button,
} from '@material-ui/core'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import SettingsIcon from '@material-ui/icons/Settings'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Instance } from 'mobx-state-tree'
import { Link } from '@reach/router'

import { Node, useGraph } from 'graph'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.background.default,
      marginBottom: -theme.spacing(1),
    },
    toolbar: {
      padding: theme.spacing(0, 2, 0, 2),
    },
    backButton: {
      color: theme.palette.primary.main,
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
    },
  }),
)

interface LayoutProps {
  title?: string
  currentNode?: Instance<typeof Node>
}

const Layout: React.FunctionComponent<LayoutProps> = ({
  title,
  currentNode,
  children,
}) => {
  const classes = useStyles()
  return useGraph(graph => (
    <>
      <AppBar elevation={0} position="sticky" className={classes.appBar}>
        <Toolbar variant="dense" className={classes.toolbar}>
          <IconButton
            edge="start"
            color="primary"
            aria-label="back"
            onClick={() => window.history.back()}
            className={classes.backButton}
          >
            <ChevronLeftIcon />
          </IconButton>
          {title && (
            <Typography variant="h6" className={classes.title}>
              {title}
            </Typography>
          )}
          <Button
            component={Link}
            to={`/settings/`}
            endIcon={<SettingsIcon fontSize="small" />}
            aria-label="settings"
            className={[
              classes.settingsButton,
              graph.editMode ? 'editMode' : '',
            ].join(' ')}
          />
        </Toolbar>
      </AppBar>
      {children}
    </>
  ))
}

export default Layout
