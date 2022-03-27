"use strict";(self.webpackChunkhyunmoahn_github_io=self.webpackChunkhyunmoahn_github_io||[]).push([[6667],{3905:function(e,t,n){n.d(t,{Zo:function(){return s},kt:function(){return c}});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function m(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=a.createContext({}),p=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},s=function(e){var t=p(e.components);return a.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,l=e.parentName,s=m(e,["components","mdxType","originalType","parentName"]),d=p(n),c=r,h=d["".concat(l,".").concat(c)]||d[c]||u[c]||i;return n?a.createElement(h,o(o({ref:t},s),{},{components:n})):a.createElement(h,o({ref:t},s))}));function c(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,o=new Array(i);o[0]=d;var m={};for(var l in t)hasOwnProperty.call(t,l)&&(m[l]=t[l]);m.originalType=e,m.mdxType="string"==typeof e?e:r,o[1]=m;for(var p=2;p<i;p++)o[p]=n[p];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},1:function(e,t,n){n.r(t),n.d(t,{assets:function(){return s},contentTitle:function(){return l},default:function(){return c},frontMatter:function(){return m},metadata:function(){return p},toc:function(){return u}});var a=n(3117),r=n(102),i=(n(7294),n(3905)),o=["components"],m={slug:"deep-dive-to-immer",title:"immer \ub0b4\ubd80 \uc0b4\ud3b4\ubcf4\uae30",description:"redux\uc5d0\uc11c \uc8fc\ub85c \uc0ac\uc6a9\ub418\ub294 immer\ub294 mutable\ud55c \uac1d\uccb4 \uc5c5\ub370\uc774\ud2b8\ub97c immutable\ud558\uac8c \uc0ac\uc6a9\ud558\ub294 \uac83 \ucc98\ub7fc \ub3c4\uc640\uc900\ub2e4. \uc5b4\ub5bb\uac8c \uc774\ub7f0 \ub85c\uc9c1\uc774 \uac00\ub2a5\ud55c\uac78\uae4c?",keywords:["redux","redux-toolkit","immer","immutable","javascript","deep-dive","how-to-work","web"],authors:"HyunmoAhn",tags:["redux","redux-toolkit","immer","library","how-to-work","deep-dive","javascript","web","immutable"]},l=void 0,p={permalink:"/deep-dive-to-immer",source:"@site/blog/2021-10-23-deep-dive-to-immer.md",title:"immer \ub0b4\ubd80 \uc0b4\ud3b4\ubcf4\uae30",description:"redux\uc5d0\uc11c \uc8fc\ub85c \uc0ac\uc6a9\ub418\ub294 immer\ub294 mutable\ud55c \uac1d\uccb4 \uc5c5\ub370\uc774\ud2b8\ub97c immutable\ud558\uac8c \uc0ac\uc6a9\ud558\ub294 \uac83 \ucc98\ub7fc \ub3c4\uc640\uc900\ub2e4. \uc5b4\ub5bb\uac8c \uc774\ub7f0 \ub85c\uc9c1\uc774 \uac00\ub2a5\ud55c\uac78\uae4c?",date:"2021-10-23T00:00:00.000Z",formattedDate:"2021\ub144 10\uc6d4 23\uc77c",tags:[{label:"redux",permalink:"/tags/redux"},{label:"redux-toolkit",permalink:"/tags/redux-toolkit"},{label:"immer",permalink:"/tags/immer"},{label:"library",permalink:"/tags/library"},{label:"how-to-work",permalink:"/tags/how-to-work"},{label:"deep-dive",permalink:"/tags/deep-dive"},{label:"javascript",permalink:"/tags/javascript"},{label:"web",permalink:"/tags/web"},{label:"immutable",permalink:"/tags/immutable"}],readingTime:44.83,truncated:!0,authors:[{name:"Hyunmo Ahn",title:"Front End Engineer @ Line Financial+",url:"https://github.com/HyunmoAhn",imageURL:"https://github.com/HyunmoAhn.png",key:"HyunmoAhn"}],frontMatter:{slug:"deep-dive-to-immer",title:"immer \ub0b4\ubd80 \uc0b4\ud3b4\ubcf4\uae30",description:"redux\uc5d0\uc11c \uc8fc\ub85c \uc0ac\uc6a9\ub418\ub294 immer\ub294 mutable\ud55c \uac1d\uccb4 \uc5c5\ub370\uc774\ud2b8\ub97c immutable\ud558\uac8c \uc0ac\uc6a9\ud558\ub294 \uac83 \ucc98\ub7fc \ub3c4\uc640\uc900\ub2e4. \uc5b4\ub5bb\uac8c \uc774\ub7f0 \ub85c\uc9c1\uc774 \uac00\ub2a5\ud55c\uac78\uae4c?",keywords:["redux","redux-toolkit","immer","immutable","javascript","deep-dive","how-to-work","web"],authors:"HyunmoAhn",tags:["redux","redux-toolkit","immer","library","how-to-work","deep-dive","javascript","web","immutable"]},prevItem:{title:"Front-end\uc5d0\uc11c OAS generator\ub97c \uc5b4\ub5bb\uac8c \uc4f0\uba74 \uc88b\uc744\uae4c?",permalink:"/how-to-use-oas-generator"},nextItem:{title:"redux-devtools\uc758 time-travel-debugging \ud1ba\uc544\ubcf4\uae30",permalink:"/how-to-time-travel-debugging-at-redux-devtools"}},s={authorsImageUrls:[void 0]},u=[{value:"\ubb34\uc5c7\uc774 \uad81\uae08\ud560\uae4c?",id:"\ubb34\uc5c7\uc774-\uad81\uae08\ud560\uae4c",level:2}],d={toc:u};function c(e){var t=e.components,n=(0,r.Z)(e,o);return(0,i.kt)("wrapper",(0,a.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"\uc774 \uae00\uc740 \uae30\ubcf8\uc801\uc73c\ub85c ",(0,i.kt)("a",{parentName:"p",href:"https://immerjs.github.io/immer/"},"immer"),"\uc5d0 \ub300\ud574\uc11c \uc54c\uc544\ubcf4\ub294 \uc2dc\uac04\uc744 \uac00\uc9c4\ub2e4. \ub9cc\uc57d immer\ub97c \uc798 \ubaa8\ub974\ub294 \ubd84\ub4e4\uc740 ",(0,i.kt)("a",{parentName:"p",href:"#immer%EB%8A%94-%EB%AC%B4%EC%97%87%EC%9D%B4%EA%B3%A0-%EC%99%9C-%EC%82%AC%EC%9A%A9%ED%95%98%EB%8A%94%EA%B1%B8%EA%B9%8C"},"\uc544\ub798 \ucc55\ud130"),"\ub97c \uba3c\uc800 \uc77d\uc5b4\ubcf4\ub294 \uac83\uc744 \uad8c\uc7a5\ud55c\ub2e4."),(0,i.kt)("h2",{id:"\ubb34\uc5c7\uc774-\uad81\uae08\ud560\uae4c"},"\ubb34\uc5c7\uc774 \uad81\uae08\ud560\uae4c?"),(0,i.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"Question")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"Q1. ",(0,i.kt)("inlineCode",{parentName:"p"},"immer"),"\ub294 \uac1d\uccb4 mutable\ud558\uac8c \ubc14\uafb8\ub294 \ubc29\uc2dd\uc744 \uc5b4\ub5bb\uac8c immutable\ud55c \ubc29\uc2dd\uc73c\ub85c \ubc14\uafb8\uc5b4\uc8fc\uace0 \uc788\uc744\uae4c? "))),(0,i.kt)("p",null,"immer\ub294 mutable\ud558\uac8c \ubcc0\uacbd\ud558\ub294 \uac1d\uccb4 built-in method\ub97c \uc0ac\uc6a9\ud558\ub354\ub77c\ub3c4 immutable\ud558\uac8c \ub370\uc774\ud130\ub97c \ubc18\ud658\ud574\uc8fc\ub294 \uae30\ub2a5\uc744 \ud55c\ub2e4. \uc774 \uae30\ub2a5\uc774 \ub0b4\ubd80\uc801\uc73c\ub85c \uc5b4\ub5a4 \ubc29\uc2dd\uc73c\ub85c \uc774\ub8e8\uc5b4\uc9c0\ub294\uc9c0 \uc54c\uc544\ubcf8\ub2e4."),(0,i.kt)("p",null,"\uc544\ub798 \ucf54\ub4dc \uc608\uc2dc\ub294 ",(0,i.kt)("a",{parentName:"p",href:"https://immerjs.github.io/immer/#a-quick-example-for-comparison"},"immer \uacf5\uc2dd \ubb38\uc11c"),"\uc5d0 \uc874\uc7ac\ud558\ub294 basic example\uc744 \uac00\uc838\uc628 \uac83\uc774\ub2e4."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx"},'import produce from \'immer\';\n\nconst baseState = [\n  { \n    title: "Learn TypeScript", \n    done: true,\n  },\n  { \n    title: "Try Immer", \n    done: false,\n  },\n]\n\nconst nextState = produce(baseState, (draft) => {\n  draft.push({ title: "Tweet about It" });\n  draft[1].done = true;\n})\n\nconsole.log(baseState === nextState) // false\nconsole.log(nextState)\n/*\n[\n  { \n    title: "Learn TypeScript", \n    done: true,\n  },\n  { \n    title: "Learn TypeScript", \n    done: true,\n  },\n  { \n    title: "Tweet about It",\n  },\n]\n*/\n')),(0,i.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"Question")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"Q2. ",(0,i.kt)("inlineCode",{parentName:"p"},"immer"),"\ub294 \uc5b4\ub5bb\uac8c structural sharing\uc744 \uc0ac\uc6a9\ud558\ub294\uac78\uae4c?"),(0,i.kt)("p",{parentName:"div"},"*",(0,i.kt)("inlineCode",{parentName:"p"},"structural sharing"),": \uac1d\uccb4\ub97c copy\ud560 \ub54c \ubcc0\uacbd\ub418\uc9c0 \uc54a\uc740 \uac1d\uccb4\ub294 reference\ub97c \ub3d9\uc77c\ud558\uac8c \uc0ac\uc6a9\ud558\ub294 \ubc29\uc2dd."))),(0,i.kt)("p",null,"\uac1d\uccb4\ub97c immutable\ud558\uac8c \uc5c5\ub370\uc774\ud2b8 \ud55c\ub2e4\ub294 \uac83\uc740 \uae30\uc874 \uac1d\uccb4\ub97c \uc0c8\ub85c\uc6b4 \uac1d\uccb4\ub85c \ubcf5\uc0ac\ud55c\ub2e4\ub294 \uac83\uc774\ub2e4. \uc989, \ubcf5\uc0ac\uc5d0 \ube44\uc6a9\uc774 \ubc1c\uc0dd\ud55c\ub2e4.\nimmer\ub294 \uac1d\uccb4\ub97c \ubcf5\uc0ac\ud560 \ub54c, \ubcc0\uacbd\ub418\uc9c0 \uc54a\uc740 reference\ub294 \uc7ac\uc0ac\uc6a9\ud558\ub294 structural sharing \ubc29\uc2dd\uc744 \uc0ac\uc6a9\ud574\uc11c \uac1d\uccb4\ub97c \ubcf5\uc0ac\ud55c\ub2e4.\nimmer\uc5d0\uc11c\ub294 \uc5b4\ub5a4\ubc29\uc2dd\uc744 \uc0ac\uc6a9\ud574\uc11c structural sharing\uc744 \uc0ac\uc6a9\ud558\uace0 \uc788\ub294\uc9c0 \uc54c\uc544\ubcf8\ub2e4."),(0,i.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"Question")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"Q3. immer\uc5d0\uc11c\ub294 produce\ud568\uc218 \ub0b4\uc5d0\uc11c draft\ub97c \uc9c1\uc811 \uc5c5\ub370\uc774\ud2b8\ud558\ub294 \ubc29\uc2dd\uc774 \uc544\ub2c8\ub77c return\uc744 \ud1b5\ud574\uc11c \ub370\uc774\ud130\ub97c \uc5c5\ub370\uc774\ud2b8\ud558\ub294 \uacbd\uc6b0\uac00 \uc788\ub294\ub370, \uc774\ub7f0 \uacbd\uc6b0\uc5d0 \ub85c\uc9c1\uc774 \ub2e4\ub978\uc9c0?"))),(0,i.kt)("p",null,"immer\ub97c \uc0ac\uc6a9\ud560 \ub54c, \uc704\uc5d0\uc11c \uc81c\uc2dc\ud55c mutable\ud55c \uac1d\uccb4 \ubcc0\uacbd \ubc29\uc2dd\uc774 \uc544\ub2cc, \uc0c8\ub85c\uc6b4 \uac1d\uccb4\ub97c \ub9ac\ud134\ud558\ub294 \uacbd\uc6b0\uac00 \uc788\ub2e4.\n\uc774\ub294 immer\uc640\ub294 \ubb34\uad00\ud558\uac8c immutable\ud558\uac8c Javascript\uc5d0\uc11c \uac1d\uccb4\ub97c \ubc18\ud658\ud574\uc8fc\ub294 \ubc29\uc2dd\uacfc \ub3d9\uc77c\ud558\ub2e4.\nimmer\uc5d0\uc11c\ub294 \uc774\ub7ec\ud55c \ubc29\uc2dd\uc744 ",(0,i.kt)("a",{parentName:"p",href:"https://immerjs.github.io/immer/return"},"\uacf5\uc2dd\uc801\uc73c\ub85c \ud5c8\uc6a9"),"\ud558\uace0 \uc788\uace0\n\ub450 \ubc29\uc2dd, mutable\ud558\uac8c \uac1d\uccb4\ub97c \ubcc0\uacbd\ud558\ub294 \ubc29\uc2dd\uacfc immutable\ud558\uac8c \uac1d\uccb4\ub97c \ubcc0\uacbd\uc2dc\ud0a4\ub294 \ubc29\uc2dd \ubaa8\ub450 \ud63c\uc6a9\ud574\uc11c \uc4f0\ub294 \uac1c\ubc1c\uc790\ub3c4 \ub9ce\uc744 \uac83 \uc774\ub2e4.\n\uc774\ub7ec\ud55c \ubc29\uc2dd \ucc28\uc774\ub294 immer\uc5d0\uc11c \uc5b4\ub5a4 \ub85c\uc9c1\ucc28\uc774\ub97c \ubc1c\uc0dd\uc2dc\ud0a4\ub294\uc9c0 \uc54c\uc544\ubcf8\ub2e4. "),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx"},'// mutable method\nconst nextState = produce(baseState, (draft) => {\n  draft.push({ title: "Tweet about It" });\n  draft[1].done = true;\n})\n\n// highlight-start\n// immutable method\nconst nextState = produce(baseState, (draft) => {\n  return {\n    ...baseState,\n    { ...baseState[1], done: true },\n    { title: "Tweet about It" },\n  }\n})\n// highlight-end\n')),(0,i.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"\uc0ac\uc804\uc9c0\uc2dd")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("ul",{parentName:"div"},(0,i.kt)("li",{parentName:"ul"},"immer \ud639\uc740 redux-toolkit\uc744 \uc0ac\uc6a9\ud574 \ubcf8 \uacbd\ud5d8"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy"},"Proxy"),"\uc5d0 \ub300\ud55c \uc774\ud574 (optional)")))))}c.isMDXComponent=!0}}]);