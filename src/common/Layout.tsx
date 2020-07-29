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

import { Link } from 'route'

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
    children: {},
    backButton: {
      '&[disabled]': {
        visibility: 'hidden',
        pointerEvents: 'none',
      },
    },
    hide: {
      visibility: 'hidden',
      mouseEvents: 'none',
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
  title?: string
  actions?: React.ReactElement
  showBackButton?: boolean
  showSettingsButton?: boolean
  className?: string
}

const Layout: React.FunctionComponent<LayoutProps> = ({
  title,
  actions,
  showBackButton,
  showSettingsButton,
  className,
  children,
}) => {
  const classes = useStyles()
  return (
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
            className={[
              classes.backButton,
              showSettingsButton ? '' : classes.hide,
            ].join(' ')}
          >
            <ChevronLeftIcon />
          </IconButton>

          {title && (
            <Typography variant="h6" className={classes.title}>
              {title}
            </Typography>
          )}

          <IconButton
            disabled
            edge="end"
            component={Link}
            to={`/settings`}
            aria-label="settings"
            className={[
              classes.settingsButton,
              showBackButton ? '' : classes.hide,
            ].join(' ')}
          >
            {<SettingsIcon fontSize="small" />}
          </IconButton>
        </Toolbar>

        {actions}
      </AppBar>

      <Box className={classes.children}>{children}</Box>
    </Box>
  )
}

Layout.defaultProps = {
  title: 'Exuo',
  showBackButton: false,
  showSettingsButton: false,
}

export default Layout
