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

import { RouteMethods } from 'route'

export type EventHandler = (path: string, next?: EventHandler) => void

export interface EventMethods {
  onSelect: (handler: EventHandler) => () => void
  onMatch: (handler: EventHandler) => () => void
  onTravel: (handler: EventHandler) => () => void
}

export type RouteEventMethods = RouteMethods & EventMethods

interface EventHandlerStack {
  onSelect: Array<EventHandler>
  onMatch: Array<EventHandler>
  onTravel: Array<EventHandler>
}

// TODO Create a spiffy generic event/middleware api factory to replace this

export const eventAdapter = (methods: RouteMethods): RouteEventMethods => {
  const eventHandlers: EventHandlerStack = {
    onSelect: [],
    onMatch: [],
    onTravel: [],
  }

  const eventMethods: RouteEventMethods = {
    onSelect: handler => {
      eventHandlers.onSelect.push(handler)
      return () => {
        eventHandlers.onSelect = eventHandlers.onSelect.filter(
          i => i !== handler,
        )
      }
    },

    onMatch: handler => {
      eventHandlers.onMatch.push(handler)
      return () => {
        eventHandlers.onMatch = eventHandlers.onMatch.filter(i => i !== handler)
      }
    },

    onTravel: handler => {
      eventHandlers.onTravel.push(handler)
      return () => {
        eventHandlers.onTravel = eventHandlers.onTravel.filter(
          i => i !== handler,
        )
      }
    },

    select(path, handler) {
      eventHandlers.onSelect.forEach(eventHandler => {
        eventHandler(path)
      })

      return methods.select(path, handler)
    },

    match(path, handler) {
      eventHandlers.onMatch.forEach(eventHandler => {
        eventHandler(path)
      })

      return methods.match(path, handler)
    },

    travel(path) {
      eventHandlers.onTravel.forEach(eventHandler => {
        eventHandler(path)
      })

      return methods.travel(path)
    },
  }

  return eventMethods
}
