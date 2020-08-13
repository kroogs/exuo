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
import { Button, Theme, makeStyles, createStyles } from '@material-ui/core'
import * as Draft from 'draft-js'
import 'draft-js/dist/Draft.css'

import { Note } from './Note'

const BLOCK_TYPES = [
  { label: 'H1', style: 'header-one' },
  { label: 'H2', style: 'header-two' },
  { label: 'H3', style: 'header-three' },
  { label: 'H4', style: 'header-four' },
  { label: 'H5', style: 'header-five' },
  { label: 'H6', style: 'header-six' },
  { label: 'UL', style: 'unordered-list-item' },
  { label: 'OL', style: 'ordered-list-item' },
  { label: 'Blockquote', style: 'blockquote' },
  { label: 'Code Block', style: 'code-block' },
]

const INLINE_STYLES = [
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
  { label: 'Underline', style: 'UNDERLINE' },
  { label: 'Monospace', style: 'CODE' },
]

const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
}

function getBlockStyle(block: Draft.ContentBlock): string {
  switch (block.getType()) {
    case 'blockquote':
      return 'RichEditor-blockquote'
    default:
      return ''
  }
}

interface StyleButtonProps {
  onToggle: (inlineStyle: string) => void
  style: string
  active: boolean
  label: string
}

const StyleButton: React.FunctionComponent<StyleButtonProps> = ({
  onToggle,
  style,
  active,
  label,
}) => {
  const onToggleWrap: React.EventHandler<React.SyntheticEvent> = e => {
    e.preventDefault()
    onToggle(style)
  }

  let className = 'RichEditor-styleButton'
  if (active) {
    className += ' RichEditor-activeButton'
  }

  return (
    <Button size="small" className={className} onMouseDown={onToggleWrap}>
      {label}
    </Button>
  )
}

interface BlockStyleControlsProps {
  editorState: Draft.EditorState
  onToggle: (style: string) => void
}

const BlockStyleControls: React.FunctionComponent<BlockStyleControlsProps> = ({
  editorState,
  onToggle,
}) => {
  const selection = editorState.getSelection()
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType()

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map(type => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={onToggle}
          style={type.style}
        />
      ))}
    </div>
  )
}

interface InlineStyleControlsProps {
  editorState: Draft.EditorState
  onToggle: (style: string) => void
}

const InlineStyleControls: React.FunctionComponent<InlineStyleControlsProps> = ({
  editorState,
  onToggle,
}) => {
  const currentStyle = editorState.getCurrentInlineStyle()
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={onToggle}
          style={type.style}
        />
      ))}
    </div>
  )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    input: {
      height: '100px',
      border: 'solid 1px red',
    },
  }),
)

interface NoteEditorProps {
  note?: Instance<typeof Note>
  className?: string
}

export const NoteEditor: React.FunctionComponent<NoteEditorProps> = ({
  note,
  className,
}) => {
  const classes = useStyles()
  const editorRef = React.useRef(null)
  const [editorState, setEditorState] = React.useState(
    Draft.EditorState.createWithContent(Draft.ContentState.createFromText('')),
  )

  function handleKeyCommand(
    command: Draft.DraftEditorCommand,
    editorState: Draft.EditorState,
  ): Draft.DraftHandleValue {
    const newState = Draft.RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      setEditorState(newState)
      return 'handled'
    } else {
      return 'not-handled'
    }
  }

  const mapKeyToEditorCommand = (
    e: React.KeyboardEvent,
  ): Draft.DraftEditorCommand | null => {
    if (e.keyCode === 9) {
      e.preventDefault()

      const newEditorState = Draft.RichUtils.onTab(e, editorState, 4)

      if (newEditorState !== editorState) {
        setEditorState(newEditorState)
      }

      return null
    } else {
      return Draft.getDefaultKeyBinding(e)
    }
  }

  function toggleBlockType(blockType: string): void {
    setEditorState(Draft.RichUtils.toggleBlockType(editorState, blockType))
  }

  function toggleInlineStyle(inlineStyle: string): void {
    setEditorState(Draft.RichUtils.toggleInlineStyle(editorState, inlineStyle))
  }

  return (
    <div className={classes.root}>
      <BlockStyleControls
        editorState={editorState}
        onToggle={toggleBlockType}
      />
      <InlineStyleControls
        editorState={editorState}
        onToggle={toggleInlineStyle}
      />
      <div className={classes.input}>
        <Draft.Editor
          ref={editorRef}
          blockStyleFn={getBlockStyle}
          customStyleMap={styleMap}
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={mapKeyToEditorCommand}
          onChange={setEditorState}
          placeholder="Placeholder Required"
          spellCheck={true}
        />
      </div>
    </div>
  )
}
