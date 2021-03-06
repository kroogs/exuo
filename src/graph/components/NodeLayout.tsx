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
import { observer } from 'mobx-react-lite'
import { AppBar, Box, fade } from '@material-ui/core'
import { Instance } from 'mobx-state-tree'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { navigate } from 'exuo/src/route'
import { TitleBar } from 'exuo/src/common'
import { NoteEditor } from 'exuo/src/note'

import { Node, useGraph, NodeActions } from 'exuo/src/graph'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      position: 'relative',
      paddingBottom: theme.spacing(8),
    },

    appBar: {
      zIndex: theme.zIndex.appBar + 1,
      position: 'sticky',
      borderBottom: `.1px solid ${theme.palette.divider}`,
      /* backdropFilter: 'blur(3px)', */
      background: `
        linear-gradient(
          to top,
          ${fade(theme.palette.background.default, 0.8)},
          ${fade(theme.palette.background.default, 1)} 80%
        )`,
    },

    titleBar: {
      background: 'unset',
    },

    children: {},

    textEditor: {
      position: 'sticky',
      zIndex: theme.zIndex.appBar,
      bottom: theme.spacing(8) + 1,
    },

    actions: {
      borderTop: `.1px solid ${theme.palette.divider}`,
      zIndex: theme.zIndex.appBar + 1,

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

export const NodeLayout: React.FunctionComponent<LayoutProps> = observer(
  ({ node, className, children }) => {
    const classes = useStyles()
    const graph = useGraph()

    const content = node.content?.toJSON?.()
    let titleText: string

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
                  navigate(`/node/${child.id}/`)
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
  },
)
