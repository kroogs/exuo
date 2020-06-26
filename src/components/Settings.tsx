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
import { Link } from '@reach/router'
import {
  Chip,
  Checkbox,
  InputBase,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Switch,
  lighten,
} from '@material-ui/core'
import WifiIcon from '@material-ui/icons/Wifi'
import BluetoothIcon from '@material-ui/icons/Bluetooth'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import Layout from './Layout'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  }),
)

const Settings: React.FunctionComponent = () => {
  const classes = useStyles()

  return (
    <Layout title="Settings">
      <List
        subheader={<ListSubheader>Settings</ListSubheader>}
        className={classes.root}
      >
        <ListItem>
          <ListItemIcon>
            <WifiIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-wifi" primary="Wi-Fi" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              inputProps={{ 'aria-labelledby': 'switch-list-label-wifi' }}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <BluetoothIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </Layout>
  )
}

export default Settings
