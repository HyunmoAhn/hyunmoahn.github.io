"use strict";(self.webpackChunkhyunmoahn_github_io=self.webpackChunkhyunmoahn_github_io||[]).push([[6667],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>b});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function m(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=n.createContext({}),u=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},p=function(e){var t=u(e.components);return n.createElement(l.Provider,{value:t},e.children)},s="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},c=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,i=e.originalType,l=e.parentName,p=m(e,["components","mdxType","originalType","parentName"]),s=u(r),c=a,b=s["".concat(l,".").concat(c)]||s[c]||d[c]||i;return r?n.createElement(b,o(o({ref:t},p),{},{components:r})):n.createElement(b,o({ref:t},p))}));function b(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=r.length,o=new Array(i);o[0]=c;var m={};for(var l in t)hasOwnProperty.call(t,l)&&(m[l]=t[l]);m.originalType=e,m[s]="string"==typeof e?e:a,o[1]=m;for(var u=2;u<i;u++)o[u]=r[u];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}c.displayName="MDXCreateElement"},1:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>d,frontMatter:()=>i,metadata:()=>m,toc:()=>u});var n=r(3117),a=(r(7294),r(3905));const i={slug:"deep-dive-to-immer",title:"immer \ub0b4\ubd80 \uc0b4\ud3b4\ubcf4\uae30",description:"redux\uc5d0\uc11c \uc8fc\ub85c \uc0ac\uc6a9\ub418\ub294 immer\ub294 mutable\ud55c \uac1d\uccb4 \uc5c5\ub370\uc774\ud2b8\ub97c immutable\ud558\uac8c \uc0ac\uc6a9\ud558\ub294 \uac83 \ucc98\ub7fc \ub3c4\uc640\uc900\ub2e4. \uc5b4\ub5bb\uac8c \uc774\ub7f0 \ub85c\uc9c1\uc774 \uac00\ub2a5\ud55c\uac78\uae4c?",keywords:["redux","redux-toolkit","immer","immutable","javascript","deep-dive","how-to-work","web"],authors:"HyunmoAhn",tags:["redux","redux-toolkit","immer","library","how-to-work","deep-dive","javascript","web","immutable"]},o=void 0,m={permalink:"/deep-dive-to-immer",source:"@site/blog/2021-10-23-deep-dive-to-immer.md",title:"immer \ub0b4\ubd80 \uc0b4\ud3b4\ubcf4\uae30",description:"redux\uc5d0\uc11c \uc8fc\ub85c \uc0ac\uc6a9\ub418\ub294 immer\ub294 mutable\ud55c \uac1d\uccb4 \uc5c5\ub370\uc774\ud2b8\ub97c immutable\ud558\uac8c \uc0ac\uc6a9\ud558\ub294 \uac83 \ucc98\ub7fc \ub3c4\uc640\uc900\ub2e4. \uc5b4\ub5bb\uac8c \uc774\ub7f0 \ub85c\uc9c1\uc774 \uac00\ub2a5\ud55c\uac78\uae4c?",date:"2021-10-23T00:00:00.000Z",formattedDate:"2021\ub144 10\uc6d4 23\uc77c",tags:[{label:"redux",permalink:"/tags/redux"},{label:"redux-toolkit",permalink:"/tags/redux-toolkit"},{label:"immer",permalink:"/tags/immer"},{label:"library",permalink:"/tags/library"},{label:"how-to-work",permalink:"/tags/how-to-work"},{label:"deep-dive",permalink:"/tags/deep-dive"},{label:"javascript",permalink:"/tags/javascript"},{label:"web",permalink:"/tags/web"},{label:"immutable",permalink:"/tags/immutable"}],readingTime:44.83,hasTruncateMarker:!0,authors:[{name:"Hyunmo Ahn",title:"Front End Engineer @ Line Biz+",url:"https://github.com/HyunmoAhn",imageURL:"https://github.com/HyunmoAhn.png",key:"HyunmoAhn"}],frontMatter:{slug:"deep-dive-to-immer",title:"immer \ub0b4\ubd80 \uc0b4\ud3b4\ubcf4\uae30",description:"redux\uc5d0\uc11c \uc8fc\ub85c \uc0ac\uc6a9\ub418\ub294 immer\ub294 mutable\ud55c \uac1d\uccb4 \uc5c5\ub370\uc774\ud2b8\ub97c immutable\ud558\uac8c \uc0ac\uc6a9\ud558\ub294 \uac83 \ucc98\ub7fc \ub3c4\uc640\uc900\ub2e4. \uc5b4\ub5bb\uac8c \uc774\ub7f0 \ub85c\uc9c1\uc774 \uac00\ub2a5\ud55c\uac78\uae4c?",keywords:["redux","redux-toolkit","immer","immutable","javascript","deep-dive","how-to-work","web"],authors:"HyunmoAhn",tags:["redux","redux-toolkit","immer","library","how-to-work","deep-dive","javascript","web","immutable"]},prevItem:{title:"Front-end\uc5d0\uc11c OAS generator\ub97c \uc5b4\ub5bb\uac8c \uc4f0\uba74 \uc88b\uc744\uae4c?",permalink:"/how-to-use-oas-generator"},nextItem:{title:"redux-devtools\uc758 time-travel-debugging \ud1ba\uc544\ubcf4\uae30",permalink:"/how-to-time-travel-debugging-at-redux-devtools"}},l={authorsImageUrls:[void 0]},u=[{value:"\ubb34\uc5c7\uc774 \uad81\uae08\ud560\uae4c?",id:"\ubb34\uc5c7\uc774-\uad81\uae08\ud560\uae4c",level:2}],p={toc:u},s="wrapper";function d(e){let{components:t,...r}=e;return(0,a.kt)(s,(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"\uc774 \uae00\uc740 \uae30\ubcf8\uc801\uc73c\ub85c ",(0,a.kt)("a",{parentName:"p",href:"https://immerjs.github.io/immer/"},"immer"),"\uc5d0 \ub300\ud574\uc11c \uc54c\uc544\ubcf4\ub294 \uc2dc\uac04\uc744 \uac00\uc9c4\ub2e4. \ub9cc\uc57d immer\ub97c \uc798 \ubaa8\ub974\ub294 \ubd84\ub4e4\uc740 ",(0,a.kt)("a",{parentName:"p",href:"#immer%EB%8A%94-%EB%AC%B4%EC%97%87%EC%9D%B4%EA%B3%A0-%EC%99%9C-%EC%82%AC%EC%9A%A9%ED%95%98%EB%8A%94%EA%B1%B8%EA%B9%8C"},"\uc544\ub798 \ucc55\ud130"),"\ub97c \uba3c\uc800 \uc77d\uc5b4\ubcf4\ub294 \uac83\uc744 \uad8c\uc7a5\ud55c\ub2e4."),(0,a.kt)("h2",{id:"\ubb34\uc5c7\uc774-\uad81\uae08\ud560\uae4c"},"\ubb34\uc5c7\uc774 \uad81\uae08\ud560\uae4c?"),(0,a.kt)("admonition",{title:"Question",type:"tip"},(0,a.kt)("p",{parentName:"admonition"},"Q1. ",(0,a.kt)("inlineCode",{parentName:"p"},"immer"),"\ub294 \uac1d\uccb4 mutable\ud558\uac8c \ubc14\uafb8\ub294 \ubc29\uc2dd\uc744 \uc5b4\ub5bb\uac8c immutable\ud55c \ubc29\uc2dd\uc73c\ub85c \ubc14\uafb8\uc5b4\uc8fc\uace0 \uc788\uc744\uae4c? ")),(0,a.kt)("p",null,"immer\ub294 mutable\ud558\uac8c \ubcc0\uacbd\ud558\ub294 \uac1d\uccb4 built-in method\ub97c \uc0ac\uc6a9\ud558\ub354\ub77c\ub3c4 immutable\ud558\uac8c \ub370\uc774\ud130\ub97c \ubc18\ud658\ud574\uc8fc\ub294 \uae30\ub2a5\uc744 \ud55c\ub2e4. \uc774 \uae30\ub2a5\uc774 \ub0b4\ubd80\uc801\uc73c\ub85c \uc5b4\ub5a4 \ubc29\uc2dd\uc73c\ub85c \uc774\ub8e8\uc5b4\uc9c0\ub294\uc9c0 \uc54c\uc544\ubcf8\ub2e4."),(0,a.kt)("p",null,"\uc544\ub798 \ucf54\ub4dc \uc608\uc2dc\ub294 ",(0,a.kt)("a",{parentName:"p",href:"https://immerjs.github.io/immer/#a-quick-example-for-comparison"},"immer \uacf5\uc2dd \ubb38\uc11c"),"\uc5d0 \uc874\uc7ac\ud558\ub294 basic example\uc744 \uac00\uc838\uc628 \uac83\uc774\ub2e4."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},'import produce from \'immer\';\n\nconst baseState = [\n  { \n    title: "Learn TypeScript", \n    done: true,\n  },\n  { \n    title: "Try Immer", \n    done: false,\n  },\n]\n\nconst nextState = produce(baseState, (draft) => {\n  draft.push({ title: "Tweet about It" });\n  draft[1].done = true;\n})\n\nconsole.log(baseState === nextState) // false\nconsole.log(nextState)\n/*\n[\n  { \n    title: "Learn TypeScript", \n    done: true,\n  },\n  { \n    title: "Learn TypeScript", \n    done: true,\n  },\n  { \n    title: "Tweet about It",\n  },\n]\n*/\n')),(0,a.kt)("admonition",{title:"Question",type:"tip"},(0,a.kt)("p",{parentName:"admonition"},"Q2. ",(0,a.kt)("inlineCode",{parentName:"p"},"immer"),"\ub294 \uc5b4\ub5bb\uac8c structural sharing\uc744 \uc0ac\uc6a9\ud558\ub294\uac78\uae4c?"),(0,a.kt)("p",{parentName:"admonition"},"*",(0,a.kt)("inlineCode",{parentName:"p"},"structural sharing"),": \uac1d\uccb4\ub97c copy\ud560 \ub54c \ubcc0\uacbd\ub418\uc9c0 \uc54a\uc740 \uac1d\uccb4\ub294 reference\ub97c \ub3d9\uc77c\ud558\uac8c \uc0ac\uc6a9\ud558\ub294 \ubc29\uc2dd.")),(0,a.kt)("p",null,"\uac1d\uccb4\ub97c immutable\ud558\uac8c \uc5c5\ub370\uc774\ud2b8 \ud55c\ub2e4\ub294 \uac83\uc740 \uae30\uc874 \uac1d\uccb4\ub97c \uc0c8\ub85c\uc6b4 \uac1d\uccb4\ub85c \ubcf5\uc0ac\ud55c\ub2e4\ub294 \uac83\uc774\ub2e4. \uc989, \ubcf5\uc0ac\uc5d0 \ube44\uc6a9\uc774 \ubc1c\uc0dd\ud55c\ub2e4.\nimmer\ub294 \uac1d\uccb4\ub97c \ubcf5\uc0ac\ud560 \ub54c, \ubcc0\uacbd\ub418\uc9c0 \uc54a\uc740 reference\ub294 \uc7ac\uc0ac\uc6a9\ud558\ub294 structural sharing \ubc29\uc2dd\uc744 \uc0ac\uc6a9\ud574\uc11c \uac1d\uccb4\ub97c \ubcf5\uc0ac\ud55c\ub2e4.\nimmer\uc5d0\uc11c\ub294 \uc5b4\ub5a4\ubc29\uc2dd\uc744 \uc0ac\uc6a9\ud574\uc11c structural sharing\uc744 \uc0ac\uc6a9\ud558\uace0 \uc788\ub294\uc9c0 \uc54c\uc544\ubcf8\ub2e4."),(0,a.kt)("admonition",{title:"Question",type:"tip"},(0,a.kt)("p",{parentName:"admonition"},"Q3. immer\uc5d0\uc11c\ub294 produce\ud568\uc218 \ub0b4\uc5d0\uc11c draft\ub97c \uc9c1\uc811 \uc5c5\ub370\uc774\ud2b8\ud558\ub294 \ubc29\uc2dd\uc774 \uc544\ub2c8\ub77c return\uc744 \ud1b5\ud574\uc11c \ub370\uc774\ud130\ub97c \uc5c5\ub370\uc774\ud2b8\ud558\ub294 \uacbd\uc6b0\uac00 \uc788\ub294\ub370, \uc774\ub7f0 \uacbd\uc6b0\uc5d0 \ub85c\uc9c1\uc774 \ub2e4\ub978\uc9c0?")),(0,a.kt)("p",null,"immer\ub97c \uc0ac\uc6a9\ud560 \ub54c, \uc704\uc5d0\uc11c \uc81c\uc2dc\ud55c mutable\ud55c \uac1d\uccb4 \ubcc0\uacbd \ubc29\uc2dd\uc774 \uc544\ub2cc, \uc0c8\ub85c\uc6b4 \uac1d\uccb4\ub97c \ub9ac\ud134\ud558\ub294 \uacbd\uc6b0\uac00 \uc788\ub2e4.\n\uc774\ub294 immer\uc640\ub294 \ubb34\uad00\ud558\uac8c immutable\ud558\uac8c Javascript\uc5d0\uc11c \uac1d\uccb4\ub97c \ubc18\ud658\ud574\uc8fc\ub294 \ubc29\uc2dd\uacfc \ub3d9\uc77c\ud558\ub2e4.\nimmer\uc5d0\uc11c\ub294 \uc774\ub7ec\ud55c \ubc29\uc2dd\uc744 ",(0,a.kt)("a",{parentName:"p",href:"https://immerjs.github.io/immer/return"},"\uacf5\uc2dd\uc801\uc73c\ub85c \ud5c8\uc6a9"),"\ud558\uace0 \uc788\uace0\n\ub450 \ubc29\uc2dd, mutable\ud558\uac8c \uac1d\uccb4\ub97c \ubcc0\uacbd\ud558\ub294 \ubc29\uc2dd\uacfc immutable\ud558\uac8c \uac1d\uccb4\ub97c \ubcc0\uacbd\uc2dc\ud0a4\ub294 \ubc29\uc2dd \ubaa8\ub450 \ud63c\uc6a9\ud574\uc11c \uc4f0\ub294 \uac1c\ubc1c\uc790\ub3c4 \ub9ce\uc744 \uac83 \uc774\ub2e4.\n\uc774\ub7ec\ud55c \ubc29\uc2dd \ucc28\uc774\ub294 immer\uc5d0\uc11c \uc5b4\ub5a4 \ub85c\uc9c1\ucc28\uc774\ub97c \ubc1c\uc0dd\uc2dc\ud0a4\ub294\uc9c0 \uc54c\uc544\ubcf8\ub2e4. "),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},'// mutable method\nconst nextState = produce(baseState, (draft) => {\n  draft.push({ title: "Tweet about It" });\n  draft[1].done = true;\n})\n\n// highlight-start\n// immutable method\nconst nextState = produce(baseState, (draft) => {\n  return {\n    ...baseState,\n    { ...baseState[1], done: true },\n    { title: "Tweet about It" },\n  }\n})\n// highlight-end\n')),(0,a.kt)("admonition",{title:"\uc0ac\uc804\uc9c0\uc2dd",type:"info"},(0,a.kt)("ul",{parentName:"admonition"},(0,a.kt)("li",{parentName:"ul"},"immer \ud639\uc740 redux-toolkit\uc744 \uc0ac\uc6a9\ud574 \ubcf8 \uacbd\ud5d8"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy"},"Proxy"),"\uc5d0 \ub300\ud55c \uc774\ud574 (optional)"))))}d.isMDXComponent=!0}}]);