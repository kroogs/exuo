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

import { route, browserAdapter, RouteEventMethods, RouteHandler } from 'route'

type SelectHandler<T> =
  | ((unknown: T) => T)
  | ((path: string, handler: RouteHandler<T>) => void | T)

type RouteHookMethods<T> = RouteEventMethods & {
  select: SelectHandler<T>
}

export function useRoute<T>(): RouteHookMethods<T>
export function useRoute<T>(
  path: string,
  handler: (m: RouteHookMethods<T>) => T,
): T
export function useRoute<T>(
  path?: string,
  handler?: (m: RouteHookMethods<T>) => T,
): void | RouteHookMethods<T> {
  // const [location, setLocation] = React.useState('/')
  const [methods, setMethods] = React.useState<RouteHookMethods<T>>()

  if (path && handler) {
    let result: T

    route(path, routeMethods => {
      const methods = browserAdapter(routeMethods)

      const wrappedMethods: RouteHookMethods<T> = {
        ...methods,
        select: (pathOrPassthrough, handler) => {
          if (handler) {
            return methods.select(pathOrPassthrough, handler)
          } else {
            return pathOrPassthrough
          }
        },
      }

      setMethods(wrappedMethods)

      // onSelect's second arg is not value, it's -next-
      // uhhh what to do now hmm.
      methods?.onSelect((path, value) => {
        result = value
      })

      const handlerResult = handler(methods)

      if (!result) {
        result = handlerResult
      }
    })

    return result
  } else if (methods) {
    return methods
  } else {
    throw Error('Cannot use route before setup')
  }
}
