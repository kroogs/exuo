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

    children: {
      opacity: 1,
      transition: theme.transitions.create(['opacity'], {
        duration: theme.transitions.duration.standard,
      }),
      '&.fade': {
        opacity: 0.35,
      },
    },

    labelEditor: {
      borderTop: `.01px solid ${theme.palette.divider}`,
      borderBottom: `.01px solid ${theme.palette.divider}`,
      padding: theme.spacing(1, 2, 1, 2),
      background: `${fade(theme.palette.background.default, 0.9)}`,
      backdropFilter: 'blur(3px)',
    },

    actionArea: {
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

    actions: {
      backdropFilter: 'blur(2px)',
      background: `
        linear-gradient(
          to bottom,
          ${fade(theme.palette.background.default, 0.9)},
          ${fade(theme.palette.background.default, 1)} 90%
        )`,

      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),

      '&>*': {
        opacity: 1,
        transition: theme.transitions.create(['opacity'], {
          duration: theme.transitions.duration.standard,
        }),
      },
      '&.fade>*': { opacity: 0.15 },
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

  /* React.useEffect(() => { */
  /*   window.scrollTo({ */
  /*     left: 0, */
  /*     top: document.body.scrollHeight, */
  /*     behavior: 'smooth', */
  /*   }) */
  /* }) */

  return useGraph(graph => (
    <Box className={[classes.root, className].join(' ')}>
      <AppBar elevation={0} position="sticky" className={classes.appBar}>
        <TitleBar title={node.label} className={classes.titleBar} />
      </AppBar>

      <Box className={classes.actionArea}>
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
                  return
                }

                return ''
              } else {
                graph.toggleActiveMode('insert')
              }
            }}
          />
        )}
        <NodeActions
          node={node}
          className={[
            classes.actions,
            graph.activeModes.includes('insert') ? 'fade' : '',
          ].join(' ')}
        />
      </Box>

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
