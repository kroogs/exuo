/*
 * Copyright © 2020 Ty Dira <ty@dira.dev>
 *
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
import { Grid, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Instance, getSnapshot, SnapshotIn } from 'mobx-state-tree'

import { Node, useGraph } from 'graph'
import EdgeList from './EdgeList'
import AddItem from './AddItem'
import TextEditor from './TextEditor'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100vh',
      padding: theme.spacing(1),
    },
    paneHeader: {},
    paneHeaderText: {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
    pane: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      [theme.breakpoints.down('sm')]: {
        height: '30%',
      },
      padding: theme.spacing(1),
      outline: 0,
    },
    paneBody: {
      overflowY: 'auto',
    },
    rootPane: {
      backgroundColor: theme.palette.background.default,
    },
    selectedPane: {
      '& .Mui-selected': {
        backgroundColor: theme.palette.primary.main,
        '&:hover': {
          backgroundColor: theme.palette.primary.light,
        },
      },
    },
    contentPane: {
      [theme.breakpoints.down('sm')]: {
        height: '70%',
      },
    },
  }),
)

type MakeAddItemHandler = (
  p: Instance<typeof Node>,
) => (s: SnapshotIn<typeof Node>) => void

interface PaneManagerProps {
  paneLimit?: number
  visibleContentPane?: boolean
}

const PaneManager: React.FunctionComponent<PaneManagerProps> = props => {
  const classes = useStyles()
  return <></>

  /* return useGraph(graph => { */
  /*   const rootConfig = graph.Config.get('graph') */
  /*   const rootNodeId = rootConfig?.get('rootNodeId') */

  /*   if (!rootNodeId) { */
  /*     return <></> // Loading */
  /*   } */

  /*   const makeAddItemHandler: MakeAddItemHandler = parent => snapshot => { */
  /*     const child = graph.createNode('Node', snapshot) */
  /*     parent.addEdge('child', child) */
  /*     child.addEdge('parent', parent) */
  /*   } */

  /*   const selectNodeHandler = ( */
  /*     parent: Instance<typeof Node>, */
  /*     selected: Instance<typeof Node>, */
  /*   ): void => { */
  /*     let config = parent.getEdgeTag('config')?.[0] */

  /*     if (!config) { */
  /*       config = graph.createNode('Config') */
  /*       parent.addEdge('config', config) */
  /*     } */

  /*     rootConfig.set('selectedPaneNodeId', parent.id) */
  /*     config.set('selectedNodeId', selected.id) */
  /*   } */

  /*   const paneLimit = props.paneLimit ?? 3 */
  /*   const visibleContentPane = props.visibleContentPane ?? false */
  /*   const selectedPaneNodeId = rootConfig.get('selectedPaneNodeId') */
  /*   const rootNode = graph.Node.get(rootNodeId) */

  /*   const nodes = [rootNode] */
  /*   let currentNode = rootNode */

  /*   for (let i = 1; i < paneLimit; i++) { */
  /*     const selectedNodeId = currentNode */
  /*       .getEdgeTag('config')?.[0] */
  /*       ?.items.get('selectedNodeId') */

  /*     if (!selectedNodeId) { */
  /*       break */
  /*     } */

  /*     currentNode = graph.Node.get(selectedNodeId) */
  /*     nodes.push(currentNode) */
  /*   } */

  /*   const gridKeyDownHandler: React.EventHandler<React.SyntheticEvent> = e => { */
  /*     console.log('gridKeyDownHandler', e) */
  /*   } */

  /*   const makePaneKeyDownHandler: NodeEventHandlerFactory = node => { */
  /*     return e => { */
  /*       console.log('paneKeyDownHandler', e) */
  /*       console.log('event handler') */
  /*     } */
  /*   } */

  /*   return ( */
  /*     <Grid */
  /*       className={classes.root} */
  /*       container */
  /*       tabIndex={0} */
  /*       onKeyDown={gridKeyDownHandler} */
  /*     > */
  /*       {nodes.map((node, i) => ( */
  /*         <Grid */
  /*           item */
  /*           xs={6} */
  /*           md={2} */
  /*           key={node.id} */
  /*           tabIndex={0} */
  /*           onClick={e => console.log('pane click', e)} */
  /*           onKeyDown={makePaneKeyDownHandler(node)} */
  /*           className={[ */
  /*             classes.pane, */
  /*             i === 0 ? classes.rootPane : '', */
  /*             node.id === selectedPaneNodeId ? classes.selectedPane : '', */
  /*           ].join(' ')} */
  /*         > */
  /*           <div className={classes.paneHeader}> */
  /*             <Typography className={classes.paneHeaderText} variant="h5"> */
  /*               {node.label} */
  /*             </Typography> */
  /*             <AddItem onSubmit={makeAddItemHandler(node)} /> */
  /*           </div> */
  /*           {/1* <EdgeList *1/} */
  /*           {/1*   node={node} *1/} */
  /*           {/1*   onSelect={selectNodeHandler} *1/} */
  /*           {/1*   excludeMapKeys={['config', 'parent']} *1/} */
  /*           {/1*   className={classes.paneBody} *1/} */
  /*           {/1* /> *1/} */
  /*         </Grid> */
  /*       ))} */
  /*       {visibleContentPane && ( */
  /*         <Grid */
  /*           item */
  /*           xs={12} */
  /*           md={8} */
  /*           className={[classes.pane, classes.contentPane].join(' ')} */
  /*         > */
  /*           <Typography className={classes.paneHeaderText} variant="h5"> */
  /*             {currentNode.label} */
  /*           </Typography> */
  /*           <TextEditor node={currentNode} /> */
  /*         </Grid> */
  /*       )} */
  /*     </Grid> */
  /*   ) */
  /* }) */
}

export default PaneManager
