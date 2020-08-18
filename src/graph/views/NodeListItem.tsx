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
import { Link, useNavigate } from '@reach/router'

import { makeUrl } from 'route'
import { useGraph, Node, LabelEditor } from 'graph'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    listItem: {
      '&:hover': { color: theme.palette.primary.main },
      '&.MuiListItem-button': {
        backgroundColor: 'unset',
      },
      [theme.breakpoints.up('sm')]: {
        borderRadius: theme.shape.borderRadius,
      },
    },
    itemText: {
      margin: 0,
      overflowX: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',

      '& .MuiListItemText-primary': {
        display: 'inline',
      },
      '& .MuiListItemText-secondary': {
        display: 'inline',
        paddingLeft: theme.spacing(1),
      },
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
      color: theme.palette.text.primary,
      right: 0,
    },
    childButton: {
      color: theme.palette.text.primary,
      '&:hover, &:focus': {
        color: theme.palette.primary.main,
        background: 'inherit',
      },
    },
  }),
)

interface NodeListItemProps {
  node: Instance<typeof Node>
  expand?: boolean
}

export const NodeListItem: React.FunctionComponent<NodeListItemProps> = ({
  node,
  expand,
  ...props
}) => {
  const classes = useStyles()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = React.useState(false)
  const isMouseDown = React.useRef(false)
  const timer = React.useRef<ReturnType<typeof setTimeout>>()

  return useGraph(graph => {
    const listConfig = graph.Config.get('user')?.get('lists')
    const showChildCount = listConfig?.get('showChildCount')
    const showEdgeChips = listConfig?.get('showEdgeChips')

    const downHandler: React.EventHandler<React.SyntheticEvent> = e => {
      isMouseDown.current = true
      e.persist()

      timer.current = setTimeout(() => {
        e.preventDefault()

        isMouseDown.current = false
        if (timer.current) {
          clearTimeout(timer.current)
        }

        graph.toggleActiveMode('select')
        if (graph.activeModes.includes('select')) {
          graph.toggleSelectNode(node)
        }
      }, 390)
    }

    const upHandler: React.EventHandler<React.SyntheticEvent> = e => {
      if (!isMouseDown.current) {
        return
      }

      if (graph.activeModes.includes('select')) {
        graph.toggleSelectNode(node)
      } else if (graph.activeModes.includes('edit')) {
        setIsEditing(true)
      } else {
        navigate(makeUrl(`/node/${node.id}`))
      }

      isMouseDown.current = false
      if (timer.current) {
        clearTimeout(timer.current)
      }
    }

    const isSelected = graph.selectedNodes.includes(node.id)
    const newlinePosition = node.label.indexOf('\n')

    return (
      <ListItem
        button
        disableRipple
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
        {isEditing ? (
          <LabelEditor
            label={node.label}
            onValue={value => {
              setIsEditing(false)
              if (value) {
                node.setLabel(value)
              }
            }}
          />
        ) : (
          <ListItemText
            primary={
              newlinePosition > 0
                ? node.label.slice(0, newlinePosition)
                : node.label
            }
            secondary={
              newlinePosition > 0
                ? node.label.slice(newlinePosition + 2)
                : undefined
            }
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
                to={makeUrl(`/node/${node.id}/`)}
                component={Link}
                className={classes.chip}
              />
            </>
          )}

          {showChildCount && !showEdgeChips && node.childCount > 0 && (
            <Button
              endIcon={<ChevronRight />}
              to={makeUrl(`/node/${node.id}/`)}
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

NodeListItem.defaultProps = {
  expand: false,
}
