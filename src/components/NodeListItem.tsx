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
import { useNavigate, Link } from '@reach/router'
import {
  Checkbox,
  Chip,
  InputBase,
  Button,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core'
import AccountTreeIcon from '@material-ui/icons/AccountTree'
import NoteIcon from '@material-ui/icons/Note'
import ChevronRight from '@material-ui/icons/ChevronRight'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Editor, EditorState } from 'draft-js'
import 'draft-js/dist/Draft.css'
import { Instance } from 'mobx-state-tree'

import { useGraph, Node } from 'graph'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    listItem: {},
    itemText: {
      display: 'inline-block',
      margin: 0,
      overflowX: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      ...theme.typography.body1,
    },
    listItemIcon: {
      minWidth: 'auto',
    },
    checkbox: {
      padding: theme.spacing(0, 1, 0, 1),
      '&:hover, &.Mui-checked:hover': {
        backgroundColor: 'unset',
      },
    },
    editItemText: {
      display: 'inline-block',
      margin: 0,
      overflowX: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      ...theme.typography.body1,
      '& input': {
        height: 'auto',
        padding: 0,
      },
    },
    chip: {
      pointerEvents: 'auto',
      color: theme.palette.text.hint,
      backgroundColor: 'transparent',
      '&:hover': {
        color: theme.palette.primary.main,
        cursor: 'auto',
      },
      '& svg': {
        pointerEvents: 'auto',
        color: 'inherit',
      },
      '&:last-child .MuiChip-label': {
        paddingRight: 0,
      },
    },
    secondaryActions: {
      right: 0,
      color: theme.palette.text.secondary,
    },
    childButton: {
      color: theme.palette.text.secondary,
      '&:hover, &:focus': {
        color: theme.palette.primary.main,
        background: 'inherit',
      },
    },
  }),
)

interface NodeListItemProps {
  node: Instance<typeof Node>
}

const NodeListItem: React.FunctionComponent<NodeListItemProps> = ({
  node,
  ...props
}) => {
  const classes = useStyles()
  const navigate = useNavigate()
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty(),
  )
  const isMouseDown = React.useRef(false)
  const timer = React.useRef<ReturnType<typeof setTimeout>>()

  return useGraph(graph => {
    const listConfig = graph.Config.get('user')?.get('lists')

    const showChildCount = listConfig?.get('showChildCount')
    const showEdgeChips = listConfig?.get('showEdgeChips')

    const downHandler: React.EventHandler<React.SyntheticEvent> = e => {
      e.preventDefault()

      isMouseDown.current = true
      timer.current = setTimeout(() => {
        isMouseDown.current = false
        if (timer.current) {
          clearTimeout(timer.current)
        }

        graph.toggleEditMode()
        if (graph.editMode) {
          graph.toggleSelectNode(node)
        }
      }, 390)
    }

    const upHandler: React.EventHandler<React.SyntheticEvent> = e => {
      e.preventDefault()

      if (!isMouseDown.current) {
        return
      }

      if (graph.editMode) {
        graph.toggleSelectNode(node)
      } else {
        navigate(`/${node.id}/`)
      }

      isMouseDown.current = false
      if (timer.current) {
        clearTimeout(timer.current)
      }
    }

    return (
      <ListItem
        button
        component={'li'}
        onMouseDown={downHandler}
        onTouchStart={downHandler}
        onMouseUp={upHandler}
        onTouchEnd={upHandler}
        className={classes.listItem}
      >
        {graph.editMode ? (
          <>
            <Checkbox
              checked={graph.selectedNodes.includes(node.id)}
              tabIndex={-1}
              color="primary"
              edge="start"
              className={classes.checkbox}
            />
            <ListItemText
              primary={node.label}
              primaryTypographyProps={{ display: 'inline' }}
              className={classes.itemText}
            />
          </>
        ) : (
          <ListItemText
            primary={node.label}
            primaryTypographyProps={{ display: 'inline' }}
            className={classes.itemText}
          />
        )}
        <ListItemSecondaryAction className={classes.secondaryActions}>
          {showEdgeChips && (
            <>
              <Chip
                label={node.childCount}
                icon={<AccountTreeIcon />}
                size="small"
                to={`/${node.id}/`}
                component={Link}
                className={classes.chip}
              />
            </>
          )}

          {showChildCount && !showEdgeChips && node.childCount > 0 && (
            <Button
              endIcon={<ChevronRight />}
              to={`/${node.id}/`}
              component={Link}
              className={classes.childButton}
            >
              {node.childCount}
            </Button>
          )}
        </ListItemSecondaryAction>
      </ListItem>
    )
  })
}

export default NodeListItem
