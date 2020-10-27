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
  ClickAwayListener,
  Backdrop,
  Button,
  IconButton,
  Theme,
  Toolbar,
  createStyles,
  Fade,
  fade,
  makeStyles,
  useMediaQuery,
} from '@material-ui/core'
import Code from '@material-ui/icons/Code'
import FormatQuoteIcon from '@material-ui/icons/FormatQuote'
import FormatBoldIcon from '@material-ui/icons/FormatBold'
import FormatItalicIcon from '@material-ui/icons/FormatItalic'
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined'
import SpaceBar from '@material-ui/icons/SpaceBar'
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered'
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted'
import {
  ContentBlock,
  ContentState,
  DraftEditorCommand,
  DraftHandleValue,
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  convertFromRaw,
  convertToRaw,
} from 'draft-js'
import 'draft-js/dist/Draft.css'

import { Note } from './models/Note'

export const isPlainText = (
  contentState: string | ReturnType<typeof convertToRaw>,
): boolean => {
  if (typeof contentState === 'string') {
    return true
  }

  for (const block of contentState.blocks) {
    if (
      block.depth ||
      block.type !== 'unstyled' ||
      block.inlineStyleRanges.length
    ) {
      return false
    }
  }

  return true
}

interface ButtonConfig {
  label: string
  style: string
  icon?: React.ReactElement
}

const BLOCK_TYPES: Array<ButtonConfig> = [
  {
    label: 'UL',
    style: 'unordered-list-item',
    icon: <FormatListBulletedIcon />,
  },
  { label: 'OL', style: 'ordered-list-item', icon: <FormatListNumberedIcon /> },
  { label: 'Blockquote', style: 'blockquote', icon: <FormatQuoteIcon /> },
  { label: 'Code Block', style: 'code-block', icon: <Code /> },
]

const INLINE_STYLES: Array<ButtonConfig> = [
  { label: 'Bold', style: 'BOLD', icon: <FormatBoldIcon /> },
  { label: 'Italic', style: 'ITALIC', icon: <FormatItalicIcon /> },
  { label: 'Underline', style: 'UNDERLINE', icon: <FormatUnderlinedIcon /> },
  { label: 'Monospace', style: 'CODE', icon: <SpaceBar /> },
]

const getBlockStyle = (block: ContentBlock): string => {
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
  editorState: EditorState
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
    <div>
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
  editorState: EditorState
  onToggle: (style: string) => void
}

const InlineStyleControls: React.FunctionComponent<InlineStyleControlsProps> = ({
  editorState,
  onToggle,
}) => {
  const currentStyle = editorState.getCurrentInlineStyle()
  return (
    <div>
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
    root: {
      width: '100%',
    },

    wrapper: {
      '.multiLine &': {
        boxShadow: `0 0 ${theme.spacing(2)}px ${theme.spacing(2)}px ${
          theme.palette.background.default
        }`,
      },

      background: `
        linear-gradient(
          to top,
          ${fade(theme.palette.background.default, 0)},
          ${fade(theme.palette.background.default, 1)} \
            ${theme.spacing(1) / 2}px calc(100% - ${theme.spacing(1) / 2}px),
          ${fade(theme.palette.background.default, 0)}
        ),
        linear-gradient(
          to right,
          ${theme.palette.primary.main},
          ${theme.palette.secondary.main} 
        )
      `,
    },

    backdrop: {
      backgroundColor: fade(theme.palette.background.default, 0.8),
    },

    inputWrapper: {
      outline: 'none',
      maxHeight: '50vh',
      overflowY: 'auto',

      '& .DraftEditor-editorContainer': {
        border: 0,
        padding: theme.spacing(1, 2, 1, 2),

        '& [data-contents=true] > [data-block=true]': {
          ...theme.typography.body2,
          '&:first-child': {
            ...theme.typography.body1,
          },
        },
      },
    },

    toolbar: {
      justifyContent: 'center',

      // Tool button group spacing
      '&>div:first-child': {
        marginRight: theme.spacing(4),
      },
    },
  }),
)

// TODO autofocus doesn't work on iOS12

interface NoteEditorProps {
  note?: Instance<typeof Note>
  text?: string
  rawContent?: ReturnType<typeof convertToRaw>
  placeholder?: string
  autoFocus?: boolean
  showBackdrop?: boolean
  showControls?: boolean
  showRichTextControls?: boolean
  className?: string
  wrapperClassName?: string
  inputClassName?: string
  onValue?: (
    value?: Instance<typeof Note> | ContentState,
    event?: React.KeyboardEvent | React.MouseEvent<HTMLDocument>,
  ) => void | true
  onClickAway?: () => void
  onEscape?: () => void
}

export const NoteEditor = React.forwardRef<HTMLDivElement, NoteEditorProps>(
  function (
    {
      note,
      text,
      rawContent,
      placeholder,
      autoFocus,
      showBackdrop,
      showControls,
      showRichTextControls,
      className,
      wrapperClassName,
      inputClassName,
      onValue,
      onClickAway,
      onEscape,
    },
    ref,
  ) {
    const classes = useStyles()

    const containerRef = React.useRef<HTMLDivElement>(null)
    const editorRef = React.useRef<Editor>(null)
    const backdropRef = React.useRef<HTMLDivElement>(null)

    const nodeContent = note?.nodeContent
    const contentState = React.useMemo(
      () =>
        (nodeContent && convertFromRaw(JSON.parse(nodeContent))) ||
        (rawContent && convertFromRaw(rawContent)),
      [nodeContent, rawContent],
    )

    const [editorState, setEditorState] = React.useState(() =>
      EditorState.createWithContent(
        contentState ||
          ContentState.createFromText(text ?? note?.content ?? ''),
      ),
    )

    const isMobile = useMediaQuery('(pointer: coarse) and (hover: none)')
    const [submitOnReturn, setSubmitOnReturn] = React.useState(!isMobile)

    const [key, setKey] = React.useState(1)
    const incrementKey = (): void => setKey(key + 1)

    // Focus every time Editor is regenerated
    React.useEffect(() => {
      if (autoFocus) {
        setEditorState(EditorState.moveFocusToEnd(editorState))
      }
    }, [key]) // eslint-disable-line react-hooks/exhaustive-deps

    /* React.useEffect(() => { */
    /*   containerRef.current?.scrollIntoView(false) */
    /* }) */

    const handleValue = (
      event?:
        | React.KeyboardEvent<HTMLInputElement>
        | React.MouseEvent<HTMLDocument>,
    ): void => {
      const contentState = editorState.getCurrentContent()
      const rawContent = convertToRaw(contentState)

      if (note) {
        note.setRawContentState(rawContent)
        note.setContent(contentState.getFirstBlock().getText())
      }

      if (
        onValue?.(
          note || isPlainText(rawContent)
            ? contentState.getPlainText()
            : rawContent,
          event,
        )
      ) {
        // Tell React to re-render Editor if NoteEditor doesn't unmount.
        // Hopefully this takes care of some weird state issues on iOS?
        incrementKey()

        setEditorState(
          EditorState.forceSelection(
            EditorState.push(
              EditorState.moveFocusToEnd(editorState),
              ContentState.createFromText(''),
              'remove-range',
            ),
            contentState.getSelectionAfter(),
          ),
        )
      }
    }

    const handleClickAway = (event: React.MouseEvent<HTMLDocument>): void => {
      if (onClickAway) {
        onClickAway()
      } else {
        handleValue(event)
      }
    }

    const handleKeyCommand = (
      command: DraftEditorCommand,
      editorState: EditorState,
    ): DraftHandleValue => {
      const newState = RichUtils.handleKeyCommand(editorState, command)
      if (newState) {
        setEditorState(newState)
        return 'handled'
      } else {
        return 'not-handled'
      }
    }

    const mapKeyToEditorCommand = (
      event: React.KeyboardEvent,
    ): DraftEditorCommand | null => {
      if (event.keyCode === 13) {
        if (
          (submitOnReturn && !event.shiftKey) ||
          (!submitOnReturn && event.shiftKey)
        ) {
          handleValue()
          return null
        } else {
          setSubmitOnReturn(false)
          return getDefaultKeyBinding(event)
        }
      } else if (event.keyCode === 27) {
        onEscape?.()
        return null
      } else {
        return getDefaultKeyBinding(event)
      }
    }

    const toggleBlockType = (blockType: string): void => {
      setEditorState(RichUtils.toggleBlockType(editorState, blockType))
    }

    const toggleInlineStyle = (inlineStyle: string): void => {
      setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle))
    }

    const blockCount = editorState.getCurrentContent().getBlocksAsArray().length

    return (
      <div
        ref={ref}
        className={[
          classes.root,
          blockCount > 1 ? 'multiLine' : null,
          className,
        ].join(' ')}
      >
        {
          <Backdrop
            ref={backdropRef}
            open={Boolean(blockCount > 1 && showBackdrop)}
            className={classes.backdrop}
            transitionDuration={1500}
          />
        }

        <ClickAwayListener
          mouseEvent={'onMouseDown'}
          touchEvent={'onTouchStart'}
          onClickAway={handleClickAway}
        >
          <Fade in={true} timeout={300}>
            <div
              ref={containerRef}
              className={[classes.wrapper, wrapperClassName].join(' ')}
            >
              <div
                tabIndex={-1}
                className={[classes.inputWrapper, inputClassName].join(' ')}
              >
                <Editor
                  key={key}
                  ref={editorRef}
                  blockStyleFn={getBlockStyle}
                  editorState={editorState}
                  handleKeyCommand={handleKeyCommand}
                  keyBindingFn={mapKeyToEditorCommand}
                  onChange={setEditorState}
                  placeholder={placeholder}
                  spellCheck={true}
                />
              </div>

              {blockCount > 1 && showControls && (
                <Toolbar variant="dense" className={classes.toolbar}>
                  {showRichTextControls && (
                    <>
                      <InlineStyleControls
                        editorState={editorState}
                        onToggle={toggleInlineStyle}
                      />
                      <BlockStyleControls
                        editorState={editorState}
                        onToggle={toggleBlockType}
                      />
                    </>
                  )}
                </Toolbar>
              )}
            </div>
          </Fade>
        </ClickAwayListener>
      </div>
    )
  },
)

NoteEditor.defaultProps = {
  showBackdrop: true,
  showControls: true,
  showRichTextControls: true,
}
