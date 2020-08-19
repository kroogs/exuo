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
import { Instance } from 'mobx-state-tree'
import {
  Box,
  IconButton,
  Button,
  ButtonGroup,
  Typography,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import FolderIcon from '@material-ui/icons/Folder'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { Node, useGraph } from 'graph'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    button: {
      color: theme.palette.action.active,
    },
    deleteButton: {
      color: theme.palette.error.main,
    },
  }),
)

export const SelectionActions: React.FunctionComponent = () => {
  const classes = useStyles()
  return useGraph(graph => {
    const selectedCount = graph.selectedNodes.length ?? 0
    return (
      <>
        <Button
          startIcon={<EditIcon />}
          disabled={true || selectedCount === 0}
          className={classes.button}
        >
          Edit
        </Button>

        <Button
          startIcon={<FileCopyIcon />}
          disabled={true || selectedCount === 0}
          className={classes.button}
        >
          Copy
        </Button>

        <Button
          startIcon={<FolderIcon />}
          disabled={true || selectedCount === 0}
          className={classes.button}
        >
          Move
        </Button>

        <Button
          startIcon={<DeleteIcon />}
          disabled={selectedCount === 0}
          className={[classes.button, classes.deleteButton].join(' ')}
          onClick={() => graph.deleteSelectedNodes()}
        >
          Delete
        </Button>
      </>
    )
  })
}
