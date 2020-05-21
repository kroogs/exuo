/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Ty Dira */

import React from 'react'

import { IAnyStateTreeNode } from 'mobx-state-tree'
import { useObserver } from 'mobx-react-lite'

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.default,
    },
  }),
)

interface TypeEditorProps {
  model: IAnyStateTreeNode | null
  options?: Partial<{
    groupBy: null
  }>
}

export const TypeEditor: React.FunctionComponent<TypeEditorProps> = props => {
  const classes = useStyles()

  return useObserver(() => {
    throw Error('Finish me!')

    return (
      <>
        <span>TypeEditor</span>
      </>
    )
  })
}

export default TypeEditor
