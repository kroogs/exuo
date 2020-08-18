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
        lineHeight: 'unset',

        // Extra pixel to account for body1 being 18px tall and
        // this typography being 19px tall for some reason.
        padding: '3px 0 2px 0',
      },
    },
  }),
)

interface LabelEditorProps {
  label?: string
  createMode?: boolean
  placeholder?: string
  className?: string
  onValue?: (value: string) => void | string
}

export const LabelEditor: React.FunctionComponent<LabelEditorProps> = ({
  label,
  createMode,
  placeholder,
  className,
  onValue,
}) => {
  const classes = useStyles()
  const [inputValue, setInputValue] = React.useState(label ?? '')

  return useGraph(graph => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
      setInputValue(event.target.value)
    }

    const handleValue = (event: React.FormEvent<HTMLFormElement>): void => {
      event.preventDefault()
      const value = onValue?.(inputValue)
      if (value !== undefined) {
        setInputValue(value)
      }
    }

    return (
      <form
        onSubmit={handleValue}
        onBlur={handleValue}
        className={[classes.root, className].join(' ')}
      >
        <InputBase
          autoFocus
          multiline
          fullWidth
          placeholder={placeholder}
          value={inputValue}
          onChange={handleChange}
          inputProps={{ 'aria-label': 'label' }}
          className={classes.inputBase}
        />
      </form>
    )
  })
}

LabelEditor.defaultProps = {
  createMode: false,
  placeholder: 'Label',
}
