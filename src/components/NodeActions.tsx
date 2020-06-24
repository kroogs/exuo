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
import { Button, Typography } from '@material-ui/core'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import Folder from '@material-ui/icons/Folder'
import FileCopy from '@material-ui/icons/FileCopy'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Instance } from 'mobx-state-tree'

import { Node, useGraph } from 'graph'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
    },
    button: {
      margin: theme.spacing(0, 1, 0, 1),
    },
    deleteButton: {
      '&:hover, &:focus': {
        backgroundColor: 'inherit',
        color: theme.palette.error.main,
      },
    },
  }),
)

interface NodeActionsProps {
  node: Instance<typeof Node>
}

const NodeActions: React.FunctionComponent<NodeActionsProps> = ({ node }) => {
  const classes = useStyles()
  return useGraph(graph => (
    <div className={classes.root}>
      <Typography variant="body2">
        {graph.selectedNodes.length} Selected
      </Typography>
      <Button startIcon={<Edit />} disabled className={classes.button}>
        Modify
      </Button>
      <Button startIcon={<FileCopy />} disabled className={classes.button}>
        Copy
      </Button>
      <Button startIcon={<Folder />} disabled className={classes.button}>
        Move
      </Button>
      <Button
        startIcon={<Delete />}
        className={[classes.button, classes.deleteButton].join(' ')}
        onClick={() => graph.deleteSelectedNodes()}
      >
        Delete
      </Button>
    </div>
  ))
}

export default NodeActions
