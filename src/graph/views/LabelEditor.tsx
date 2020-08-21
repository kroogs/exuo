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
import { InputBase } from '@material-ui/core'
import 'draft-js/dist/Draft.css'

import { useGraph } from 'graph'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      fontSize: 0,
      padding: 0,
    },

    inputBase: {
      padding: 0,
      '& input, & textarea': {
        // Extra pixel to account for body1 being 18px tall and
        // this typography being 19px tall for some reason.
        // I assume it has something to do with a calculated lineHeight.
        // TODO This causes FF to be off by a pixel, so I'll have to figure
        // out a real solution.
        padding: '3px 0 2px 0',
      },
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
  ) => void | null | string
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

  React.useEffect(() => {
    inputRef.current?.setSelectionRange(inputValue.length, inputValue.length)
  })

  return useGraph(graph => {
    const handleValue = (
      event?: React.KeyboardEvent<HTMLInputElement>,
    ): void => {
      if (onValue) {
        setInputValue(onValue?.(inputValue, event) || '')
      }
    }

    const handleFormEvent = (event: React.FormEvent<HTMLFormElement>): void => {
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
      <form
        onSubmit={handleFormEvent}
        onBlur={handleFormEvent}
        className={[classes.root, className].join(' ')}
      >
        <InputBase
          inputRef={inputRef}
          autoFocus
          multiline
          fullWidth
          placeholder={placeholder}
          value={inputValue}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          inputProps={{ 'aria-label': 'label' }}
          className={classes.inputBase}
        />
      </form>
    )
  })
}

LabelEditor.defaultProps = {
  placeholder: 'Label',
}
