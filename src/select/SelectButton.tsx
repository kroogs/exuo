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
  IconButton,
  Button,
  ButtonGroup,
  ClickAwayListener,
  Paper,
  Popper,
  MenuItem,
  MenuList,
  IconButtonProps,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import FlipToBackIcon from '@material-ui/icons/FlipToBackOutlined'
import CancelIcon from '@material-ui/icons/CancelOutlined'
import FolderIcon from '@material-ui/icons/FolderOutlined'
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined'
import CropFreeIcon from '@material-ui/icons/CropFreeOutlined'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { useGraph, Node } from 'graph'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'inherit',
    },
    buttonGroup: {
      '& .MuiButtonGroup-groupedTextHorizontal': {
        borderRight: 'unset',
      },
      '& .MuiButtonGroup-grouped': {
        minWidth: 'unset',
      },
    },
    selectButton: {},
    deleteButton: {
      color: theme.palette.error.main,
    },
    popper: {
      '& svg': {
        marginRight: theme.spacing(1),
      },
    },
    paper: {
      border: `.01px solid ${theme.palette.divider}`,
    },
    selectMenu: {
      outline: 0,
    },
  }),
)

interface SelectButtonProps extends IconButtonProps {
  node: Instance<typeof Node>
  onClick: React.MouseEventHandler
  className?: string
}

export const SelectButton: React.FunctionComponent<SelectButtonProps> = ({
  node,
  className,
  onClick,
  ...extraProps
}) => {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLButtonElement>(null)

  return useGraph(graph => (
    <div className={[classes.root, className].join(' ')}>
      <IconButton
        ref={anchorRef}
        onClick={
          graph.selectedNodes.size ? () => setOpen(value => !value) : onClick
        }
        className={classes.selectButton}
        {...extraProps}
      >
        <CropFreeIcon />
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        disablePortal
        className={classes.popper}
      >
        {({ placement }) => {
          graph.setCursorNode(node)
          return (
            <ClickAwayListener
              onClickAway={e => {
                e.preventDefault()
                setOpen(false)
              }}
            >
              <Paper elevation={0} className={classes.paper}>
                <MenuList dense className={classes.selectMenu}>
                  <MenuItem
                    divider
                    onClick={() => {
                      graph.removeSelectedNodes()
                      setOpen(false)
                    }}
                    className={classes.deleteButton}
                  >
                    <DeleteIcon />
                    Remove
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      graph.linkSelectedNodes()
                      setOpen(false)
                    }}
                  >
                    <FlipToBackIcon />
                    Link here
                  </MenuItem>

                  <MenuItem
                    disabled
                    onClick={() => {
                      setOpen(false)
                    }}
                  >
                    <FileCopyIcon />
                    Copy here
                  </MenuItem>

                  <MenuItem
                    divider
                    onClick={() => {
                      graph.moveSelectedNodes()
                      setOpen(false)
                    }}
                  >
                    <FolderIcon />
                    Move here
                  </MenuItem>

                  {/* <MenuItem */}
                  {/*   onClick={() => { */}
                  {/*     graph.deleteSelectedNodes() */}
                  {/*     setOpen(false) */}
                  {/*   }} */}
                  {/*   className={classes.deleteButton} */}
                  {/* > */}
                  {/*   <DeleteIcon /> */}
                  {/*   Delete */}
                  {/* </MenuItem> */}

                  <MenuItem
                    onClick={() => {
                      graph.clearSelectedNodes()
                      setOpen(false)
                    }}
                  >
                    <CancelIcon />
                    Clear selection
                  </MenuItem>
                </MenuList>
              </Paper>
            </ClickAwayListener>
          )
        }}
      </Popper>
    </div>
  ))
}
