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
import { NoteEditor } from 'note'

import { Node, useGraph, NodeActions } from 'graph'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      position: 'relative',
      paddingBottom: theme.spacing(8),
    },

    appBar: {
      position: 'sticky',
      borderBottom: `.1px solid ${theme.palette.divider}`,
      backdropFilter: 'blur(3px)',
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
      marginBottom: '-.1px',
    },

    textEditor: {
      position: 'sticky',
      bottom: theme.spacing(8),
    },

    actions: {
      borderTop: `.1px solid ${theme.palette.divider}`,
      zIndex: theme.zIndex.appBar,

      position: 'fixed',
      bottom: 0,
      left: '50%',
      width: '100%',
      transform: 'translateX(-50%)',

      [theme.breakpoints.up('sm')]: {
        maxWidth: '900px',
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
  const navigate = useNavigate()

  /* React.useEffect(() => { */
  /*   const handler = (event: KeyboardEvent): void => { */
  /*     console.log({ event }) */
  /*   } */

  /*   document.addEventListener('keydown', handler) */
  /*   return () => { */
  /*     document.removeEventListener('keydown', handler) */
  /*   } */
  /* }) */

  return useGraph(graph => {
    let titleText: string
    const content = node.content?.toJSON?.()

    if (typeof node.content === 'string') {
      titleText = node.content
    } else if (content) {
      titleText = content.blocks?.[0]?.text
    } else {
      titleText = node.id
    }

    return (
      <Box className={[classes.root, className].join(' ')}>
        <AppBar elevation={0} className={classes.appBar}>
          <TitleBar title={titleText} className={classes.titleBar} />
        </AppBar>

        <Box
          className={[
            classes.children,
            graph.activeModes.includes('insert') ? 'fade' : '',
          ].join(' ')}
        >
          {children}
        </Box>
        {graph.activeModes.includes('insert') && (
          <NoteEditor
            autoFocus
            className={classes.textEditor}
            onValue={(value, event) => {
              if (value) {
                const child = graph.createChild(node, { content: value })
                if (event?.ctrlKey) {
                  navigate(makeUrl(`/node/${child.id}/`))
                } else {
                  return true
                }
              } else {
                graph.toggleActiveMode('insert')
              }
            }}
            onEscape={() => {
              graph.unsetActiveMode('insert')
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
    )
  })
}
