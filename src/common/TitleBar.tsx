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
import { Typography, Toolbar, IconButton } from '@material-ui/core'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import SettingsIcon from '@material-ui/icons/Settings'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Link } from '@reach/router'

import { makeUrl } from 'route'
import { isRootPath } from 'common'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: theme.palette.text.secondary,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(0, 2, 0, 2),
    },
    backButton: {
      cursor: 'pointer',
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

interface TitleBarProps {
  title?: string
  showBackButton?: boolean
  showSettingsButton?: boolean
  className?: string
}

export const TitleBar: React.FunctionComponent<TitleBarProps> = ({
  title,
  showBackButton,
  showSettingsButton,
  className,
  children,
}) => {
  const classes = useStyles()
  const newlinePosition = title?.indexOf('\n') ?? -1

  return (
    <Toolbar className={[classes.root, className].join(' ')}>
      <IconButton
        disabled={isRootPath()}
        edge="start"
        aria-label="back"
        onClick={() => window.history.back()}
        className={[
          classes.backButton,
          showBackButton ? '' : classes.hide,
        ].join(' ')}
      >
        <ChevronLeftIcon />
      </IconButton>

      {title && (
        <Typography variant="h6" className={classes.title}>
          {newlinePosition > 0 ? title.slice(0, title.indexOf('\n')) : title}
        </Typography>
      )}

      <IconButton
        disabled
        edge="end"
        component={Link}
        to={makeUrl(`/settings`)}
        aria-label="settings"
        className={[
          classes.settingsButton,
          showSettingsButton ? '' : classes.hide,
        ].join(' ')}
      >
        {<SettingsIcon fontSize="small" />}
      </IconButton>
    </Toolbar>
  )
}

TitleBar.defaultProps = {
  title: 'Exuo',
  showBackButton: true,
  showSettingsButton: false,
}
