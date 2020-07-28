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

type MatchHandler = (match: Record<string, string>) => void

export interface RouteMethods {
  select: (segment: string, call: MatchHandler) => unknown
  match: (segment: string, call?: MatchHandler) => unknown
  travel: (path: string, call?: () => void) => void
}

const getPathParts = (path: string): Array<string> =>
  path.split('/').filter(part => part)

const matchPathParts = (
  left: Array<string>,
  right: Array<string>,
): { matchCount: number; variables: Record<string, string> } => {
  let variables: Record<string, string> = {}
  let matchCount = 0

  for (const i in left) {
    const part = left[i]

    if (right[i] === part) {
      matchCount++
    } else if (part.indexOf(':') >= 0) {
      variables[part.slice(1)] = right[i]
      matchCount++
    } else {
      variables = {}
      matchCount = 0
      break
    }
  }

  return { variables, matchCount }
}

export function route(
  input: string,
  call: (methods: RouteMethods) => void,
): void {
  let inputParts = getPathParts(input)
  let didSelect = false

  const methods: RouteMethods = {
    select: (segment, handler) => {
      if (didSelect) return

      const { matchCount, variables } = matchPathParts(
        getPathParts(segment),
        inputParts,
      )

      if (matchCount) {
        inputParts = inputParts.slice(matchCount)
        const value = handler(variables)
        didSelect = true

        return value
      }
    },

    match: (segment, handler) => {
      const { matchCount, variables } = matchPathParts(
        getPathParts(segment),
        inputParts,
      )

      if (matchCount) {
        return handler?.(variables)
      }
    },

    travel: path => {
      inputParts = getPathParts(path)
      didSelect = false
      call(methods)
    },
  }

  call(methods)
}
