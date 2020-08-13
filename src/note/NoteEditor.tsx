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
import {
  Box,
  Button,
  IconButton,
  Toolbar,
  Theme,
  makeStyles,
  createStyles,
} from '@material-ui/core'
import Code from '@material-ui/icons/Code'
import FormatQuote from '@material-ui/icons/FormatQuote'
import FormatBold from '@material-ui/icons/FormatBold'
import FormatItalic from '@material-ui/icons/FormatItalic'
import FormatUnderlined from '@material-ui/icons/FormatUnderlined'
import SpaceBar from '@material-ui/icons/SpaceBar'
import FormatListNumbered from '@material-ui/icons/FormatListNumbered'
import FormatListBulleted from '@material-ui/icons/FormatListBulleted'
import * as Draft from 'draft-js'
import 'draft-js/dist/Draft.css'

import { Note } from './Note'

interface ButtonConfig {
  label: string
  style: string
  icon?: React.ReactElement
}

const BLOCK_TYPES: Array<ButtonConfig> = [
  /* { label: 'H1', style: 'header-one' }, */
  /* { label: 'H2', style: 'header-two' }, */
  /* { label: 'H3', style: 'header-three' }, */
  /* { label: 'H4', style: 'header-four' }, */
  /* { label: 'H5', style: 'header-five' }, */
  /* { label: 'H6', style: 'header-six' }, */
  { label: 'UL', style: 'unordered-list-item', icon: <FormatListNumbered /> },
  { label: 'OL', style: 'ordered-list-item', icon: <FormatListBulleted /> },
  { label: 'Blockquote', style: 'blockquote', icon: <FormatQuote /> },
  { label: 'Code Block', style: 'code-block', icon: <Code /> },
]

const INLINE_STYLES: Array<ButtonConfig> = [
  { label: 'Bold', style: 'BOLD', icon: <FormatBold /> },
  { label: 'Italic', style: 'ITALIC', icon: <FormatItalic /> },
  { label: 'Underline', style: 'UNDERLINE', icon: <FormatUnderlined /> },
  { label: 'Monospace', style: 'CODE', icon: <SpaceBar /> },
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
  icon?: React.ReactElement
}

const StyleButton: React.FunctionComponent<StyleButtonProps> = ({
  onToggle,
  style,
  active,
  label,
  icon,
}) => {
  const onToggleWrap: React.EventHandler<React.SyntheticEvent> = e => {
    e.preventDefault()
    onToggle(style)
  }

  let className = 'RichEditor-styleButton'
  if (active) {
    className += ' RichEditor-activeButton'
  }

  return icon ? (
    <IconButton size="small" onMouseDown={onToggleWrap} className={className}>
      {icon}
    </IconButton>
  ) : (
    <Button
      size="small"
      startIcon={icon ? icon : undefined}
      onMouseDown={onToggleWrap}
      className={className}
    >
      {icon ? '' : label}
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
          icon={type.icon}
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
          icon={type.icon}
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
      height: '300px',
      padding: theme.spacing(0, 2, 0, 2),
    },
    toolbar: {
      padding: theme.spacing(0, 2, 0, 2),
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
      <Toolbar variant="dense" className={classes.toolbar}>
        <Box flexGrow={1}>
          <InlineStyleControls
            editorState={editorState}
            onToggle={toggleInlineStyle}
          />
        </Box>
        <BlockStyleControls
          editorState={editorState}
          onToggle={toggleBlockType}
        />
      </Toolbar>
      <div className={classes.input}>
        <Draft.Editor
          ref={editorRef}
          blockStyleFn={getBlockStyle}
          customStyleMap={styleMap}
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={mapKeyToEditorCommand}
          onChange={setEditorState}
          placeholder="Write here"
          spellCheck={true}
        />
      </div>
    </div>
  )
}
