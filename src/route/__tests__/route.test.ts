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

import { route, matchPathParts, getPathParts } from '../'

describe('getPathParts', () => {
  it('splits a string on / and filters empty elements', () => {
    expect(getPathParts('//3/4/2//4')).toStrictEqual(['3', '4', '2', '4'])
  })
})

describe('matchPathParts', () => {
  it('counts path matches', () => {
    expect(
      matchPathParts(getPathParts('1/2/3'), getPathParts('1/2/3/4')).matchCount,
    ).toStrictEqual(3)
  })

  it('matches complete paths only', () => {
    expect(
      matchPathParts(getPathParts('1/2/3/5'), getPathParts('1/2/3/4'))
        .matchCount,
    ).toStrictEqual(0)
  })

  it('extracts variables', () => {
    expect(
      matchPathParts(getPathParts('/1/:type/:id'), getPathParts('/1/funky/3/'))
        .variables,
    ).toStrictEqual({ type: 'funky', id: '3' })
  })
})

describe('route', () => {
  describe('methods', () => {
    describe('select', () => {
      it('calls first matching handler', () => {
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

      it('returns selected handler result', () => {
        route('99', ({ select }) => {
          expect(select(':id', ({ id }) => id + id)).toStrictEqual('9999')
        })
      })
    })

    describe('match', () => {
      it.skip('calls all matching handlers', () => {
        //
      })

      it.skip('returns path variables if handler undefined', () => {
        //
      })
    })

    describe('travel', () => {
      it.skip('supports relative paths', () => {
        //
      })

      it('supports absolute paths', () => {
        const result: Array<number> = []

        route('/1/2', ({ select, travel }) => {
          select('/9', () => {
            result.push(9)
            select('/8', () => {
              result.push(8)
            })
          })

          select('/1', () => {
            result.push(1)
            select('/2', () => {
              result.push(2)
              travel('/9/8')
            })
          })
        })

        expect(result).toStrictEqual([1, 2, 9, 8])
      })
    })
  })
})
