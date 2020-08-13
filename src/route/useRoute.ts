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

import { InstanceViewer, useStore } from 'store'
import { NodeViewer } from 'graph'
import { Settings } from 'config'

import { route, Route, browserAdapter, RouteEventMethods } from 'route'

// the idea is to make useRoute a bridge between mst, react, and route

export function useRoute<T>(): RouteEventMethods
export function useRoute<T>(
  path: string,
  handler: (m: RouteEventMethods) => T,
): T
export function useRoute<T>(
  path?: string,
  handler?: (m: RouteEventMethods) => T,
): void | RouteEventMethods {
  let methods
  route('', m => {
    methods = m
  })
  return methods
  // const [location, setLocation] = React.useState('/')
  // const [methods, setMethods] = React.useState<null | RouteEventMethods>(null)
  // if (path && handler) {
  //   return route(path, m => {
  //     const browserMethods = handler(browserAdapter(m))
  //     let result
  //     browserMethods.onSelect((path, value) => {
  //       result = value
  //     })
  //     return browserMethods
  //   })
  // } else if (methods) {
  //   return methods
  // } else {
  //   throw Error('Cannot use route before setup')
  // }
}
