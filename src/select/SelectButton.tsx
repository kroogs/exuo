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
import { observer } from 'mobx-react-lite'
import {
  IconButton,
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
import SaveAltIcon from '@material-ui/icons/SaveAlt'
import SelectAllIcon from '@material-ui/icons/SelectAll'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { useGraph, Node, useActive } from 'graph'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'inherit',
      position: 'relative',
    },

    buttonGroup: {
      '& .MuiButtonGroup-groupedTextHorizontal': {
        borderRight: 'unset',
      },
      '& .MuiButtonGroup-grouped': {
        minWidth: 'unset',
      },
    },

    selectCount: {
      color: theme.palette.primary.main,
      fontSize: 12,
      position: 'absolute',
      right: -theme.spacing(1),
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
      border: `.1px solid ${theme.palette.divider}`,
    },

    selectMenu: {
      outline: 0,
    },
  }),
)

interface DownloadProps {
  blob?: Blob | null
  onComplete: () => void
}

const Download: React.FunctionComponent<DownloadProps> = ({
  blob,
  onComplete,
}) => {
  const ref = React.useRef<HTMLAnchorElement>(null)
  const [url, setUrl] = React.useState('')

  React.useEffect(() => {
    if (url && ref.current) {
      ref.current.click()

      URL.revokeObjectURL(url)
      setUrl('')

      onComplete()
    } else if (blob) {
      setUrl(URL.createObjectURL(blob))
    }
  }, [blob, ref, url, onComplete])

  return <a ref={ref} href={url} style={{ display: 'none' }} children={null} />
}

interface SelectButtonProps extends IconButtonProps {
  node: Instance<typeof Node>
  onClick: React.MouseEventHandler
  className?: string
}

export const SelectButton: React.FunctionComponent<SelectButtonProps> = observer(
  ({ node, className, onClick, ...extraProps }) => {
    const graph = useGraph()
    const active = useActive()
    const classes = useStyles()
    const anchorRef = React.useRef<HTMLButtonElement>(null)

    const selectedCount = graph.selectedNodeCount

    const [open, setOpen] = React.useState(false)
    const [showAltMenu, setShowAltMenu] = React.useState(false)
    const [download, setDownload] = React.useState(null)

    React.useEffect(() => {
      const downHandler = (event: KeyboardEvent): void => {
        if (event.key === 'Alt') {
          setShowAltMenu(true)
        }
      }

      const upHandler = (event: KeyboardEvent): void => {
        if (event.key === 'Alt') {
          setShowAltMenu(false)
        }
      }

      document.addEventListener('keydown', downHandler)
      document.addEventListener('keyup', upHandler)

      return () => {
        document.removeEventListener('keydown', downHandler)
        document.removeEventListener('keyup', upHandler)
      }
    })

    return (
      <div className={[classes.root, className].join(' ')}>
        <Download blob={download} onComplete={() => setDownload(null)} />

        {selectedCount > 0 && (
          <span className={classes.selectCount}>{selectedCount}</span>
        )}

        <IconButton
          color="primary"
          ref={anchorRef}
          onClick={
            graph.selectedNodes.size ? () => setOpen(value => !value) : onClick
          }
          className={classes.selectButton}
          {...extraProps}
        >
          <SelectAllIcon />
        </IconButton>

        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          disablePortal
          className={classes.popper}
        >
          {({ placement }) => (
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

                  {showAltMenu ? (
                    <MenuItem
                      onClick={() => {
                        graph.linkSelectedNodes(active)
                        setOpen(false)
                      }}
                    >
                      <FlipToBackIcon />
                      Link here
                    </MenuItem>
                  ) : (
                    <MenuItem
                      disabled
                      onClick={() => {
                        setOpen(false)
                      }}
                    >
                      <FileCopyIcon />
                      Copy here
                    </MenuItem>
                  )}

                  <MenuItem
                    divider
                    onClick={() => {
                      graph.moveSelectedNodes(active)
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
                    divider
                    onClick={() => {
                      setDownload(graph.exportSelectedNodes())
                      setOpen(false)
                    }}
                  >
                    <SaveAltIcon />
                    Export
                  </MenuItem>

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
          )}
        </Popper>
      </div>
    )
  },
)
