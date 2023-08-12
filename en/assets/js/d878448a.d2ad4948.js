"use strict";(self.webpackChunkhyunmoahn_github_io=self.webpackChunkhyunmoahn_github_io||[]).push([[907],{3905:(e,t,n)=>{n.d(t,{Zo:()=>s,kt:()=>h});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function m(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),u=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},s=function(e){var t=u(e.components);return r.createElement(l.Provider,{value:t},e.children)},p="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},c=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,l=e.parentName,s=m(e,["components","mdxType","originalType","parentName"]),p=u(n),c=a,h=p["".concat(l,".").concat(c)]||p[c]||d[c]||i;return n?r.createElement(h,o(o({ref:t},s),{},{components:n})):r.createElement(h,o({ref:t},s))}));function h(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=c;var m={};for(var l in t)hasOwnProperty.call(t,l)&&(m[l]=t[l]);m.originalType=e,m[p]="string"==typeof e?e:a,o[1]=m;for(var u=2;u<i;u++)o[u]=n[u];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}c.displayName="MDXCreateElement"},9356:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>d,frontMatter:()=>i,metadata:()=>m,toc:()=>u});var r=n(7462),a=(n(7294),n(3905));const i={slug:"deep-dive-to-immer",title:"Deep dive to immer",description:"immer, usually used by redux, help us to update mutable object like using immutably. How can it do this? Lets deep dive to immer.",keywords:["redux","redux-toolkit","immer","immutable","javascript","deep-dive","how-to-work","web"],authors:"HyunmoAhn",tags:["redux","redux-toolkit","immer","library","how-to-work","deep-dive","javascript","web","immutable"]},o=void 0,m={permalink:"/en/deep-dive-to-immer",source:"@site/i18n/en/docusaurus-plugin-content-blog/2021-10-23-deep-dive-to-immer.md",title:"Deep dive to immer",description:"immer, usually used by redux, help us to update mutable object like using immutably. How can it do this? Lets deep dive to immer.",date:"2021-10-23T00:00:00.000Z",formattedDate:"October 23, 2021",tags:[{label:"redux",permalink:"/en/tags/redux"},{label:"redux-toolkit",permalink:"/en/tags/redux-toolkit"},{label:"immer",permalink:"/en/tags/immer"},{label:"library",permalink:"/en/tags/library"},{label:"how-to-work",permalink:"/en/tags/how-to-work"},{label:"deep-dive",permalink:"/en/tags/deep-dive"},{label:"javascript",permalink:"/en/tags/javascript"},{label:"web",permalink:"/en/tags/web"},{label:"immutable",permalink:"/en/tags/immutable"}],readingTime:26.85,hasTruncateMarker:!0,authors:[{name:"Hyunmo Ahn",title:"Front End Engineer @ Line Biz+",url:"https://github.com/HyunmoAhn",imageURL:"https://github.com/HyunmoAhn.png",key:"HyunmoAhn"}],frontMatter:{slug:"deep-dive-to-immer",title:"Deep dive to immer",description:"immer, usually used by redux, help us to update mutable object like using immutably. How can it do this? Lets deep dive to immer.",keywords:["redux","redux-toolkit","immer","immutable","javascript","deep-dive","how-to-work","web"],authors:"HyunmoAhn",tags:["redux","redux-toolkit","immer","library","how-to-work","deep-dive","javascript","web","immutable"]},prevItem:{title:"How to use OAS generator in Front-end environment?",permalink:"/en/how-to-use-oas-generator"},nextItem:{title:"how to time travel debugging at redux-devtools",permalink:"/en/how-to-time-travel-debugging-at-redux-devtools"}},l={authorsImageUrls:[void 0]},u=[{value:"What is my curious?",id:"what-is-my-curious",level:2}],s={toc:u},p="wrapper";function d(e){let{components:t,...n}=e;return(0,a.kt)(p,(0,r.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"This article basically takes time to learn about immer ",(0,a.kt)("a",{parentName:"p",href:"https://immerjs.github.io/immer/"},"immer"),".\nIf you don't know immer, I recommend reading ",(0,a.kt)("a",{parentName:"p",href:"#what-is-immer-and-why"},"next chapter")," first."),(0,a.kt)("h2",{id:"what-is-my-curious"},"What is my curious?"),(0,a.kt)("admonition",{title:"Question",type:"tip"},(0,a.kt)("p",{parentName:"admonition"},"Q1. How does ",(0,a.kt)("inlineCode",{parentName:"p"},"immer")," change the mutable update way to immutable update way?")),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"immer")," functions to return data immutably even when using the object built-in method that changes to be mutable.\nLet's find out how this function works internally."),(0,a.kt)("p",null,"This example is following basic example of ",(0,a.kt)("a",{parentName:"p",href:"https://immerjs.github.io/immer/#a-quick-example-for-comparison"},"immer official docs")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},'import produce from \'immer\';\n\nconst baseState = [\n  { \n    title: "Learn TypeScript", \n    done: true,\n  },\n  { \n    title: "Try Immer", \n    done: false,\n  },\n]\n\nconst nextState = produce(baseState, (draft) => {\n  draft.push({ title: "Tweet about It" });\n  draft[1].done = true;\n})\n\nconsole.log(baseState === nextState) // false\nconsole.log(nextState)\n/*\n[\n  { \n    title: "Learn TypeScript", \n    done: true,\n  },\n  { \n    title: "Learn TypeScript", \n    done: true,\n  },\n  { \n    title: "Tweet about It",\n  },\n]\n*/\n')),(0,a.kt)("admonition",{title:"Question",type:"tip"},(0,a.kt)("p",{parentName:"admonition"},"Q2. How does ",(0,a.kt)("inlineCode",{parentName:"p"},"immer")," use ",(0,a.kt)("inlineCode",{parentName:"p"},"structural sharing"),"?"),(0,a.kt)("p",{parentName:"admonition"},"*",(0,a.kt)("inlineCode",{parentName:"p"},"structural sharing"),": When coping an object, the same reference is used for an object that has not been changed.")),(0,a.kt)("p",null,"To update object immutably means that original object is copied to new object. In other word, copy needs to cost.\nWhen ",(0,a.kt)("inlineCode",{parentName:"p"},"immer")," copy object, the unchanged reference copies the object using the structural sharing method that is reused.\nLet's find out what kind of structural sharing is used in ",(0,a.kt)("inlineCode",{parentName:"p"},"immer"),"."),(0,a.kt)("admonition",{title:"Question",type:"tip"},(0,a.kt)("p",{parentName:"admonition"},"Q3. ",(0,a.kt)("inlineCode",{parentName:"p"},"immer")," sometimes updates data through return rather than mutable updating the draft within ",(0,a.kt)("inlineCode",{parentName:"p"},"produce")," function,\nin which case the logic is different?")),(0,a.kt)("p",null,"When using an ",(0,a.kt)("inlineCode",{parentName:"p"},"immer"),", there is a case of returning a new object instead of the mutable update method suggested above.\nThis is same as the method of returning objects from javascript immutably regardless of the immer.\n",(0,a.kt)("inlineCode",{parentName:"p"},"immer")," ",(0,a.kt)("a",{parentName:"p",href:"https://immerjs.github.io/immer/return"},"officially is guiding")," this way and\nThere will be many developers who use both methods, the method of changing objects to be mutable and method of changing objects to be immutable.\nLet's see what logic differences these differences cause in the ",(0,a.kt)("inlineCode",{parentName:"p"},"immer"),"."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},'// mutable method\nconst nextState = produce(baseState, (draft) => {\n  draft.push({ title: "Tweet about It" });\n  draft[1].done = true;\n})\n\n// highlight-start\n// immutable method\nconst nextState = produce(baseState, (draft) => {\n  return {\n    ...baseState,\n    { ...baseState[1], done: true },\n    { title: "Tweet about It" },\n  }\n})\n// highlight-end\n')),(0,a.kt)("admonition",{title:"PREREQUISITES",type:"info"},(0,a.kt)("ul",{parentName:"admonition"},(0,a.kt)("li",{parentName:"ul"},"Experience using an ",(0,a.kt)("inlineCode",{parentName:"li"},"immer")," or ",(0,a.kt)("inlineCode",{parentName:"li"},"redux-toolkit")),(0,a.kt)("li",{parentName:"ul"},"Understanding of ",(0,a.kt)("a",{parentName:"li",href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy"},"Proxy")," (optional)"))))}d.isMDXComponent=!0}}]);