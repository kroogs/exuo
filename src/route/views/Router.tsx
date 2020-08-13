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

import { NoteEditor, Note } from 'note'
import { InstanceViewer, useStore } from 'store'
import { NodeViewer } from 'graph'
import { Settings } from 'config'

import { useRoute, route, Route, browserAdapter } from 'route'

export const Router: React.FunctionComponent = () => {
  return <NoteEditor />
  /* return useRoute('/', ({ select, onSelect, onTravel }) => { */
  /*   let result = <>boop</> */

  /*   onSelect((path, value) => { */
  /*     result = <>oshit</> */
  /*     /1* result = value *1/ */
  /*   }) */

  /*   select('settings', () => <Settings />) */

  /*   select(':type/:id', ({ type, id }) => { */
  /*     if (type === 'node') { */
  /*       return <NodeViewer id={id} /> */
  /*     } else { */
  /*       return <InstanceViewer type={type} id={id} /> */
  /*     } */
  /*   }) */

  /*   select('/', () => <NodeViewer />) */

  /*   return result */
  /* }) */
}
