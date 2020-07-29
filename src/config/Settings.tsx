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
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Switch,
} from '@material-ui/core'
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck'
import BorderAllIcon from '@material-ui/icons/BorderAll'
import AccountTreeIcon from '@material-ui/icons/AccountTree'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import Layout from 'common/Layout'
import { useGraph } from 'graph'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
  }),
)

export const Settings: React.FunctionComponent = () => {
  const classes = useStyles()

  return useGraph(graph => (
    <Layout>
      <List
        subheader={<ListSubheader>Global</ListSubheader>}
        className={classes.root}
      >
        <ListItem>
          <ListItemIcon>
            <BorderAllIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-dividers" primary="Dividers" />
          <ListItemSecondaryAction>
            <Switch
              disabled
              edge="end"
              inputProps={{
                'aria-labelledby': 'switch-list-label-list-dividers',
              }}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      <List
        subheader={<ListSubheader>Lists</ListSubheader>}
        className={classes.root}
      >
        <ListItem>
          <ListItemIcon>
            <PlaylistAddCheckIcon />
          </ListItemIcon>
          <ListItemText
            id="switch-list-label-checkboxes"
            primary="Checkboxes"
          />
          <ListItemSecondaryAction>
            <Switch
              checked={graph.listCheckboxSetting ?? false}
              onChange={() => graph.toggleListCheckboxSetting()}
              edge="end"
              inputProps={{
                'aria-labelledby': 'switch-list-label-list-checkboxes',
              }}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <BorderAllIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-dividers" primary="Dividers" />
          <ListItemSecondaryAction>
            <Switch
              disabled
              edge="end"
              inputProps={{
                'aria-labelledby': 'switch-list-label-list-dividers',
              }}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <AccountTreeIcon />
          </ListItemIcon>
          <ListItemText
            id="switch-list-label-bluetooth"
            primary="Show Extra Edge Types"
          />
          <ListItemSecondaryAction>
            <Switch
              disabled
              edge="end"
              inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </Layout>
  ))
}
