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
import { Instance } from 'mobx-state-tree'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import InputBase from '@material-ui/core/InputBase'
import IconButton from '@material-ui/core/IconButton'
import AddIcon from '@material-ui/icons/Add'
import { Editor, EditorState } from 'draft-js'
import 'draft-js/dist/Draft.css'

import NodeActions from './NodeActions'
import { useGraph, Node } from 'graph'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'sticky',
      bottom: 0,
      marginTop: -theme.spacing(1),
      ...theme.typography.body1,
      padding: 0,
      background: theme.palette.background.default,
    },

    inputBase: {
      ...theme.typography.body1,
      '& input': {
        padding: theme.spacing(1, 2, 1, 2),
        height: 'auto',
      },
    },

    iconButton: {
      padding: 0,
      marginLeft: -theme.spacing(4),
      color: theme.palette.common.white,
      backgroundColor: theme.palette.success.main,
      '&:hover': {
        backgroundColor: theme.palette.success.light,
      },
    },
  }),
)

interface AddItemProps {
  node: Instance<typeof Node>
}

export const AddItem: React.FunctionComponent<AddItemProps> = ({ node }) => {
  const classes = useStyles()
  const [createInputText, setCreateInputText] = React.useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void =>
    setCreateInputText(event.target.value)

  /* const [editorState, setEditorState] = React.useState(() => */
  /*   EditorState.createEmpty(), */
  /* ) */

  return useGraph(graph => {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
      event.preventDefault()
      if (createInputText) {
        graph.createChild(node, { label: createInputText })
        setCreateInputText('')
      }
    }

    /* <Editor */
    /*   placeholder="Add item" */
    /*   editorState={editorState} */
    /*   onChange={setEditorState} */
    /* /> */

    return (
      <div className={classes.root}>
        {graph.editMode ? (
          <NodeActions node={node} />
        ) : (
          <form onSubmit={handleSubmit}>
            <InputBase
              placeholder="Add item"
              inputProps={{ 'aria-label': 'item name' }}
              onChange={handleChange}
              value={createInputText}
              className={classes.inputBase}
              margin={'none'}
              autoFocus
              fullWidth
            />
            {createInputText && (
              <IconButton
                type="submit"
                aria-label="add item"
                className={classes.iconButton}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            )}
          </form>
        )}
      </div>
    )
  })
}

export default AddItem
