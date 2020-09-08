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
import { InputBase, ClickAwayListener, Backdrop } from '@material-ui/core'

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
  label?: string
  placeholder?: string
  className?: string
  onValue?: (
    value: string,
    event?: React.KeyboardEvent<HTMLInputElement>,
  ) => void
}

export const LabelEditor: React.FunctionComponent<LabelEditorProps> = ({
  label,
  placeholder,
  className,
  onValue,
}) => {
  const inputRef = React.useRef<HTMLInputElement>()
  const classes = useStyles()
  const [inputValue, setInputValue] = React.useState(label ?? '')

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
      event.preventDefault()
      handleValue()
    }

    const handleKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>,
    ): void => {
      if (event.keyCode === 13 && !event.shiftKey) {
        event.preventDefault()
        handleValue(event)
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
          inputRef={inputRef}
          placeholder={placeholder}
          value={inputValue}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          inputProps={{ 'aria-label': 'label' }}
          className={[classes.root, className].join(' ')}
        />
      </ClickAwayListener>
    )
  })
}

LabelEditor.defaultProps = {
  placeholder: 'Label',
}
