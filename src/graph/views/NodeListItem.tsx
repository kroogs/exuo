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
  Checkbox,
  Button,
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core'
import Check from '@material-ui/icons/Check'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import { createStyles, makeStyles, fade, Theme } from '@material-ui/core/styles'
import { Instance } from 'mobx-state-tree'
import { Link, useNavigate } from '@reach/router'

import { NoteEditor } from 'note'
import { makeUrl } from 'route'
import { useGraph, Node, LabelEditor } from 'graph'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listItem: {
      marginBottom: '1px',
      transition: theme.transitions.create(['color', 'background'], {
        duration: theme.transitions.duration.shortest,
      }),

      '&:hover': { color: theme.palette.primary.main },
      '&.editMode:hover': {
        cursor: 'text',
        color: 'unset',
      },

      '&.selectMode:hover': {
        color: 'unset',
      },

      '&.MuiListItem-button:not(.isSelected):hover': {
        backgroundColor: 'unset',
      },

      '&.isSelected': {
        backgroundColor: fade(theme.palette.primary.main, 0.3),
        '&:hover': { color: 'unset' },
        '& a:hover': { color: 'unset' },
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

      '&.expand': {
        '& .MuiListItemText-secondary': {
          display: 'block',
          paddingLeft: 0,
        },
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

    secondaryActions: {
      right: 0,
    },

    childButton: {
      color: theme.palette.text.primary,
      transition: theme.transitions.create(['color'], {
        duration: theme.transitions.duration.shortest,
      }),

      // Ensure ChevronRight lines up without a label
      minWidth: 'unset',
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),

      '&:hover, &:focus': {
        color: theme.palette.primary.main,
        background: 'inherit',
      },
    },
  }),
)

interface NodeListItemProps {
  node: Instance<typeof Node>
  parentNode: Instance<typeof Node>
  expandSecondaryTypography?: boolean
}

export const NodeListItem: React.FunctionComponent<NodeListItemProps> = ({
  node,
  parentNode,
  expandSecondaryTypography,
  ...props
}) => {
  const classes = useStyles()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = React.useState(false)
  /* const isMouseDown = React.useRef(false) */
  /* const timer = React.useRef<ReturnType<typeof setTimeout>>() */

  return useGraph(graph => {
    /* const downHandler: React.EventHandler<React.SyntheticEvent> = e => { */
    /*   e.preventDefault() */
    /*   e.persist() */

    /*   isMouseDown.current = true */

    /*   timer.current = setTimeout(() => { */
    /*     isMouseDown.current = false */

    /*     if (graph.activeModes.includes('edit')) { */
    /*       return */
    /*     } */

    /*     if (timer.current) { */
    /*       clearTimeout(timer.current) */
    /*     } */

    /*     graph.toggleActiveMode('select') */
    /*     if (graph.activeModes.includes('select')) { */
    /*       graph.toggleSelectNode(node) */
    /*     } */
    /*   }, 190) */
    /* } */

    /* const upHandler: React.EventHandler<React.SyntheticEvent> = e => { */
    /*   if (!isMouseDown.current) { */
    /*     return */
    /*   } */

    /*   isMouseDown.current = false */
    /*   e.preventDefault() */

    /*   if (graph.activeModes.includes('select')) { */
    /*     graph.toggleSelectNode(node) */
    /*   } else if (graph.activeModes.includes('edit')) { */
    /*     setIsEditing(true) */
    /*   } else { */
    /*     navigate(makeUrl(`/node/${node.id}`)) */
    /*   } */

    /*   if (timer.current) { */
    /*     clearTimeout(timer.current) */
    /*   } */
    /* } */

    const clickHandler: React.EventHandler<React.MouseEvent> = e => {
      e.preventDefault()

      if (graph.activeModes.includes('select')) {
        graph.toggleSelectNode(node)
      } else if (graph.activeModes.includes('edit')) {
        setIsEditing(true)
      } else if (e.metaKey || e.ctrlKey) {
        graph.toggleActiveMode('select')
        graph.toggleSelectNode(node)
      } else {
        navigate(makeUrl(`/node/${node.id}/`))
      }
    }

    const isSelected = graph.selectedNodes.get(parentNode.id)?.includes(node.id)
    const newlinePosition = node.label.indexOf('\n')

    return (
      <ListItem
        button
        disableRipple
        component={'li'}
        onClick={clickHandler}
        className={[
          classes.listItem,
          graph.activeModes.includes('edit') ? 'editMode' : '',
          graph.activeModes.includes('select') ? 'selectMode' : '',
          isSelected ? 'isSelected' : '',
        ].join(' ')}
      >
        {/* <NoteEditor text={node.label} /> */}
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
                ? node.label.slice(newlinePosition + 1)
                : undefined
            }
            className={[
              classes.itemText,
              expandSecondaryTypography ? 'expand' : '',
            ].join(' ')}
          />
        )}
        <ListItemSecondaryAction className={classes.secondaryActions}>
          {(node.childCount > 0 || graph.activeModes.includes('select')) && (
            <Button
              to={makeUrl(`/node/${node.id}/`)}
              component={Link}
              className={classes.childButton}
              endIcon={<ChevronRightIcon />}
              size="small"
            >
              {node.childCount > 0 && node.childCount}
            </Button>
          )}
        </ListItemSecondaryAction>
      </ListItem>
    )
  })
}

NodeListItem.defaultProps = {
  expandSecondaryTypography: true,
}
