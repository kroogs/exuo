/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Ty Dira */

import React from 'react'

import AccountCircle from '@material-ui/icons/AccountCircle'
import Box from '@material-ui/core/Box'
import AppBar from '@material-ui/core/AppBar'
import Avatar from '@material-ui/core/Avatar'
import Paper from '@material-ui/core/Paper'
import Badge from '@material-ui/core/Badge'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import DeleteIcon from '@material-ui/icons/Delete'
import FolderIcon from '@material-ui/icons/Folder'
import IconButton from '@material-ui/core/IconButton'
import InputBase from '@material-ui/core/InputBase'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import MailIcon from '@material-ui/icons/Mail'
import Menu from '@material-ui/core/Menu'
import MenuIcon from '@material-ui/icons/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreIcon from '@material-ui/icons/MoreVert'
import NotificationsIcon from '@material-ui/icons/Notifications'
import SearchIcon from '@material-ui/icons/Search'
import Input from '@material-ui/core/Input'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { fade, makeStyles, Theme, createStyles } from '@material-ui/core/styles'

import { useObserver } from 'mobx-react-lite'
import { Instance, IAnyModelType } from 'mobx-state-tree'

import { Graph, useStore } from 'store'
import { EdgeList } from './EdgeList'
import { PropertyList } from './PropertyList'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
    },
    pane: {
      overflowY: 'auto',
      maxHeight: '100vh',
      flexDirection: 'column',
      position: 'relative',
    },
    addRecord: {
      top: 0,
      position: 'sticky',
      backgroundColor: theme.palette.background.default,
    },
    title: {},
    bar: {
      backgroundColor: theme.palette.common.white,
    },
    grid: {
      width: '100%',
    },
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    searchIcon: {
      width: theme.spacing(7),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 7),
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: 200,
      },
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
    sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
  }),
)

interface RootRegionProps {
  graph: Instance<typeof Graph>
}

export const RootRegion: React.FunctionComponent<RootRegionProps> = ({
  graph,
}) => {
  /* const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null) */
  /* const [ */
  /*   mobileMoreAnchorEl, */
  /*   setMobileMoreAnchorEl, */
  /* ] = React.useState<null | HTMLElement>(null) */

  /* const isMenuOpen = Boolean(anchorEl) */
  /* const isMobileMenuOpen = Boolean(mobileMoreAnchorEl) */

  /* const handleProfileMenuOpen = ( */
  /*   event: React.MouseEvent<HTMLElement>, */
  /* ): void => { */
  /*   setAnchorEl(event.currentTarget) */
  /* } */

  /* const handleMobileMenuClose = (): void => { */
  /*   setMobileMoreAnchorEl(null) */
  /* } */

  /* const handleMenuClose = (): void => { */
  /*   setAnchorEl(null) */
  /*   handleMobileMenuClose() */
  /* } */

  /* const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>): void => { */
  /*   setMobileMoreAnchorEl(event.currentTarget) */
  /* } */

  /* const menuId = 'primary-search-account-menu' */
  /* const renderMenu = ( */
  /*   <Menu */
  /*     anchorEl={anchorEl} */
  /*     anchorOrigin={{ vertical: 'top', horizontal: 'right' }} */
  /*     id={menuId} */
  /*     keepMounted */
  /*     transformOrigin={{ vertical: 'top', horizontal: 'right' }} */
  /*     open={isMenuOpen} */
  /*     onClose={handleMenuClose} */
  /*   > */
  /*     <MenuItem onClick={handleMenuClose}>Profile</MenuItem> */
  /*     <MenuItem onClick={handleMenuClose}>My account</MenuItem> */
  /*   </Menu> */
  /* ) */

  /* const mobileMenuId = 'primary-search-account-menu-mobile' */
  /* const renderMobileMenu = ( */
  /*   <Menu */
  /*     anchorEl={mobileMoreAnchorEl} */
  /*     anchorOrigin={{ vertical: 'top', horizontal: 'right' }} */
  /*     id={mobileMenuId} */
  /*     keepMounted */
  /*     transformOrigin={{ vertical: 'top', horizontal: 'right' }} */
  /*     open={isMobileMenuOpen} */
  /*     onClose={handleMobileMenuClose} */
  /*   > */
  /*     <MenuItem> */
  /*       <IconButton aria-label="show 4 new mails" color="inherit"> */
  /*         <Badge badgeContent={4} color="secondary"> */
  /*           <MailIcon /> */
  /*         </Badge> */
  /*       </IconButton> */
  /*       <p>Messages</p> */
  /*     </MenuItem> */
  /*     <MenuItem> */
  /*       <IconButton aria-label="show 11 new notifications" color="inherit"> */
  /*         <Badge badgeContent={11} color="secondary"> */
  /*           <NotificationsIcon /> */
  /*         </Badge> */
  /*       </IconButton> */
  /*       <p>Notifications</p> */
  /*     </MenuItem> */
  /*     <MenuItem onClick={handleProfileMenuOpen}> */
  /*       <IconButton */
  /*         aria-label="account of current user" */
  /*         aria-controls="primary-search-account-menu" */
  /*         aria-haspopup="true" */
  /*         color="inherit" */
  /*       > */
  /*         <AccountCircle /> */
  /*       </IconButton> */
  /*       <p>Profile</p> */
  /*     </MenuItem> */
  /*   </Menu> */
  /* ) */

  const classes = useStyles()

  const first = graph.createNode()
  const last = graph.createNode()

  let prev = first

  for (let i = 0; i < 5; i++) {
    const node = graph.createNode()

    node.addEdge('last', last)
    node.addEdge('first', first)
    first.addEdge('child', node)

    if (prev) {
      prev.addEdge('next', node)
      node.addEdge('prev', prev)
    }

    prev = node
  }

  return useObserver(() => {
    /* const graph = store.nodesById.values() */
    /* const graph = store.nodesById.get('default') */
    /* const rows: Array<React.ReactElement> = [] */

    /* if (graph) { */
    /*   graph.vertexById.forEach(item => */
    /*     rows.push( */
    /*       <ListItem key={item.id}> */
    /*         <ListItemText>{item.label}</ListItemText> */
    /*       </ListItem>, */
    /*     ), */
    /*   ) */
    /* } */
    if (!graph) {
      throw Error('no graph')
    }

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
      console.log('banana')
      event.preventDefault()
    }

    const firstNode = graph.nodesById.values().next().value
    return (
      <div className={classes.root}>
        <Box className={classes.pane}>
          <Box className={classes.addRecord}>
            <Typography className={classes.title} variant="h5">
              {firstNode.label ?? firstNode.id}
            </Typography>
            <form onSubmit={handleSubmit} noValidate autoComplete="off">
              <Input placeholder="Add Record" />
            </form>
          </Box>

          <PropertyList model={firstNode} />
          <EdgeList node={firstNode} />
        </Box>
      </div>
    )
  })
}

export default RootRegion
