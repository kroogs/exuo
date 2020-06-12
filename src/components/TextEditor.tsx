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
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Editor, EditorState, ContentState } from 'draft-js'
import 'draft-js/dist/Draft.css'

import { Node } from 'graph'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
      border: 'solid 1px red',
      overflowY: 'auto',
    },
  }),
)

interface TextEditorProps {
  node: Instance<typeof Node>
}

const TextEditor: React.FunctionComponent<TextEditorProps> = ({ node }) => {
  const classes = useStyles()
  const [editorState, setEditorState] = React.useState(
    EditorState.createWithContent(ContentState.createFromText(node.label)),
  )

  console.log('editor', node.label)

  return (
    <div className={classes.root}>
      <Editor editorState={editorState} onChange={setEditorState} />
    </div>
  )
}

export default TextEditor
