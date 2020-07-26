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

type MatchHandler = (matches: Record<string, string>) => void

export interface RouteMethods {
  select: (segment: string, call: MatchHandler) => void
  match: (segment: string, call?: MatchHandler) => void
  travel: (path: string, call?: () => void) => void
}

export function route(
  input: string,
  call: (methods: RouteMethods) => void,
): void {
  let didSelect = false
  const methods: RouteMethods = {
    select: (segment, nextCall) => {
      if (didSelect) return
      if (input.indexOf(segment) === 0) {
        input = input.replace(segment, '')
        nextCall({ segment })
        didSelect = true
      }
    },

    match: (segment, nextCall) => {
      if (input.indexOf(segment) === 0) {
        nextCall?.({ segment })
      }
    },

    travel: path => {
      input = path
      didSelect = false
      call(methods)
    },
  }

  call(methods)
}
