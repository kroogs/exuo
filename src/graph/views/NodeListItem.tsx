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
import {
  Chip,
  Checkbox,
  Button,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core'
import AccountTreeIcon from '@material-ui/icons/AccountTree'
import ChevronRight from '@material-ui/icons/ChevronRight'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import 'draft-js/dist/Draft.css'
import { Instance } from 'mobx-state-tree'

import { Link } from 'route'
import { useGraph, Node } from 'graph'
import LabelEditor from './LabelEditor'

const useNavigate = () => (path: string) => undefined

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    listItem: {
      [theme.breakpoints.up('sm')]: {
        borderRadius: theme.shape.borderRadius,
      },
    },
    itemText: {
      display: 'inline-block',
      margin: 0,
      overflowX: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      ...theme.typography.body1,
    },
    listItemSelectCheckbox: {
      padding: theme.spacing(0, 1, 0, 1),
      '&:hover, &.Mui-checked:hover': {
        backgroundColor: 'unset',
      },
    },
    listItemIcon: {
      minWidth: 'auto',
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
  const [isFocused, setIsFocused] = React.useState(false)
  /* const [editorState, setEditorState] = React.useState(() => */
  /*   EditorState.createEmpty(), */
  /* ) */
  const isMouseDown = React.useRef(false)
  const timer = React.useRef<ReturnType<typeof setTimeout>>()
  const navigate = useNavigate()

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

        /* setIsFocused(true) */

        graph.toggleActiveMode('select')
        if (graph.activeModes.includes('select')) {
          graph.toggleSelectNode(node)
        }
      }, 390)
    }

    const upHandler: React.EventHandler<React.SyntheticEvent> = e => {
      e.preventDefault()

      if (!isMouseDown.current) {
        return
      }

      if (graph.activeModes.includes('select')) {
        graph.toggleSelectNode(node)
      } else if (graph.activeModes.includes('edit')) {
        /* setIsFocused(true) */
      } else {
        navigate(`/node/${node.id}/`)
      }

      isMouseDown.current = false
      if (timer.current) {
        clearTimeout(timer.current)
      }
    }

    const isSelected = graph.selectedNodes.includes(node.id)

    return (
      <ListItem
        button
        onMouseDown={downHandler}
        onTouchStart={downHandler}
        onMouseUp={upHandler}
        onTouchEnd={upHandler}
        component={'li'}
        className={classes.listItem}
      >
        {graph.activeModes.includes('select') && (
          <Checkbox
            checked={isSelected}
            tabIndex={-1}
            color="primary"
            edge="start"
            className={classes.listItemSelectCheckbox}
          />
        )}
        {isFocused ? (
          <LabelEditor createMode node={node} />
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
                to={`/node/${node.id}/`}
                component={Link}
                className={classes.chip}
              />
            </>
          )}

          {showChildCount && !showEdgeChips && node.childCount > 0 && (
            <Button
              endIcon={<ChevronRight />}
              to={`/node/${node.id}/`}
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
