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
import { Typography, AppBar, Toolbar, IconButton } from '@material-ui/core'
import { ArrowBack, Settings } from '@material-ui/icons'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Instance } from 'mobx-state-tree'

import { Node, useGraph } from 'graph'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
    },
    backButton: {
      color: theme.palette.primary.main,
      '&[disabled]': {
        visibility: 'hidden',
        pointerEvents: 'none',
      },
    },
    moreButton: {
      visibility: 'hidden',
      pointerEvents: 'none',
    },
    title: {
      flexGrow: 1,
      textAlign: 'center',
      overflowX: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
  }),
)

interface HeaderProps {
  node: Instance<typeof Node>
  showTitle?: boolean
}

const Header: React.FunctionComponent<HeaderProps> = ({ node, showTitle }) => {
  const classes = useStyles()
  return useGraph(graph => (
    <AppBar elevation={0} position="sticky" className={classes.root}>
      <Toolbar variant="dense">
        <IconButton
          disabled={graph.rootNode.id === node.id ? true : undefined}
          edge="start"
          color="primary"
          aria-label="back"
          onClick={() => window.history.back()}
          className={classes.backButton}
        >
          <ArrowBack />
        </IconButton>
        {showTitle && (
          <Typography variant="h6" className={classes.title}>
            {node.label}
          </Typography>
        )}
        <IconButton
          edge="end"
          aria-label="more"
          onClick={e => console.log('moreButton', e)}
          className={classes.moreButton}
        >
          <Settings fontSize="small" />
        </IconButton>
      </Toolbar>
    </AppBar>
  ))
}

Header.defaultProps = {
  showTitle: true,
}

export default Header
