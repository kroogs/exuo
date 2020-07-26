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

import { route } from '../'

describe('route', () => {
  describe('select', () => {
    it('does basic segment selection', () => {
      const result: Array<string> = []

      route('/1/2/3/', ({ select, travel, match }) => {
        select('/1', ({ segment }) => {
          result.push(segment)
          select('/2', ({ segment }) => {
            result.push(segment)
            select('/3', ({ segment }) => {
              result.push(segment)
            })
          })
        })
      })

      expect(result).toStrictEqual(['/1', '/2', '/3'])
    })
  })

  describe('travel', () => {
    it('supports absolute paths', () => {
      const result: Array<string> = []

      route('/1/2', ({ select, travel, match }) => {
        select('/9', ({ segment }) => {
          result.push(segment)
          select('/8', ({ segment }) => {
            result.push(segment)
          })
        })

        select('/1', ({ segment }) => {
          result.push(segment)
          select('/2', ({ segment }) => {
            result.push(segment)
            travel('/9/8')
          })
        })
      })

      expect(result).toStrictEqual(['/1', '/2', '/9', '/8'])
    })
  })
})
