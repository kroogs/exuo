/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * Copyright © 2020 Justin Krueger */

import React from 'react'
import { Box, Flex } from 'rebass'
import { useObserver } from 'mobx-react-lite'

import { useStore } from 'store'

/* import { List } from './basic/List' */
/* import { Input } from './basic/Input' */
/* import { Heading } from './basic/Heading' */
/* import { Text } from './basic/Text' */

// generic best-attempt display and editor for whatever you feed it
export const Record: React.FunctionComponent = (props, ref) => {
  return <></>
}
/* export const Record: typeof Box = React.forwardRef((props, ref) => { */
/*   const inputRef = React.useRef<HTMLInputElement>() */
/*   const listRef = React.useRef<HTMLDataListElement>() */
/*   const store = useStore(store => store.graph) */

/*   return useObserver(() => { */
/*     const graph = store.byId.get('default') */

/*     if (graph) { */
/*       const rows: Array<React.ReactElement> = [] */
/*       const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => { */
/*         event.preventDefault() */

/*         if ( */
/*           typeof inputRef.current?.value === 'string' && */
/*           inputRef.current.value !== '' */
/*         ) { */
/*           graph.putNode({ id: 'boop', label: inputRef.current.value }) */
/*           inputRef.current.value = '' */
/*         } */
/*       } */

/*       graph.vertexById.forEach(item => */
/*         rows.push( */
/*           <List.Item */
/*             key={item.id} */
/*             sx={{ */
/*               fontSize: 2, */
/*               paddingY: [2, 0], */
/*               margin: 0, */
/*               textDecoration: 'none', */
/*             }} */
/*           > */
/*             <Text */
/*               variant="interactive" */
/*               sx={{ fontSize: 2, width: '100%', textOverflow: 'ellipsis' }} */
/*             > */
/*               {item.label} */
/*             </Text> */
/*           </List.Item>, */
/*         ), */
/*       ) */

/*       return ( */
/*         <Flex */
/*           sx={{ */
/*             flexDirection: 'column', */
/*             maxHeight: '100vh', */
/*             position: 'relative', */
/*             overflowY: 'auto', */
/*           }} */
/*         > */
/*           <Box */
/*             sx={{ */
/*               position: 'sticky', */
/*               top: '0', */
/*               bg: 'background', */
/*             }} */
/*           > */
/*             <Flex sx={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}> */
/*               <Heading */
/*                 sx={{ */
/*                   px: 0, */
/*                   textOverflow: 'ellipsis', */
/*                   overflow: 'hidden', */
/*                   height: '1em', */
/*                   lineHeight: '1em', */
/*                   maxWidth: '100%', */
/*                 }} */
/*               > */
/*                 Delicious Fruit */
/*               </Heading> */
/*               <Flex */
/*                 sx={{ */
/*                   fontSize: '20px', */
/*                   flexDirection: 'row', */
/*                   flexShrink: '0', */
/*                   alignItems: 'center', */
/*                 }} */
/*               > */
/*                 <IoMdMore /> */
/*               </Flex> */
/*             </Flex> */
/*             <form onSubmit={handleSubmit}> */
/*               <Input */
/*                 ref={inputRef} */
/*                 sx={{ fontSize: 3 }} */
/*                 placeholder="Add Record" */
/*               /> */
/*             </form> */
/*           </Box> */

/*           {rows.length > 0 && ( */
/*             <List */
/*               ref={listRef} */
/*               sx={{ */
/*                 p: 0, */
/*                 listStyle: 'none', */
/*               }} */
/*             > */
/*               {rows.reverse()} */
/*             </List> */
/*           )} */
/*         </Flex> */
/*       ) */
/*     } else { */
/*       return <div>shit</div> */
/*     } */
/*   }) */
/* }) */

export default Record
