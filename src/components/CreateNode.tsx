/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Ty Dira */

import React from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import InputBase from '@material-ui/core/InputBase'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import AddIcon from '@material-ui/icons/Add'
import DirectionsIcon from '@material-ui/icons/Directions'
import { Instance } from 'mobx-state-tree'

import { Node, useStore } from 'store'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: 0,
    },
    input: {
      margin: 0,
      fontSize: theme.typography.fontSize,
    },
    iconButton: {
      padding: 0,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  }),
)

interface CreateNodeProps {
  onCreate?: (node: Instance<typeof Node>) => void
}

export const CreateNode: React.FunctionComponent<CreateNodeProps> = ({
  onCreate,
}) => {
  const classes = useStyles()
  const graph = useStore(graph => graph)
  const [createInputText, setCreateInputText] = React.useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void =>
    setCreateInputText(event.target.value)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    const node = graph.createNode('Node', { label: createInputText })
    setCreateInputText('')

    if (typeof onCreate === 'function') {
      onCreate(node)
    }
  }

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <InputBase
        id="node-create-label"
        onChange={handleChange}
        value={createInputText}
        className={classes.input}
        placeholder="Add item"
        inputProps={{ 'aria-label': 'add item' }}
      />
      <IconButton
        type="submit"
        className={classes.iconButton}
        aria-label="search"
      >
        <AddIcon />
      </IconButton>
    </form>
  )
}

export default CreateNode
