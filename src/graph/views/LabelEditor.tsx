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
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import InputBase from '@material-ui/core/InputBase'
import IconButton from '@material-ui/core/IconButton'
import AddIcon from '@material-ui/icons/Add'
import { Editor, EditorState } from 'draft-js'
import 'draft-js/dist/Draft.css'

import { useGraph, Node } from 'graph'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: 0,
    },

    inputBase: {
      '& input': {
        padding: theme.spacing(1, 0, 1, 0),
        height: 'auto',
      },
    },
  }),
)

interface LabelEditorProps {
  node: Instance<typeof Node>
  createMode?: boolean
  placeholder?: string
  className?: string
  onBlur?: React.EventHandler<React.SyntheticEvent>
}

export const LabelEditor: React.FunctionComponent<LabelEditorProps> = ({
  node,
  createMode,
  placeholder,
  className,
  onBlur,
}) => {
  const classes = useStyles()
  const [inputValue, setInputValue] = React.useState(
    createMode ? '' : node.label,
  )

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(event.target.value)
  }

  return useGraph(graph => {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
      event.preventDefault()
      if (inputValue) {
        graph.createChild(node, { label: inputValue })
        setInputValue('')
      }
    }

    return (
      <div className={[classes.root, className].join(' ')}>
        <form onSubmit={handleSubmit} onBlur={onBlur}>
          <InputBase
            autoFocus
            placeholder={placeholder}
            inputProps={{ 'aria-label': 'label' }}
            onChange={handleChange}
            value={inputValue}
            className={classes.inputBase}
            fullWidth
          />
        </form>
      </div>
    )
  })
}

LabelEditor.defaultProps = {
  createMode: true,
  placeholder: 'Label',
}

export default LabelEditor
