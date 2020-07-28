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
    it('calls first matching select handler', () => {
      const result: Array<string> = []

      route('/1//2/3//', ({ select }) => {
        select('/1', () => {
          result.push('1')
          select('2', () => {
            select('/share', () => {
              result.push('share')
            })
            result.push('2')
            select('//3/', () => {
              result.push('3')
            })
          })
        })
      })

      expect(result).toStrictEqual(['1', '2', '3'])
    })

    it('does variable extraction', () => {
      const result: Array<string> = []

      route('/1/funky/3/', ({ select }) => {
        select('/1', () => {
          result.push('1')
          select('/:type/:id', ({ type, id }) => {
            result.push(type, id)
          })
        })
      })

      expect(result).toStrictEqual(['1', 'funky', '3'])
    })

    it('returns result of select handler', () => {
      route('99', ({ select }) => {
        expect(select(':id', ({ id }) => id + id)).toStrictEqual('9999')
      })
    })
  })

  describe.skip('travel', () => {
    it.skip('supports relative paths', () => {
      //
    })

    it('supports absolute paths', () => {
      const result: Array<string> = []

      route('/1/2', ({ select, travel }) => {
        select('/9', () => {
          result.push()
          select('/8', () => {
            result.push()
          })
        })

        select('/1', () => {
          result.push()
          select('/2', () => {
            result.push()
            travel('/9/8')
          })
        })
      })

      expect(result).toStrictEqual(['/1', '/2', '/9', '/8'])
    })
  })
})
