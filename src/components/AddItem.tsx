/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Ty Dira */

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
