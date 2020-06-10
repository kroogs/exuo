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
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import InputBase from '@material-ui/core/InputBase'
import IconButton from '@material-ui/core/IconButton'
import AddIcon from '@material-ui/icons/Add'
import { SnapshotIn } from 'mobx-state-tree'

import { Node } from 'store'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(0, 1, 0, 1),
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    inputBase: {
      fontSize: theme.typography.fontSize,
    },
    iconButton: {
      padding: 0,
      color: theme.palette.common.white,
      backgroundColor: theme.palette.success.main,
    },
  }),
)

interface AddItemProps {
  onSubmit: (node: SnapshotIn<typeof Node>) => void
}

export const AddItem: React.FunctionComponent<AddItemProps> = ({
  onSubmit,
}) => {
  const classes = useStyles()
  const [createInputText, setCreateInputText] = React.useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void =>
    setCreateInputText(event.target.value)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    if (!createInputText) {
      return
    }

    onSubmit({ label: createInputText })
    setCreateInputText('')
  }

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <InputBase
        placeholder="Add item"
        inputProps={{ 'aria-label': 'item name' }}
        onChange={handleChange}
        value={createInputText}
        className={classes.inputBase}
        margin={'none'}
        fullWidth
      />
      {createInputText && (
        <IconButton
          type="submit"
          aria-label="add item"
          className={classes.iconButton}
        >
          <AddIcon />
        </IconButton>
      )}
    </form>
  )
}

export default AddItem