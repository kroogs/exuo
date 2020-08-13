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

export const getPathParts = (path: string): Array<string> =>
  path.split('/').filter(part => part)

export const matchPathParts = (
  left: Array<string>,
  right: Array<string>,
): {
  matchCount: number
  variables: Record<string, string>
} => {
  if (left.length === 0 && right.length === 0) {
    return { variables: {}, matchCount: 1 }
  }

  const variables: Record<string, string> = {}
  let i = 0

  for (; i < left.length; i++) {
    if (left[i].indexOf(':') >= 0 && right[i]) {
      variables[left[i].slice(1)] = right[i]
    } else if (right[i] !== left[i]) {
      return { variables: {}, matchCount: 0 }
    }
  }

  return { variables, matchCount: i }
}

export type RouteHandler<T> = (match: Record<string, string>) => T

export interface RouteMethods {
  select: <S>(path: string, handler: RouteHandler<S>) => void | S
  match: <M>(
    path: string,
    handler?: RouteHandler<M>,
  ) => void | Record<string, string> | M
  travel: (path: string) => void
}

export function route<T, S, M>(
  rootPath: string,
  call: (methods: RouteMethods) => T,
): T {
  let rootParts = getPathParts(rootPath)
  let didSelect = false

  const methods: RouteMethods = {
    select: (path, handler) => {
      if (didSelect) {
        return
      }

      const { matchCount, variables } = matchPathParts(
        getPathParts(path),
        rootParts,
      )

      if (matchCount) {
        rootParts = rootParts.slice(matchCount)
        const result = handler(variables)
        didSelect = true

        return result
      }
    },

    match: (path, handler) => {
      const { matchCount, variables } = matchPathParts(
        getPathParts(path),
        rootParts,
      )

      if (matchCount) {
        return handler?.(variables) ?? variables
      }
    },

    travel: path => {
      rootParts = getPathParts(path)
      didSelect = false

      return call(methods)
    },
  }

  return call(methods)
}
