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
import { Box, Button, Typography, CircularProgress } from '@material-ui/core'
import { IAnyStateTreeNode } from 'mobx-state-tree'
import { useNavigate } from '@reach/router'

import { Layout } from 'common'
import { makeUrl } from 'route'
import { useGraph } from 'graph'

interface PeerConnectorProps {
  id?: string
}

export const PeerConnector: React.FunctionComponent<PeerConnectorProps> = ({
  id,
}) => {
  const [peerError, setPeerError] = React.useState<null | Error>(null)
  const [hasAccepted, setHasAccepted] = React.useState(false)
  const navigate = useNavigate()

  return useGraph(graph => {
    const handleAccept: React.EventHandler<React.SyntheticEvent> = () => {
      setHasAccepted(true)
      graph
        .seekPeerConnection(id)
        .then((instance: IAnyStateTreeNode) => {
          navigate(makeUrl(`/node/${instance.id}`))
        })
        .catch((error: Error) => {
          setPeerError(error)
        })
    }

    return (
      <Layout>
        <Typography align="center">
          Someone wants to share content with you.
          <br />
          Do not accept if you do not trust them.
        </Typography>
        <Box mt={1} textAlign="center">
          {peerError ? (
            <Typography color="error">{peerError}</Typography>
          ) : (
            <Button
              disabled={hasAccepted}
              onClick={handleAccept}
              color="primary"
            >
              {hasAccepted ? <CircularProgress size={24} /> : 'Accept'}
            </Button>
          )}
        </Box>
      </Layout>
    )
  })
}
