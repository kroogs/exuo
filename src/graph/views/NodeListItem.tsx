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
  Collapse,
  Button,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  ListItemIcon,
} from '@material-ui/core'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import { createStyles, makeStyles, fade, Theme } from '@material-ui/core/styles'
import { Instance } from 'mobx-state-tree'
import { Link, useNavigate } from '@reach/router'

import { makeUrl } from 'route'
import { useGraph, Node, LabelEditor, EdgeList } from 'graph'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listItem: {
      cursor: 'pointer',

      transition: theme.transitions.create(['color'], {
        duration: theme.transitions.duration.standard,
      }),

      '&:hover, &:focus': {
        color: theme.palette.primary.main,
      },

      '&.editMode': {
        cursor: 'text',
        color: 'unset',
      },

      '&.selectMode': {
        cursor: 'default',
        color: 'unset',
      },

      '&.Mui-selected': {
        background: `

        linear-gradient(
          to top,
          ${fade(theme.palette.background.default, 0)},
          ${fade(theme.palette.background.default, 0.8)} 6% 94%,
          ${fade(theme.palette.background.default, 0)}
        ),
        linear-gradient(
          to right,
          ${theme.palette.primary.main},
          ${theme.palette.secondary.main} 
        )`,

        '&:hover': { color: 'unset' },
        '& a:hover': { color: 'unset' },
      },
    },

    childList: {
      marginLeft: theme.spacing(2),
      padding: 0,
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
      cursor: 'pointer',
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
  const [isExpanded, setIsExpanded] = React.useState(false)
  const toggleIsExpanded = (): void => setIsExpanded(value => !value)

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

    const handleItemClick: React.EventHandler<React.MouseEvent> = e => {
      e.preventDefault()

      if (e.altKey) {
        toggleIsExpanded()
      } else if (graph.activeModes.includes('select')) {
        graph.toggleSelectNode(node, parentNode)
      } else if (graph.activeModes.includes('edit')) {
        setIsEditing(true)
      } else if (e.metaKey || e.ctrlKey) {
        graph.toggleActiveMode('select')
        graph.toggleSelectNode(node, parentNode)
      } else {
        navigate(makeUrl(`/node/${node.id}/`))
      }
    }

    const handleArrowClick: React.EventHandler<React.MouseEvent> = e => {
      if (e.altKey) {
        e.preventDefault()
        toggleIsExpanded()
      }

      if (
        graph.activeModes.includes('select') ||
        graph.activeModes.includes('edit')
      ) {
        return
      }

      e.preventDefault()
      toggleIsExpanded()
    }

    const isSelected = graph.selectedNodes.get(parentNode.id)?.includes(node.id)
    const newlinePosition = node.label.indexOf('\n')

    return (
      <>
        <ListItem
          component={'li'}
          onClick={handleItemClick}
          selected={isSelected}
          className={[
            classes.listItem,
            graph.activeModes.includes('edit') ? 'editMode' : '',
            graph.activeModes.includes('select') ? 'selectMode' : '',
          ].join(' ')}
        >
          {isEditing ? (
            <LabelEditor
              label={node.label}
              onValue={value => {
                /* setIsEditing(false) */
                /* if (value) { */
                /*   node.setLabel(value) */
                /* } */
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
                onClick={handleArrowClick}
                className={classes.childButton}
                endIcon={
                  node.childCount > 0 && isExpanded ? (
                    <KeyboardArrowDownIcon />
                  ) : (
                    <ChevronRightIcon />
                  )
                }
                size="small"
              >
                {node.childCount > 0 && node.childCount}
              </Button>
            )}
          </ListItemSecondaryAction>
        </ListItem>
        {node.childCount > 0 && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <EdgeList
              node={node}
              edgeTag="child"
              className={classes.childList}
            />
          </Collapse>
        )}
      </>
    )
  })
}

NodeListItem.defaultProps = {
  expandSecondaryTypography: true,
}
