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
} from '@material-ui/core'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import { createStyles, makeStyles, fade, Theme } from '@material-ui/core/styles'
import { Instance } from 'mobx-state-tree'
import { Link, useNavigate } from '@reach/router'

import { makeUrl } from 'route'
import { NoteEditor } from 'note'
import { useGraph, Node, EdgeList, useActive } from 'graph'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    itemContainer: {
      '&.isExpanded': {
        /* background: theme.palette.background.default, */
        /* position: 'sticky', */
        /* top: 65, */
      },
    },

    listItem: {
      position: 'relative',
      cursor: 'pointer',

      transition: theme.transitions.create(['color', 'background'], {
        duration: theme.transitions.duration.shortest,
      }),

      '&:hover': {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.background.paper,
      },

      '&.editMode': {
        cursor: 'default',
        color: 'unset',
      },

      '&.selectMode': {
        cursor: 'default',
        color: 'unset',
      },

      '&.isEditing, &.isEditing + li': {
        borderColor: 'transparent',
      },

      '&.Mui-selected': {
        background: `
          linear-gradient(
            to top,
            ${fade(theme.palette.background.default, 0)},
            ${fade(theme.palette.background.default, 0.9)} \
              ${theme.spacing(1) / 2}px calc(100% - ${theme.spacing(1) / 2}px),
            ${fade(theme.palette.background.default, 0)}
          ),
          linear-gradient(
            to right,
            ${theme.palette.primary.main},
            ${theme.palette.secondary.main} 
          )
        `,

        '&:hover': { color: 'unset' },
        '& a:hover': { color: 'unset' },
      },
    },

    childList: {
      marginLeft: theme.spacing(3),
      padding: 0,
    },

    itemText: {
      margin: 0,
      overflowX: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',

      '.isEditing &': {
        opacity: 0,
      },

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

    noteEditor: {
      cursor: 'default',
      position: 'absolute',
      top: 0,
      left: 0,
    },

    noteEditorInput: {
      cursor: 'text',
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

      paddingRight: theme.spacing(2),
      paddingLeft: theme.spacing(2),

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
  expanded?: boolean
  className?: string
}

export const NodeListItem: React.FunctionComponent<NodeListItemProps> = ({
  node,
  parentNode,
  expandSecondaryTypography,
  expanded,
  className,
}) => {
  const classes = useStyles()
  const navigate = useNavigate()
  const active = useActive()
  const [isEditing, setIsEditing] = React.useState(false)

  return useGraph(graph => {
    const config = active?.getConfig()
    const isExpanded =
      config?.getItem(parentNode.id, node.id)?.expanded ?? false
    const isSelected = graph.selectedNodes.get(parentNode.id)?.includes(node.id)

    const toggleExpand = (): void => {
      const configItem = active
        ?.getConfig(true)
        ?.getItem(parentNode.id, node.id, true)
      configItem.setExpanded(!configItem.expanded)
    }

    const handleItemClick: React.EventHandler<React.MouseEvent> = e => {
      e.preventDefault()

      if (e.altKey) {
        setIsEditing(true)
        graph.setActiveMode('edit')
      } else if (e.shiftKey) {
        setIsEditing(false)
        graph.setActiveMode('select')
        graph.toggleSelectNode(node, parentNode)
      } else if (graph.activeModes.includes('select')) {
        graph.toggleSelectNode(node, parentNode)
      } else if (graph.activeModes.includes('edit')) {
        setIsEditing(true)
      } else {
        navigate(makeUrl(`/node/${node.id}/`))
      }
    }

    const handleArrowClick: React.EventHandler<React.MouseEvent> = e => {
      e.preventDefault()
      toggleExpand()
      /* if (e.altKey) { */
      /*   e.preventDefault() */
      /*   toggleExpand() */
      /*   return */
      /* } */
    }

    let primaryText = node.id
    let secondaryText = undefined

    const rawContent = node.content?.toJSON?.()

    if (typeof node.content === 'string') {
      const newlinePosition = node.content.indexOf('\n')

      primaryText =
        newlinePosition > 0
          ? node.content.slice(0, newlinePosition)
          : node.content

      secondaryText =
        newlinePosition > 0
          ? node.content.slice(newlinePosition + 1)
          : undefined
    } else if (rawContent) {
      primaryText = rawContent.blocks[0].text
      secondaryText = rawContent.blocks[1]?.text
    }

    return (
      <>
        <ListItem
          onClick={handleItemClick}
          selected={isSelected}
          component="li"
          ContainerProps={{
            className: [
              classes.itemContainer,
              node.childCount > 0 && isExpanded ? 'isExpanded' : '',
              className,
            ].join(' '),
          }}
          className={[
            classes.listItem,
            graph.activeModes.includes('edit') ? 'editMode' : '',
            graph.activeModes.includes('select') ? 'selectMode' : '',
            isEditing ? 'isEditing' : '',
          ].join(' ')}
        >
          {isEditing && (
            <NoteEditor
              autoFocus
              text={rawContent ? undefined : node.content}
              rawContent={rawContent}
              className={classes.noteEditor}
              inputClassName={classes.noteEditorInput}
              onValue={value => {
                setIsEditing(false)
                if (value) {
                  if (typeof value === 'string') {
                    node.setContent(value)
                  } else if (Object.keys(value).includes('blocks')) {
                    node.setContent(value)
                  }
                }
              }}
              onEscape={() => {
                setIsEditing(false)
                graph.unsetActiveMode('edit')
              }}
            />
          )}

          <ListItemText
            primary={primaryText}
            secondary={secondaryText}
            className={[
              classes.itemText,
              expandSecondaryTypography ? 'expand' : '',
            ].join(' ')}
          />

          {!isEditing && (
            <ListItemSecondaryAction className={classes.secondaryActions}>
              {(node.childCount > 0 ||
                graph.activeModes.includes('select') ||
                graph.activeModes.includes('edit')) && (
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
          )}
        </ListItem>

        {node.childCount > 0 && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <EdgeList
              inner
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
