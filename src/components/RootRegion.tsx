/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Justin Krueger */

import React from 'react'
import { useObserver } from 'mobx-react-lite'
import AccountCircle from '@material-ui/icons/AccountCircle'
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
import TextField from '@material-ui/core/TextField'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { fade, makeStyles, Theme, createStyles } from '@material-ui/core/styles'

import { useStore } from 'store'
import { EdgeList } from './EdgeList'
import { PropertyList } from './PropertyList'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
    },
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
    title: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
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
  vertexId?: string
}

export const RootRegion: React.FunctionComponent<RootRegionProps> = ({
  vertexId,
}) => {
  const store = useStore(store => store.graph)

  console.log('RootRegion vertexId', vertexId)

  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [
    mobileMoreAnchorEl,
    setMobileMoreAnchorEl,
  ] = React.useState<null | HTMLElement>(null)

  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

  const handleProfileMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
  ): void => {
    setAnchorEl(event.currentTarget)
  }

  const handleMobileMenuClose = (): void => {
    setMobileMoreAnchorEl(null)
  }

  const handleMenuClose = (): void => {
    setAnchorEl(null)
    handleMobileMenuClose()
  }

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
    setMobileMoreAnchorEl(event.currentTarget)
  }

  const menuId = 'primary-search-account-menu'
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  )

  const mobileMenuId = 'primary-search-account-menu-mobile'
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  )

  return useObserver(() => {
    const graph = store.byId.get('default')
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
      throw new Error('no graph')
    }

    return (
      <div className={classes.root}>
        <EdgeList model={graph} />
        <PropertyList model={graph} />
      </div>
    )
  })
}

/* export const RootRegion: React.FunctionComponent = props => { */
/*   const store = useStore(store => store.graph) */

/*   return useObserver(() => { */
/*     const graph = store.byId.get('default') */

/*     if (graph) { */
/*       const rows: Array<React.ReactElement> = [] */
/*       const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => { */
/*         event.preventDefault() */
/*       } */

/*       graph.vertexById.forEach(item => */
/*         rows.push( */
/*           <ListItem key={item.id}> */
/*             <ListItemText>{item.label}</ListItemText> */
/*           </ListItem>, */
/*         ), */
/*       ) */

/*       return ( */
/*         <Flex */
/*           sx={{ */
/*             flexDirection: 'column', */
/*             maxHeight: '100vh', */
/*             position: 'relative', */
/*             overflowY: 'auto', */
/*           }} */
/*         > */
/*           <Box */
/*             sx={{ */
/*               position: 'sticky', */
/*               top: '0', */
/*               bg: 'background', */
/*             }} */
/*           > */
/*             <Typography variant="h3">Delicious Fruit</Typography> */
/*             <form onSubmit={handleSubmit} noValidate autoComplete="off"> */
/*               <TextField label="Add Record" /> */
/*             </form> */
/*           </Box> */

/*           {rows.length > 0 && <List>{rows.reverse()}</List>} */
/*         </Flex> */
/*       ) */
/*     } else { */
/*       return <div>shit</div> */
/*     } */
/*   }) */
/* } */

export default RootRegion
