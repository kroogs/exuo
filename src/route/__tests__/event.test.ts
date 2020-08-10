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

import { route, eventAdapter } from '../'

describe('event', () => {
  describe('onTravel', () => {
    it('calls given event handler', () => {
      const result: Array<string> = []

      route('/1/2/3', methods => {
        const { select, onTravel, travel } = eventAdapter(methods)

        onTravel(path => {
          result.push('travel')
          result.push(path)
        })

        select('9', () => {
          result.push('0')
        })

        select('1', () => {
          travel('9')
        })
      })

      expect(result).toStrictEqual(['travel', '9', '0'])
    })

    it('returns disposer to deactivate itself', () => {
      const result: Array<string> = []

      route('/1/2/3', methods => {
        const { select, onTravel, travel } = eventAdapter(methods)

        const dispose = onTravel(path => {
          result.push('travel')
          result.push(path)
        })

        select('9', () => {
          result.push('9')
        })

        select('1', () => {
          travel('9')
          dispose()
          travel('9')
        })
      })

      expect(result).toStrictEqual(['travel', '9', '9', '9'])
    })
  })
})
