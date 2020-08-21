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
import {
  Toolbar,
  Button,
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import GroupIcon from '@material-ui/icons/Group'
import { Instance } from 'mobx-state-tree'
import { useNavigate } from '@reach/router'

import { makeUrl } from 'route'
import { SelectButton } from 'select'

import { Node, useGraph, LabelEditor } from 'graph'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      justifyContent: 'center',
    },
  }),
)

interface NodeActionsProps {
  node: Instance<typeof Node>
  className?: string
}

type ActionMode = 'normal' | 'add' | 'edit' | 'share'

export const NodeActions: React.FunctionComponent<NodeActionsProps> = ({
  node,
  className,
}) => {
  const classes = useStyles()
  const [mode, setMode] = React.useState<ActionMode>('normal')
  const navigate = useNavigate()

  return useGraph(graph => {
    const hasChildren = node.childCount > 0
    const selectedCount = graph.selectedNodes.size ?? 0

    return (
      <Toolbar variant="dense" className={[classes.root, className].join(' ')}>
        {mode === 'normal' && (
          <>
            <Button
              startIcon={<AddIcon />}
              onClick={() => {
                setMode('add')
              }}
            >
              new
            </Button>

            {hasChildren && (
              <Button
                color={
                  graph.activeModes.includes('edit') ? 'primary' : undefined
                }
                startIcon={<EditIcon />}
                onClick={() => graph.toggleActiveMode('edit')}
              >
                edit
              </Button>
            )}

            {(hasChildren || selectedCount > 0) && (
              <SelectButton
                node={node}
                color={
                  graph.activeModes.includes('select') ? 'primary' : undefined
                }
                onClick={() => {
                  graph.setCursorNode(node)
                  graph.toggleActiveMode('select')
                }}
              />
            )}

            {false && (
              <Button
                disabled
                startIcon={<GroupIcon />}
                onClick={() => {
                  if (graph.activeModes.includes('share')) {
                    graph.closePeerConnection()
                  } else {
                    graph.offerPeerConnection(node)
                  }
                }}
                color={
                  graph.activeModes.includes('share') ? 'primary' : undefined
                }
              >
                share
              </Button>
            )}
          </>
        )}

        {mode === 'add' && (
          <LabelEditor
            placeholder="Label"
            onValue={(value, event) => {
              if (value) {
                const child = graph.createChild(node, { label: value })

                if (event?.ctrlKey) {
                  navigate(makeUrl(`/node/${child.id}/`)).then(() => {
                    setMode('add')
                  })
                }

                return ''
              } else {
                setMode('normal')
              }
            }}
          />
        )}
      </Toolbar>
    )
  })
}
