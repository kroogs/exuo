(this.webpackJsonpexuo=this.webpackJsonpexuo||[]).push([[0],{204:function(e,t,n){e.exports=n(316)},316:function(e,t,n){"use strict";n.r(t);var a=n(0),o=n.n(a),i=n(12),r=n.n(i),c=(n(209),function(){return Gt().graph}),l=o.a.createContext(null),d=l.Provider,s=function(){var e=o.a.useContext(l);if(e)return e;throw Error("Cannot use active Node before setup")},u=n(50),p=n(193),m=n(5),g=n(372),f=function(e){return m.i.model("EdgeMap",{edgeMap:m.i.map(m.i.array(m.i.safeReference(m.i.late(e),{acceptsUndefined:!1})))}).actions((function(e){return{hasEdge:function(t,n){var a,o;return n?Boolean(null===(a=e.edgeMap.get(t))||void 0===a?void 0:a.includes(n)):Boolean(null===(o=e.edgeMap.get(t))||void 0===o?void 0:o.length)}}})).actions((function(e){return{addEdge:function(t,n){var a;return e.edgeMap.has(t)||e.edgeMap.set(t,[]),null===(a=e.edgeMap.get(t))||void 0===a||a.push(n),n},removeEdge:function(t,n){var a;null===(a=e.edgeMap.get(t))||void 0===a||a.remove(n)},reorderEdge:function(t,n,a,o){var i=e.edgeMap.get(t);if(i){var r=o;void 0===r&&(r=i.indexOf(n));var c=i[r];if(c!==n)throw Error("Invalid reorder target");i.splice(r,1),i.splice(a,0,c)}},getEdgeTag:function(t){return e.edgeMap.get(t)}}}))},v=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return m.i.compose.apply(m.i,Object(p.a)([m.i.model({id:m.i.identifier})].concat(e))).named("Node")},b=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return m.i.model("Graph",Object.fromEntries(Object.keys(e).map((function(t){var n=e[t];if(Object(m.f)(n)&&Object(m.e)(n.properties.id))return[t,m.i.map(e[t])];throw Error("Model '".concat(t,"' requires 'id' identifier"))})))).actions((function(n){return{createNode:function(){var a,o,i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"Node",r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(!e[i])throw Error("No model named '".concat(i,"'"));var c=e[i].create(Object(u.a)({id:null!==(a=null===(o=t.getId)||void 0===o?void 0:o.call(t))&&void 0!==a?a:Object(g.a)()},r));return n[i].put(c),c}}}))},h=v(f((function(){return h}))),E=(b({Node:h}),n(17)),y=n(33),j=n(114),N=n.n(j),O=n(22),k=n(159),w=n(160);function x(){return(x=Object(k.a)(N.a.mark((function e(t){var n,a,o,i;return N.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=new w.a("default"),a=Object.keys(Object(m.b)(t).properties),o=Object.fromEntries(a.map((function(e){return[e,"id"]}))),n.version(1).stores(o),i=function(e){e.forEach((function(e){var a=e.path.split("/").slice(1),o=Object(E.a)(a,3),i=o[0],r=o[1],c=o[2];if("add"===e.op)n.table(i).put(Object(m.d)(t[i].get(r)));else{if("replace"!==e.op&&"remove"!==e.op)throw Error("Unknown patch op '".concat(e.op,"'"));if(c){var l=t[i].get(r)[c];Object(m.g)(l)&&(l=Object(m.d)(l)),n.table(i).update(r,Object(O.a)({},c,l))}else n.table(i).delete(r)}}))},e.abrupt("return",Promise.all(a.map((function(e){return n.table(e).toArray().then((function(t){return[e,Object.fromEntries(t.map((function(e){return[e.id,e]})))]}))}))).then((function(e){Object(m.a)(t,Object.fromEntries(e));var n,a=[];Object(m.h)(t,(function(e){a.push(e),n&&clearTimeout(n),n=setTimeout((function(){i(a),a=[]}),1e3),a.length>1e3&&(i(a),a=[])}))})));case 6:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var C=m.i.union(m.i.null,m.i.boolean,m.i.string,m.i.number,m.i.array(m.i.late((function(){return C}))),m.i.map(m.i.late((function(){return C})))),S=v([f((function(){return m.i.union(m.i.late((function(){return S})),T)}))]).props({content:m.i.union(m.i.string,C)}).actions((function(e){return{setContent:function(t){e.content=t},initView:function(t){return e.view||e.addEdge("view",e.graphRoot.createNode("View",t)),e.view}}})).views((function(e){return{get childCount(){var t,n;return null!==(t=null===(n=e.edgeMap.get("child"))||void 0===n?void 0:n.length)&&void 0!==t?t:0},get graphRoot(){return Object(m.c)(e,I)},get view(){if(e.edgeMap.size){var t=e.edgeMap.get("view");if(t&&t.length)return t[0]}}}})),M=v(m.i.model("Config",{name:m.i.maybe(m.i.string),items:m.i.map(C)}).actions((function(e){return{set:function(t,n){e.items.set(t,n)},get:function(t){return e.items.get(t)}}}))),B=m.i.model("ViewItem",{expanded:m.i.optional(m.i.boolean,!1)}).actions((function(e){return{setExpanded:function(t){e.expanded=t}}})),T=v(m.i.model("View",{items:m.i.map(B)}).views((function(e){return{getItem:function(t){if(e.items.size)return e.items.get(t)}}})).actions((function(e){return{initItem:function(t){var n=e.getItem(t);return n||(n=B.create(),e.items.set(t,n),e.getItem(t))}}}))),I=b({Node:S,Config:M,View:T}).actions((function(e){return{setActiveMode:function(t){var n=e.activeModes;(null===n||void 0===n?void 0:n.includes(t))||(n.push(t),"select"===t&&n.remove("edit"),"edit"===t&&(n.remove("select"),e.clearSelectedNodes()))},unsetActiveMode:function(t){var n=e.activeModes;(null===n||void 0===n?void 0:n.includes(t))&&n.remove(t)},toggleActiveMode:function(t){var n=e.activeModes;n&&(n.includes(t)?(n.remove(t),"select"===t&&e.clearSelectedNodes()):(n.push(t),"select"===t&&n.remove("edit"),"edit"===t&&(n.remove("select"),e.clearSelectedNodes())))}}})).actions((function(e){return{toggleSelectNode:function(t,n){var a=e.Config.get("system").get("selectedNodes");if(a){var o=a.get(n.id);o?o.includes(t.id)?(o.remove(t.id),0===o.length&&a.delete(n.id)):o.push(t.id):a.set(n.id,[t.id])}},clearSelectedNodes:function(){var t;null===(t=e.Config.get("system").get("selectedNodes"))||void 0===t||t.clear(),0===e.selectedNodes.size&&e.unsetActiveMode("select")},deleteSelectedNodes:function(){e.selectedNodes.forEach((function(t){return t.forEach((function(t){return e.Node.delete(t)}))})),e.clearSelectedNodes()},moveSelectedNodes:function(t){var n,a=Object(y.a)(e.selectedNodes);try{for(a.s();!(n=a.n()).done;){var o,i=Object(E.a)(n.value,2),r=i[0],c=i[1],l=e.Node.get(r),d=Object(y.a)(c);try{for(d.s();!(o=d.n()).done;){var s=o.value,u=e.Node.get(s);u&&(u.removeEdge("parent",l),l.removeEdge("child",u),u.addEdge("parent",t),t.addEdge("child",u))}}catch(p){d.e(p)}finally{d.f()}}}catch(p){a.e(p)}finally{a.f()}e.clearSelectedNodes()},copySelectedNodes:function(){},linkSelectedNodes:function(t){var n,a=Object(y.a)(e.selectedNodes.values());try{for(a.s();!(n=a.n()).done;){var o,i=n.value,r=Object(y.a)(i);try{for(r.s();!(o=r.n()).done;){var c=o.value,l=e.Node.get(c);l&&(l.addEdge("parent",t),t.addEdge("child",l))}}catch(d){r.e(d)}finally{r.f()}}}catch(d){a.e(d)}finally{a.f()}e.clearSelectedNodes()},unlinkSelectedNodes:function(){var t,n=Object(y.a)(e.selectedNodes);try{for(n.s();!(t=n.n()).done;){var a,o=Object(E.a)(t.value,2),i=o[0],r=o[1],c=e.Node.get(i),l=Object(y.a)(r);try{for(l.s();!(a=l.n()).done;){var d=a.value,s=e.Node.get(d);s&&(s.removeEdge("parent",c),c.removeEdge("child",s))}}catch(u){l.e(u)}finally{l.f()}}}catch(u){n.e(u)}finally{n.f()}e.clearSelectedNodes()},removeSelectedNodes:function(){var t,n=Object(y.a)(e.selectedNodes);try{for(n.s();!(t=n.n()).done;){var a,o=Object(E.a)(t.value,2),i=o[0],r=o[1],c=e.Node.get(i),l=Object(y.a)(r);try{for(l.s();!(a=l.n()).done;){var d=a.value,s=e.Node.get(d);s&&(s.removeEdge("parent",c),c.removeEdge("child",s),0===s.edgeMap.get("parent").size&&e.deleteNode(s))}}catch(u){l.e(u)}finally{l.f()}}}catch(u){n.e(u)}finally{n.f()}e.clearSelectedNodes()},exportSelectedNodes:function(){var t=new Blob([JSON.stringify(e.selectedNodes.toJSON(),null,2)],{type:"application/json"});return e.clearSelectedNodes(),t}}})).actions((function(e){return{afterCreate:function(){(function(e){return x.apply(this,arguments)})(e).catch((function(e){console.error("Persist error",e)})).then((function(){if(!e.rootNode){var t=e.createNode("Node",{content:"Locus"});Object(m.a)(e.Config,{system:{id:"system",items:{rootNodeId:t.id,selectedNodes:{},activeModes:[]}}})}}))},createChild:function(t,n){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"Node",o=e.createNode(a,n);return t.addEdge("child",o),o.addEdge("parent",t),o},deleteNode:function(t){e.Node.delete(t.id)}}})).views((function(e){return{get rootNode(){var t=e.Config.get("system");return e.Node.get(null===t||void 0===t?void 0:t.get("rootNodeId"))},get activeModes(){var t=e.Config.get("system");return null===t||void 0===t?void 0:t.get("activeModes")},get selectedNodes(){var t=e.Config.get("system");return null===t||void 0===t?void 0:t.get("selectedNodes")},get selectedNodeCount(){var t,n=0,a=Object(y.a)(e.selectedNodes);try{for(a.s();!(t=a.n()).done;){n+=Object(E.a)(t.value,2)[1].length}}catch(o){a.e(o)}finally{a.f()}return n}}})),A=n(19),R=n(322),L=n(349),F=n(377),z=n(326),D=n(355),P=n(356),W=n(357),K=n(362),U=n(20),G=n(179),V=n.n(G),J=n(178),q=n.n(J),H=n(37),X=n(375),Y=n(376),$=n(97),Q=n(101),Z=n(370),_=n(358),ee=n(350),te=Object(L.a)((function(e){return Object(F.a)({root:{},appBar:{},actions:{width:"100%",color:e.palette.text.secondary,backgroundColor:e.palette.background.default,padding:e.spacing(0,2,0,2)},children:{}})})),ne=function(e){var t=e.title,n=e.actions,a=e.className,i=e.children,r=te();return o.a.createElement(Z.a,{className:[r.root,a].join(" ")},o.a.createElement(ee.a,{elevation:0,position:"sticky",className:r.appBar},o.a.createElement(se,{title:t}),n),o.a.createElement(Z.a,{className:r.children},i))},ae=n(351),oe=n(352),ie=n(165),re=n.n(ie),ce=n(166),le=n.n(ce),de=Object(L.a)((function(e){return Object(F.a)({root:{color:e.palette.text.secondary,backgroundColor:e.palette.background.default,padding:e.spacing(0,2,0,2)},backButton:{cursor:"pointer","&[disabled]":{visibility:"hidden",pointerEvents:"none"},"&:hover":{color:e.palette.primary.main},transition:e.transitions.create(["color","background"],{duration:e.transitions.duration.shortest})},hide:{visibility:"hidden",mouseEvents:"none"},settingsButton:{},title:{flexGrow:1,textAlign:"center",overflowX:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis",color:e.palette.text.primary}})})),se=function(e){var t,n=e.title,a=e.showBackButton,i=e.showSettingsButton,r=e.className,c=(e.children,de()),l=null!==(t=null===n||void 0===n?void 0:n.indexOf("\n"))&&void 0!==t?t:-1;return o.a.createElement(ae.a,{className:[c.root,r].join(" ")},o.a.createElement(oe.a,{disabled:je(),edge:"start","aria-label":"back",onClick:function(){return window.history.back()},className:[c.backButton,a?"":c.hide].join(" ")},o.a.createElement(re.a,null)),n&&o.a.createElement(Q.a,{variant:"h6",component:"h1",className:c.title},l>0?n.slice(0,n.indexOf("\n")):n),o.a.createElement(oe.a,{disabled:!0,edge:"end",component:H.a,to:Oe("/settings"),"aria-label":"settings",className:[c.settingsButton,i?"":c.hide].join(" ")},o.a.createElement(le.a,{fontSize:"small"})))};se.defaultProps={title:"Exuo",showBackButton:!0,showSettingsButton:!1};var ue=n(353),pe=n(354),me=n(373),ge=n(167),fe=n.n(ge),ve=n(115),be=n.n(ve),he=n(168),Ee=n.n(he),ye=Object(A.a)((function(){var e,t=c();return o.a.createElement(ne,null,o.a.createElement(R.a,{subheader:o.a.createElement(ue.a,null,"Global")},o.a.createElement(z.a,null,o.a.createElement(pe.a,null,o.a.createElement(be.a,null)),o.a.createElement(D.a,{id:"switch-list-label-dividers",primary:"Dividers"}),o.a.createElement(P.a,null,o.a.createElement(me.a,{disabled:!0,edge:"end",inputProps:{"aria-labelledby":"switch-list-label-list-dividers"}})))),o.a.createElement(R.a,{subheader:o.a.createElement(ue.a,null,"Lists")},o.a.createElement(z.a,null,o.a.createElement(pe.a,null,o.a.createElement(fe.a,null)),o.a.createElement(D.a,{id:"switch-list-label-checkboxes",primary:"Checkboxes"}),o.a.createElement(P.a,null,o.a.createElement(me.a,{checked:null!==(e=t.listCheckboxSetting)&&void 0!==e&&e,onChange:function(){return t.toggleListCheckboxSetting()},edge:"end",inputProps:{"aria-labelledby":"switch-list-label-list-checkboxes"}}))),o.a.createElement(z.a,null,o.a.createElement(pe.a,null,o.a.createElement(be.a,null)),o.a.createElement(D.a,{id:"switch-list-label-dividers",primary:"Dividers"}),o.a.createElement(P.a,null,o.a.createElement(me.a,{disabled:!0,edge:"end",inputProps:{"aria-labelledby":"switch-list-label-list-dividers"}}))),o.a.createElement(z.a,null,o.a.createElement(pe.a,null,o.a.createElement(Ee.a,null)),o.a.createElement(D.a,{id:"switch-list-label-bluetooth",primary:"Show Extra Edge Types"}),o.a.createElement(P.a,null,o.a.createElement(me.a,{disabled:!0,edge:"end",inputProps:{"aria-labelledby":"switch-list-label-bluetooth"}})))))})),je=function(){return window.location.pathname===Oe("/")||window.location.pathname===Oe()},Ne=Object(A.a)((function(e){var t=e.id,n=o.a.useState(null),a=Object(E.a)(n,2),i=a[0],r=a[1],l=o.a.useState(!1),d=Object(E.a)(l,2),s=d[0],u=d[1],p=Object(H.c)(),m=c();return o.a.createElement(ne,null,o.a.createElement(Q.a,{align:"center"},"Someone wants to share content with you.",o.a.createElement("br",null),"Do not accept if you do not trust them."),o.a.createElement(Z.a,{mt:1,textAlign:"center"},i?o.a.createElement(Q.a,{color:"error"},i):o.a.createElement(W.a,{disabled:s,onClick:function(){u(!0),m.seekPeerConnection(t).then((function(e){p(Oe("/node/".concat(e.id)))})).catch((function(e){r(e)}))},color:"primary"},s?o.a.createElement(_.a,{size:24}):"Accept")))}));function Oe(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return"/exuo"+e}var ke=function(e){var t=e.component,n=Object($.a)(e,["component"]);return o.a.createElement(t,n)},we=Object(A.a)((function(){return c().rootNode?o.a.createElement(H.b,{basepath:"/exuo"},o.a.createElement(ke,{path:"/",component:Pt}),o.a.createElement(ke,{path:":type/:id",component:Pt}),o.a.createElement(ke,{path:"peer/:id",component:Ne}),o.a.createElement(ke,{path:"settings",component:ye})):null})),xe=(v(m.i.model("Note",{content:m.i.maybe(C)}).actions((function(e){return{setContent:function(t){e.content=t}}}))),n(359)),Ce=n(360),Se=n(361),Me=n(323),Be=n(172),Te=n.n(Be),Ie=n(171),Ae=n.n(Ie),Re=n(173),Le=n.n(Re),Fe=n(174),ze=n.n(Fe),De=n(175),Pe=n.n(De),We=n(176),Ke=n.n(We),Ue=n(169),Ge=n.n(Ue),Ve=n(170),Je=n.n(Ve),qe=n(23),He=(n(314),[{label:"UL",style:"unordered-list-item",icon:o.a.createElement(Ge.a,null)},{label:"OL",style:"ordered-list-item",icon:o.a.createElement(Je.a,null)},{label:"Blockquote",style:"blockquote",icon:o.a.createElement(Ae.a,null)},{label:"Code Block",style:"code-block",icon:o.a.createElement(Te.a,null)}]),Xe=[{label:"Bold",style:"BOLD",icon:o.a.createElement(Le.a,null)},{label:"Italic",style:"ITALIC",icon:o.a.createElement(ze.a,null)},{label:"Underline",style:"UNDERLINE",icon:o.a.createElement(Pe.a,null)},{label:"Monospace",style:"CODE",icon:o.a.createElement(Ke.a,null)}],Ye=function(e){switch(e.getType()){case"blockquote":return"RichEditor-blockquote";default:return""}},$e=function(e){var t=e.onToggle,n=e.style,a=e.active,i=e.label,r=e.icon,c=function(e){e.preventDefault(),t(n)},l="RichEditor-styleButton";return a&&(l+=" RichEditor-activeButton"),r?o.a.createElement(oe.a,{size:"small",onMouseDown:c,className:l},r):o.a.createElement(W.a,{size:"small",startIcon:r||void 0,onMouseDown:c,className:l},r?"":i)},Qe=function(e){var t=e.editorState,n=e.onToggle,a=t.getSelection(),i=t.getCurrentContent().getBlockForKey(a.getStartKey()).getType();return o.a.createElement("div",null,He.map((function(e){return o.a.createElement($e,{key:e.label,active:e.style===i,label:e.label,icon:e.icon,onToggle:n,style:e.style})})))},Ze=function(e){var t=e.editorState,n=e.onToggle,a=t.getCurrentInlineStyle();return o.a.createElement("div",null,Xe.map((function(e){return o.a.createElement($e,{key:e.label,active:a.has(e.style),label:e.label,icon:e.icon,onToggle:n,style:e.style})})))},_e=Object(L.a)((function(e){return Object(F.a)({root:{width:"100%"},wrapper:{".multiLine &":{boxShadow:"0 0 ".concat(e.spacing(2),"px ").concat(e.spacing(2),"px ").concat(e.palette.background.default)},background:"\n        linear-gradient(\n          to top,\n          ".concat(Object(U.c)(e.palette.background.default,0),",\n          ").concat(Object(U.c)(e.palette.background.default,1),"             ").concat(e.spacing(1)/2,"px calc(100% - ").concat(e.spacing(1)/2,"px),\n          ").concat(Object(U.c)(e.palette.background.default,0),"\n        ),\n        linear-gradient(\n          to right,\n          ").concat(e.palette.primary.main,",\n          ").concat(e.palette.secondary.main," \n        )\n      ")},backdrop:{backgroundColor:Object(U.c)(e.palette.background.default,.6)},inputWrapper:{outline:"none","& .DraftEditor-editorContainer":{maxHeight:"70vh",overflowY:"auto",border:0,padding:e.spacing(1,2,1,2),"& [data-contents=true] > [data-block=true]":Object(u.a)(Object(u.a)({},e.typography.body2),{},{"&:first-child":Object(u.a)({},e.typography.body1)})}},toolbar:{justifyContent:"center","&>div:first-child":{marginRight:e.spacing(4)}}})})),et=o.a.forwardRef((function(e,t){var n=e.note,a=e.text,i=e.rawContent,r=e.placeholder,c=e.autoFocus,l=e.showBackdrop,d=e.showControls,s=e.showRichTextControls,u=e.className,p=e.wrapperClassName,m=e.inputClassName,g=e.onValue,f=e.onClickAway,v=e.onEscape,b=_e(),h=o.a.useRef(null),j=o.a.useRef(null),N=o.a.useRef(null),O=null===n||void 0===n?void 0:n.nodeContent,k=o.a.useMemo((function(){return O&&Object(qe.convertFromRaw)(JSON.parse(O))||i&&Object(qe.convertFromRaw)(i)}),[O,i]),w=o.a.useState((function(){var e;return qe.EditorState.createWithContent(k||qe.ContentState.createFromText(null!==(e=null!==a&&void 0!==a?a:null===n||void 0===n?void 0:n.content)&&void 0!==e?e:""))})),x=Object(E.a)(w,2),C=x[0],S=x[1],M=Object(xe.a)("(pointer: coarse) and (hover: none)"),B=o.a.useState(!M),T=Object(E.a)(B,2),I=T[0],A=T[1],R=o.a.useState(1),L=Object(E.a)(R,2),F=L[0],z=L[1];o.a.useEffect((function(){c&&S(qe.EditorState.moveFocusToEnd(C))}),[F]);var D=function(e){var t=C.getCurrentContent(),a=Object(qe.convertToRaw)(t);n&&(n.setRawContentState(a),n.setContent(t.getFirstBlock().getText())),(null===g||void 0===g?void 0:g(n||function(e){if("string"===typeof e)return!0;var t,n=Object(y.a)(e.blocks);try{for(n.s();!(t=n.n()).done;){var a=t.value;if(a.depth||"unstyled"!==a.type||a.inlineStyleRanges.length)return!1}}catch(o){n.e(o)}finally{n.f()}return!0}(a)?t.getPlainText():a,e))&&(z(F+1),S(qe.EditorState.forceSelection(qe.EditorState.push(qe.EditorState.moveFocusToEnd(C),qe.ContentState.createFromText(""),"remove-range"),t.getSelectionAfter())))},P=C.getCurrentContent().getBlocksAsArray().length;return o.a.createElement("div",{ref:t,className:[b.root,P>1?"multiLine":null,u].join(" ")},o.a.createElement(Ce.a,{ref:N,open:Boolean(P>1&&l),className:b.backdrop,transitionDuration:3e3}),o.a.createElement(Se.a,{mouseEvent:"onMouseDown",touchEvent:"onTouchStart",onClickAway:function(e){f?f():D(e)}},o.a.createElement(Me.a,{in:!0,timeout:300},o.a.createElement("div",{ref:h,className:[b.wrapper,p].join(" ")},o.a.createElement("div",{tabIndex:-1,className:[b.inputWrapper,m].join(" ")},o.a.createElement(qe.Editor,{key:F,ref:j,blockStyleFn:Ye,editorState:C,handleKeyCommand:function(e,t){var n=qe.RichUtils.handleKeyCommand(t,e);return n?(S(n),"handled"):"not-handled"},keyBindingFn:function(e){return 13===e.keyCode?I&&!e.shiftKey||!I&&e.shiftKey?(D(),null):(A(!1),Object(qe.getDefaultKeyBinding)(e)):27===e.keyCode?(null===v||void 0===v||v(),null):Object(qe.getDefaultKeyBinding)(e)},onChange:S,placeholder:r,spellCheck:!0})),P>1&&d&&o.a.createElement(ae.a,{variant:"dense",className:b.toolbar},s&&o.a.createElement(o.a.Fragment,null,o.a.createElement(Ze,{editorState:C,onToggle:function(e){S(qe.RichUtils.toggleInlineStyle(C,e))}}),o.a.createElement(Qe,{editorState:C,onToggle:function(e){S(qe.RichUtils.toggleBlockType(C,e))}})))))))}));et.defaultProps={showBackdrop:!0,showControls:!0,showRichTextControls:!0};var tt=Object(L.a)((function(e){var t;return Object(F.a)({listItemContainer:(t={borderTop:".1px solid ".concat(e.palette.divider)},Object(O.a)(t,"&.isEditing, &.isEditing + li,  &.isEditing + .MuiCollapse-container > .MuiCollapse-wrapper > .MuiCollapse-wrapperInner > .MuiList-root > .MuiListItem-container:first-child",{borderTop:".1px solid transparent"}),Object(O.a)(t,"transition",e.transitions.create(["color","background"],{duration:e.transitions.duration.shortest})),Object(O.a)(t,"&:hover",{color:e.palette.primary.main,backgroundColor:e.palette.background.paper}),Object(O.a)(t,"cursor","pointer"),Object(O.a)(t,"&.isEditing, .editMode &, .selectMode &",{cursor:"default",color:"unset"}),t),listItem:{position:"relative","&.Mui-selected":{background:"\n          linear-gradient(\n            to top,\n            ".concat(Object(U.c)(e.palette.background.default,0),",\n            ").concat(Object(U.c)(e.palette.background.default,.9),"               ").concat(e.spacing(1)/2,"px calc(100% - ").concat(e.spacing(1)/2,"px),\n            ").concat(Object(U.c)(e.palette.background.default,0),"\n          ),\n          linear-gradient(\n            to right,\n            ").concat(e.palette.primary.main,",\n            ").concat(e.palette.secondary.main," \n          )\n        "),"&:hover":{color:"unset"},"& a:hover":{color:"unset"}}},childList:{marginLeft:e.spacing(4),padding:0},itemText:{margin:0,".isDragging &":{opacity:.5},"&, & .MuiListItemText-secondary":{overflowX:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"},"& .MuiListItemText-primary":{display:"inline"},"& .MuiListItemText-secondary":{display:"inline",paddingLeft:e.spacing(1)},"&.expand":{"& .MuiListItemText-secondary":{display:"block",paddingLeft:0}}},listItemSelectCheckbox:{padding:e.spacing(0,1,0,1),"&:hover, &.Mui-checked:hover":{backgroundColor:"unset"}},listItemIcon:{minWidth:"auto"},noteEditor:{zIndex:e.zIndex.appBar-1,cursor:"default",position:"absolute",top:0,left:0},noteEditorInput:{cursor:"text"},secondaryActions:{display:"none","&.hasChild, .selectMode &":{display:"unset"},right:0},edgeArrow:{cursor:"default",color:e.palette.text.hint,"&:hover":{background:"inherit"},".isExpanded &":{color:e.palette.text.primary},".selectMode &":{cursor:"pointer","&:hover":{color:e.palette.primary.main}},transition:e.transitions.create(["color"],{duration:e.transitions.duration.shortest}),minWidth:"unset",paddingRight:e.spacing(2),paddingLeft:e.spacing(2)}})})),nt=Object(A.a)((function(e){var t,n,a,i,r,l=e.node,d=e.parentNode,u=e.expandSecondaryTypography,p=e.className,m=e.index,g=e.moveItem,f=e.onContextMenu,v=tt(),b=o.a.useRef(null),h=Object(H.c)(),y=c(),j=y.activeModes,N=s(),O=N.view,k=o.a.useState(!1),w=Object(E.a)(k,2),x=w[0],C=w[1],S=null===(t=y.selectedNodes.get(d.id))||void 0===t?void 0:t.includes(l.id),M=null!==(n=null===O||void 0===O||null===(a=O.getItem("".concat(d.id,"/").concat(l.id)))||void 0===a?void 0:a.expanded)&&void 0!==n&&n,B=Object(X.a)({accept:"Node"+d.id,hover:function(e,t){var n;if(b.current){var a=e.index,o=m;if(a!==o){var i=null===(n=b.current)||void 0===n?void 0:n.getBoundingClientRect(),r=i.height/2,c=t.getClientOffset().y-i.top;a<o&&c<r||a>o&&c>r||(e.index=o,g(e,a,o))}}}}),T=Object(E.a)(B,2)[1],I=Object(Y.a)({canDrag:function(){return!x},item:{type:"Node"+d.id,path:"".concat(d.id,"/").concat(l.id),parentNode:d,childNode:l,index:m},collect:function(e){return{isDragging:e.isDragging()}}}),A=Object(E.a)(I,2),R=A[0].isDragging;(0,A[1])(T(b));var L,F=l.id,U=null===(i=l.content)||void 0===i||null===(r=i.toJSON)||void 0===r?void 0:r.call(i);if("string"===typeof l.content){var G=l.content.indexOf("\n");F=G>0?l.content.slice(0,G):l.content,L=G>0?l.content.slice(G+1):void 0}else if(U){var J;F=U.blocks[0].text,L=null===(J=U.blocks[1])||void 0===J?void 0:J.text}return o.a.createElement(o.a.Fragment,null,o.a.createElement(z.a,{ref:b,onClick:function(e){e.preventDefault(),x||(e.altKey?(y.setActiveMode("edit"),C(!0)):e.shiftKey?(C(!1),y.setActiveMode("select"),y.toggleSelectNode(l,d)):e.metaKey?h(Oe("/node/".concat(l.id,"/"))):j.includes("select")?y.toggleSelectNode(l,d):j.includes("edit")?C(!0):h(Oe("/node/".concat(l.id,"/"))))},selected:S,className:v.listItem,ContainerProps:{onContextMenu:f,className:[v.listItemContainer,M?"isExpanded":"",R?"isDragging":"",x?"isEditing":"",p].join(" ")}},x&&o.a.createElement(et,{autoFocus:!0,text:U?void 0:l.content,rawContent:U,className:v.noteEditor,inputClassName:v.noteEditorInput,onValue:function(e){C(!1),e&&("string"===typeof e||Object.keys(e).includes("blocks"))&&l.setContent(e)},onEscape:function(){C(!1),y.unsetActiveMode("edit")}}),o.a.createElement(D.a,{primary:F,secondary:L,className:[v.itemText,u?"expand":""].join(" ")}),o.a.createElement(P.a,{className:[v.secondaryActions,l.childCount>0?"hasChild":""].join(" ")},o.a.createElement(W.a,{size:"small",onClick:function(e){j.includes("select")||e.metaKey?h(Oe("/node/".concat(l.id,"/"))):function(){var e=N.initView().initItem("".concat(d.id,"/").concat(l.id));e.setExpanded(!e.expanded)}()},className:v.edgeArrow,endIcon:M?o.a.createElement(q.a,null):o.a.createElement(V.a,null)},l.childCount>0&&l.childCount))),l.childCount>0&&o.a.createElement(K.a,{in:M,timeout:"auto",unmountOnExit:!0},o.a.createElement(ot,{node:l,edgeTag:"child",className:v.childList})))}));nt.defaultProps={expandSecondaryTypography:!0};var at=Object(L.a)((function(e){return Object(F.a)({list:{padding:0,"&.outer":{borderBottom:".1px solid ".concat(e.palette.divider),"& > li:first-child":{border:0}}}})})),ot=Object(A.a)((function(e){var t=e.node,n=e.edgeTag,a=e.outer,i=e.className,r=at(),l=t.edgeMap.get(n),d=c().activeModes,s=o.a.useCallback((function(e,t,n){e.parentNode.reorderEdge("child",e.childNode,n,t)}),[]);return(null===l||void 0===l?void 0:l.length)?o.a.createElement(R.a,{"aria-label":"edge list",className:[r.list,a?"outer":null,a&&d.includes("edit")?"editMode":null,a&&d.includes("select")?"selectMode":null,i].join(" ")},l.map((function(e,a){return o.a.createElement(nt,{key:"".concat(t.id,"-").concat(n,"-").concat(e.id),index:a,node:e,parentNode:t,moveItem:s})}))):null})),it=(n(374),Object(L.a)((function(e){return Object(F.a)({root:Object(u.a)({display:"inline-block",margin:0,padding:e.spacing(1,2,1,2),overflowX:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"},e.typography.body1)})})),n(190)),rt=n.n(it),ct=n(189),lt=n.n(ct),dt=n(188),st=n.n(dt),ut=n(191),pt=n.n(ut),mt=n(363),gt=n(320),ft=n(364),vt=n(365),bt=n(182),ht=n.n(bt),Et=n(183),yt=n.n(Et),jt=n(187),Nt=n.n(jt),Ot=n(185),kt=n.n(Ot),wt=n(184),xt=n.n(wt),Ct=n(186),St=n.n(Ct),Mt=n(180),Bt=n.n(Mt),Tt=Object(L.a)((function(e){return Object(F.a)({root:{display:"inherit",position:"relative"},buttonGroup:{"& .MuiButtonGroup-groupedTextHorizontal":{borderRight:"unset"},"& .MuiButtonGroup-grouped":{minWidth:"unset"}},selectCount:{color:e.palette.primary.main,fontSize:12,position:"absolute",right:-e.spacing(1)},selectButton:{},deleteButton:{color:e.palette.error.main},popper:{"& svg":{marginRight:e.spacing(1)}},paper:{border:".1px solid ".concat(e.palette.divider)},selectMenu:{outline:0}})})),It=Object(A.a)((function(e){e.node;var t=e.className,n=e.onClick,a=Object($.a)(e,["node","className","onClick"]),i=c(),r=s(),l=Tt(),d=o.a.useRef(null),u=i.selectedNodeCount,p=o.a.useState(!1),m=Object(E.a)(p,2),g=m[0],f=m[1],v=o.a.useState(!1),b=Object(E.a)(v,2),h=b[0],y=b[1];return o.a.useEffect((function(){var e=function(e){"Alt"===e.key&&y(!0)},t=function(e){"Alt"===e.key&&y(!1)};return document.addEventListener("keydown",e),document.addEventListener("keyup",t),function(){document.removeEventListener("keydown",e),document.removeEventListener("keyup",t)}})),o.a.createElement("div",{className:[l.root,t].join(" ")},u>0&&o.a.createElement("span",{className:l.selectCount},u),o.a.createElement(oe.a,Object.assign({color:"primary",ref:d,onClick:i.selectedNodes.size?function(){return f((function(e){return!e}))}:n,className:l.selectButton},a),o.a.createElement(Bt.a,null)),o.a.createElement(mt.a,{open:g,anchorEl:d.current,role:void 0,disablePortal:!0,className:l.popper},(function(e){e.placement;return o.a.createElement(Se.a,{onClickAway:function(e){e.preventDefault(),f(!1)}},o.a.createElement(gt.a,{elevation:0,className:l.paper},o.a.createElement(ft.a,{dense:!0,className:l.selectMenu},o.a.createElement(vt.a,{divider:!0,onClick:function(){i.removeSelectedNodes(),f(!1)},className:l.deleteButton},o.a.createElement(ht.a,null),"Remove"),h?o.a.createElement(vt.a,{onClick:function(){i.linkSelectedNodes(r),f(!1)}},o.a.createElement(yt.a,null),"Link here"):o.a.createElement(vt.a,{disabled:!0,onClick:function(){f(!1)}},o.a.createElement(xt.a,null),"Copy here"),o.a.createElement(vt.a,{divider:!0,onClick:function(){i.moveSelectedNodes(r),f(!1)}},o.a.createElement(kt.a,null),"Move here"),o.a.createElement(vt.a,{divider:!0,onClick:function(){console.log(i.exportSelectedNodes()),f(!1)}},o.a.createElement(St.a,null),"Export"),o.a.createElement(vt.a,{onClick:function(){i.clearSelectedNodes(),f(!1)}},o.a.createElement(Nt.a,null),"Clear selection"))))})))})),At=Object(L.a)((function(e){var t;return Object(F.a)({root:{},toolbar:(t={justifyContent:"space-evenly"},Object(O.a)(t,e.breakpoints.up("sm"),{justifyContent:"center"}),Object(O.a)(t,"minHeight",e.spacing(8)),Object(O.a)(t,"backdropFilter","blur(3px)"),Object(O.a)(t,"background","\n        linear-gradient(\n          to bottom,\n          ".concat(Object(U.c)(e.palette.background.default,.9),",\n          ").concat(Object(U.c)(e.palette.background.default,1)," 80%\n        )")),t),insertButton:{color:e.palette.background.default,boxShadow:"unset",margin:e.spacing(0,1,0,1),background:"\n        radial-gradient(\n          circle at bottom,\n          ".concat(e.palette.secondary.main,",\n          ").concat(e.palette.primary.main," 75%\n        )"),"&:hover, &:focus":{boxShadow:"unset",background:"\n        radial-gradient(\n          circle at bottom,\n          ".concat(Object(U.b)(e.palette.secondary.main,.3),",\n          ").concat(e.palette.primary.main," 75%\n        )")},"&:active":{boxShadow:"unset",background:"\n        radial-gradient(\n          circle at bottom,\n          ".concat(Object(U.b)(e.palette.secondary.main,.3),",\n          ").concat(e.palette.primary.main," 75%\n        )")}}})})),Rt=Object(A.a)((function(e){var t,n=e.node,a=e.className,i=At(),r=c(),l=n.childCount>0,d=null!==(t=r.selectedNodes.size)&&void 0!==t?t:0;return o.a.createElement(Z.a,{className:[i.root,a].join(" ")},o.a.createElement(ae.a,{className:i.toolbar},o.a.createElement(oe.a,{disabled:!0,color:r.activeModes.includes("edit")?"primary":void 0,onClick:function(){return r.toggleActiveMode("edit")}},o.a.createElement(st.a,null)),o.a.createElement(oe.a,{disabled:!l,color:r.activeModes.includes("edit")?"primary":void 0,onClick:function(){return r.toggleActiveMode("edit")}},o.a.createElement(lt.a,null)),o.a.createElement(oe.a,{color:"primary",onClick:function(){r.setActiveMode("insert")},className:i.insertButton},o.a.createElement(rt.a,null)),o.a.createElement(It,{disabled:!(l||d>0),node:n,color:r.activeModes.includes("select")?"primary":void 0,onClick:function(){r.toggleActiveMode("select")}}),o.a.createElement(oe.a,{disabled:!0,color:r.activeModes.includes("edit")?"primary":void 0,onClick:function(){return r.toggleActiveMode("edit")}},o.a.createElement(pt.a,null)),!1))})),Lt=Object(L.a)((function(e){return Object(F.a)({root:{textAlign:"center",position:"relative",paddingBottom:e.spacing(8)},appBar:{position:"sticky",borderBottom:".1px solid ".concat(e.palette.divider),backdropFilter:"blur(3px)",background:"\n        linear-gradient(\n          to top,\n          ".concat(Object(U.c)(e.palette.background.default,.9),",\n          ").concat(Object(U.c)(e.palette.background.default,1)," 80%\n        )")},titleBar:{background:"unset"},children:{marginBottom:"-0.1px"},textEditor:{position:"sticky",zIndex:e.zIndex.appBar+1,bottom:e.spacing(8)},actions:Object(O.a)({borderTop:".1px solid ".concat(e.palette.divider),zIndex:e.zIndex.appBar,position:"fixed",bottom:0,left:"50%",width:"100%",transform:"translateX(-50%)"},e.breakpoints.up("sm"),{maxWidth:"900px"})})})),Ft=Object(A.a)((function(e){var t,n,a,i=e.node,r=e.className,l=e.children,d=Lt(),s=Object(H.c)(),u=c(),p=null===(t=i.content)||void 0===t||null===(n=t.toJSON)||void 0===n?void 0:n.call(t);if("string"===typeof i.content)a=i.content;else if(p){var m,g;a=null===(m=p.blocks)||void 0===m||null===(g=m[0])||void 0===g?void 0:g.text}else a=i.id;return o.a.createElement(Z.a,{className:[d.root,r].join(" ")},o.a.createElement(ee.a,{elevation:0,className:d.appBar},o.a.createElement(se,{title:a,className:d.titleBar})),o.a.createElement(Z.a,{className:[d.children,u.activeModes.includes("insert")?"fade":""].join(" ")},l),u.activeModes.includes("insert")&&o.a.createElement(et,{autoFocus:!0,className:d.textEditor,onValue:function(e,t){if(e){var n=u.createChild(i,{content:e});if(!(null===t||void 0===t?void 0:t.ctrlKey))return!0;s(Oe("/node/".concat(n.id,"/")))}else u.toggleActiveMode("insert")},onEscape:function(){u.unsetActiveMode("insert")}}),o.a.createElement(Rt,{node:i,className:[d.actions,u.activeModes.includes("insert")?"fade":""].join(" ")}))})),zt=n(366),Dt=n(192),Pt=Object(A.a)((function(e){var t=e.id,n=c(),a=n.Node.get(t),i=null!==a&&void 0!==a?a:n.rootNode;return i?o.a.createElement(zt.a,{backend:Dt.a},o.a.createElement(d,{value:i},o.a.createElement(Ft,{node:i},o.a.createElement(ot,{node:i,edgeTag:"child",outer:!0})))):null})),Wt=(n(371),Object(L.a)((function(e){return Object(F.a)({root:{display:"inherit",position:"relative"},buttonGroup:{"& .MuiButtonGroup-groupedTextHorizontal":{borderRight:"unset"},"& .MuiButtonGroup-grouped":{minWidth:"unset"}},selectCount:{color:e.palette.primary.main,fontSize:12,position:"absolute",right:-e.spacing(1)},selectButton:{},deleteButton:{color:e.palette.error.main},popper:{"& svg":{marginRight:e.spacing(1)}},paper:{border:".1px solid ".concat(e.palette.divider)},selectMenu:{outline:0}})})),m.i.model("Store",{graph:I,location:m.i.optional(m.i.string,"/")}).actions((function(e){return{setLocation:function(t){e.location=t}}})).create({graph:I.create()})),Kt=o.a.createContext(Wt),Ut=function(e){var t=e.children;return o.a.createElement(Kt.Provider,{value:Wt},t)};function Gt(){var e=o.a.useContext(Kt);if(e)return e;throw Error("Cannot use store before setup")}Object(A.a)((function(e){var t=e.id,n=(e.type,Gt()),a=n.graph.Node.get(t),i=n.graph.rootNode;return a&&(i=a),i?o.a.createElement(Ft,{node:i},o.a.createElement(ot,{node:i,edgeTag:"child"})):null}));var Vt=Object(L.a)((function(e){return Object(F.a)({root:{},item:{},itemText:{}})})),Jt=(Object(A.a)((function(e){var t=Vt(),n=c(),a=e.node;if("string"===typeof a&&(a=n.Node.get(e.node)),!Object(m.g)(a))return o.a.createElement(o.a.Fragment,null);var i=Object(m.b)(a),r=Object.keys(i.properties);return o.a.createElement("form",{onSubmit:function(){console.log("submit")}},o.a.createElement(R.a,{className:t.root},r.map((function(e){return o.a.createElement(z.a,{dense:!0,button:!0,key:e,className:t.item},o.a.createElement(D.a,{primary:e,id:"list-content-".concat(e),className:t.itemText}))}))))})),n(367)),qt=n(368),Ht=n(369),Xt=function(e){var t=e.children,n=Object(xe.a)("(prefers-color-scheme: dark)"),a=o.a.useMemo((function(){var e={type:n?"dark":"light",primary:{main:"#FF2EA2"},secondary:{main:"#FF8F00"},divider:n?"#222222":"#e0e0e0",background:{default:n?"#000000":"#ffffff",paper:n?"#141414":"#fbfbfb"},text:{primary:n?"#dddddd":"#212121",secondary:n?"#aaaaaa":"#595959"}};return Object(Jt.a)({palette:e,typography:{fontSize:16,fontFamily:["-apple-system","system-ui","BlinkMacSystemFont",'"Segoe UI"',"Roboto",'"Helvetica Neue"',"Arial","sans-serif"].join(", ")},shape:{borderRadius:6},props:{MuiButton:{disableElevation:!0},MuiButtonGroup:{disableElevation:!0}},overrides:{MuiButtonBase:{root:{cursor:"default"}},MuiCssBaseline:{"@global":{"*::selection":{backgroundColor:Object(U.c)(e.text.primary,n?.4:.2)},html:{userSelect:"none",overscrollBehavior:"none","-webkit-touch-callout":"none",height:"100%",margin:"auto",maxWidth:"900px"},body:{height:"100%"}}}}})}),[n]);return o.a.createElement(qt.a,{theme:a},o.a.createElement(Ht.a,null),t)},Yt=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function $t(e,t){navigator.serviceWorker.register(e).then((function(e){e.onupdatefound=function(){var n=e.installing;null!=n&&(n.onstatechange=function(){"installed"===n.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See https://bit.ly/CRA-PWA."),t&&t.onUpdate&&t.onUpdate(e)):(console.log("Content is cached for offline use."),t&&t.onSuccess&&t.onSuccess(e)))})}})).catch((function(e){console.error("Error during service worker registration:",e)}))}r.a.render(o.a.createElement(o.a.StrictMode,null,o.a.createElement(Ut,null,o.a.createElement(Xt,null,o.a.createElement(we,null)))),document.getElementById("root")),function(e){if("serviceWorker"in navigator){if(new URL("/exuo",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",(function(){var t="".concat("/exuo","/service-worker.js");Yt?(!function(e,t){fetch(e,{headers:{"Service-Worker":"script"}}).then((function(n){var a=n.headers.get("content-type");404===n.status||null!=a&&-1===a.indexOf("javascript")?navigator.serviceWorker.ready.then((function(e){e.unregister().then((function(){window.location.reload()}))})):$t(e,t)})).catch((function(){console.log("No internet connection found. App is running in offline mode.")}))}(t,e),navigator.serviceWorker.ready.then((function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://bit.ly/CRA-PWA")}))):$t(t,e)}))}}()}},[[204,1,2]]]);
//# sourceMappingURL=main.c075a9c0.chunk.js.map