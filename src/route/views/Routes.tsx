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

import { InstanceViewer } from 'store'
/* import { Settings } from 'config' */

import { Router } from 'route'

// idea: generic functional routing library
// input: any type
// stack-based route switching
// free route matching
// history mechanism to travel

export const Routes: React.FunctionComponent = () => {
  // const { select, match, history, travel } = route(process.env.PUBLIC_URL, { env: {} }, () => {
  //   select('part', () => {
  //   })
  //   select('otherPart', () => {
  //     const value = match('part', value)
  //   })
  //   select('some/:value/:banana?', (value, banana) => {
  //   })
  // })

  return <Router />

  /* return ( */
  /*   <Router> */
  /*     <Route path=":type/:id/:action?" component={InstanceViewer} /> */
  /*     <Route path="settings" component={Settings} /> */
  /*     <Route path="/" component={InstanceViewer} /> */
  /*     <Route component={NotFound} /> */
  /*   </Router> */
  /* ) */
}
