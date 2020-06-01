/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Ty Dira */

import React from 'react'
import { Container } from '@material-ui/core'

import { useStore } from 'store'
import PaneManager from './PaneManager'

const GraphViewer: React.FunctionComponent = () => {
  return useStore(graph => {
    const rootNodeId = graph.Config.get('graph').items.get('rootNodeId')
    const rootNode = graph.Node.get(rootNodeId)
    const nodes = [rootNode]

    console.log('GraphViewer render')

    return (
      <Container maxWidth={'xl'} disableGutters>
        <PaneManager nodes={nodes} />
      </Container>
    )
  })
}

export default GraphViewer
