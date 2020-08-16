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

import { eventAdapter, RouteMethods, RouteEventMethods } from 'route'

export const browserAdapter = (methods: RouteMethods): RouteEventMethods => {
  const envUrl = process.env.PUBLIC_URL || ''
  const rootPath = new URL(envUrl, window.location.href).pathname
  const eventMethods = eventAdapter(methods)

  eventMethods.onTravel(path => {
    window.history.pushState({}, path, rootPath + '/' + path)
  })

  window.onpopstate = (e: PopStateEvent) => {
    console.log(e)
  }

  return eventMethods
}
