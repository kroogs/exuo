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
import { Box, Button } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import GroupWorkIcon from '@material-ui/icons/GroupWork'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Instance } from 'mobx-state-tree'

import { Node, useGraph } from 'graph'
import SelectionActions from './SelectionActions'
import LabelEditor from './LabelEditor'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    button: {
      color: theme.palette.action.active,
    },
    toggledButton: {
      color: theme.palette.primary.main,
    },
  }),
)

interface NodeActionsProps {
  node: Instance<typeof Node>
  className?: string
}

type ActionMode = 'normal' | 'add' | 'share'

const NodeActions: React.FunctionComponent<NodeActionsProps> = ({
  node,
  className,
}) => {
  const classes = useStyles()
  const [mode, setMode] = React.useState<ActionMode>('normal')

  return useGraph(graph => {
    const hasChildren = node?.childCount > 0
    return (
      <Box className={[classes.root, className].join(' ')}>
        {mode === 'normal' && !graph.activeModes.includes('select') && (
          <>
            <Button
              startIcon={<AddIcon />}
              onClick={() => setMode('add')}
              className={classes.button}
            >
              new
            </Button>

            {hasChildren && (
              <Button
                startIcon={<EditIcon />}
                onClick={() => graph.toggleActiveMode('edit')}
                className={[
                  classes.button,
                  graph.activeModes.includes('edit')
                    ? classes.toggledButton
                    : '',
                ].join(' ')}
              >
                edit
              </Button>
            )}

            <Button
              startIcon={<GroupWorkIcon />}
              onClick={() => graph.toggleActiveMode('share')}
              className={[
                classes.button,
                graph.activeModes.includes('share')
                  ? classes.toggledButton
                  : '',
              ].join(' ')}
            >
              share
            </Button>
          </>
        )}

        {mode === 'normal' && graph.activeModes.includes('select') && (
          <SelectionActions />
        )}

        {mode === 'add' && (
          <LabelEditor
            placeholder="Label"
            node={node}
            onBlur={() => setMode('normal')}
          />
        )}

        {false && graph.activeModes.includes('select') && <div>edit</div>}

        {false && graph.activeModes.includes('share') && <div>share</div>}
      </Box>
    )
  })
}

export default NodeActions
