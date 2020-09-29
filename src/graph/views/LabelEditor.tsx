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
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { InputBase, ClickAwayListener } from '@material-ui/core'

import { useGraph } from 'graph'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'inline-block',
      margin: 0,
      padding: theme.spacing(1, 2, 1, 2),
      overflowX: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      ...theme.typography.body1,
    },
  }),
)

interface LabelEditorProps {
  content?: string
  placeholder?: string
  autoFocus?: boolean
  className?: string
  onValue?: (
    value: string,
    event?: React.KeyboardEvent<HTMLInputElement>,
  ) => void
}

export const LabelEditor: React.FunctionComponent<LabelEditorProps> = ({
  content,
  placeholder,
  autoFocus,
  className,
  onValue,
}) => {
  const inputRef = React.useRef<HTMLInputElement>()
  const classes = useStyles()
  const [inputValue, setInputValue] = React.useState(content ?? '')

  const [didRender, setDidRender] = React.useState(false)
  React.useEffect(() => {
    if (!didRender) {
      inputRef.current?.setSelectionRange(inputValue.length, inputValue.length)
      setDidRender(true)
    }
  }, [didRender, inputValue.length])

  return useGraph(graph => {
    const handleValue = (
      event?: React.KeyboardEvent<HTMLInputElement>,
    ): void => {
      if (onValue) {
        setInputValue('')
        onValue(inputValue, event)
      }
    }

    const handleClickAway = (event: React.MouseEvent<Document>): void => {
      // TODO don't do a create when clicking away
      // but this is how it should work when editing an existing record
      // so back to a create mode? D:
      if (inputValue === '') {
        handleValue()
      }
    }

    const handleKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>,
    ): void => {
      if (event.keyCode === 13 && !event.shiftKey) {
        event.preventDefault()
        handleValue(event)
      } else if (event.keyCode === 27) {
        // TODO escape should also exit the editor, but this is ugly to try here
      }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
      setInputValue(event.target.value)
    }

    return (
      <ClickAwayListener onClickAway={handleClickAway}>
        <InputBase
          fullWidth
          multiline
          autoFocus={autoFocus}
          inputRef={inputRef}
          placeholder={placeholder}
          value={inputValue}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          inputProps={{ 'aria-label': 'text' }}
          className={[classes.root, className].join(' ')}
        />
      </ClickAwayListener>
    )
  })
}

LabelEditor.defaultProps = {
  placeholder: 'Text',
}
