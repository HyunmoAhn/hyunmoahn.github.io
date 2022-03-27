"use strict";(self.webpackChunkhyunmoahn_github_io=self.webpackChunkhyunmoahn_github_io||[]).push([[3505],{3905:function(e,t,n){n.d(t,{Zo:function(){return d},kt:function(){return m}});var o=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},a=Object.keys(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var u=o.createContext({}),s=function(e){var t=o.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},d=function(e){var t=s(e.components);return o.createElement(u.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},c=o.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,u=e.parentName,d=l(e,["components","mdxType","originalType","parentName"]),c=s(n),m=r,h=c["".concat(u,".").concat(m)]||c[m]||p[m]||a;return n?o.createElement(h,i(i({ref:t},d),{},{components:n})):o.createElement(h,i({ref:t},d))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,i=new Array(a);i[0]=c;var l={};for(var u in t)hasOwnProperty.call(t,u)&&(l[u]=t[u]);l.originalType=e,l.mdxType="string"==typeof e?e:r,i[1]=l;for(var s=2;s<a;s++)i[s]=n[s];return o.createElement.apply(null,i)}return o.createElement.apply(null,n)}c.displayName="MDXCreateElement"},8405:function(e,t,n){n.r(t),n.d(t,{assets:function(){return d},contentTitle:function(){return u},default:function(){return m},frontMatter:function(){return l},metadata:function(){return s},toc:function(){return p}});var o=n(3117),r=n(102),a=(n(7294),n(3905)),i=["components"],l={slug:"how-to-time-travel-debugging-at-redux-devtools",title:"how to time travel debugging at redux-devtools",description:"We will check how to time travel debugging at redux-devtools.",keywords:["redux","redux-devtools","time-travel","javascript"],authors:"HyunmoAhn",tags:["redux","redux-devtools","time-travel","library","how-to-work","javascript","web"]},u=void 0,s={permalink:"/en/how-to-time-travel-debugging-at-redux-devtools",source:"@site/i18n/en/docusaurus-plugin-content-blog/2021-10-02-how-to-time-travel-debugging-at-redux-devtools.md",title:"how to time travel debugging at redux-devtools",description:"We will check how to time travel debugging at redux-devtools.",date:"2021-10-02T00:00:00.000Z",formattedDate:"October 2, 2021",tags:[{label:"redux",permalink:"/en/tags/redux"},{label:"redux-devtools",permalink:"/en/tags/redux-devtools"},{label:"time-travel",permalink:"/en/tags/time-travel"},{label:"library",permalink:"/en/tags/library"},{label:"how-to-work",permalink:"/en/tags/how-to-work"},{label:"javascript",permalink:"/en/tags/javascript"},{label:"web",permalink:"/en/tags/web"}],readingTime:24.005,truncated:!0,authors:[{name:"Hyunmo Ahn",title:"Front End Engineer @ Line Financial+",url:"https://github.com/HyunmoAhn",imageURL:"https://github.com/HyunmoAhn.png",key:"HyunmoAhn"}],frontMatter:{slug:"how-to-time-travel-debugging-at-redux-devtools",title:"how to time travel debugging at redux-devtools",description:"We will check how to time travel debugging at redux-devtools.",keywords:["redux","redux-devtools","time-travel","javascript"],authors:"HyunmoAhn",tags:["redux","redux-devtools","time-travel","library","how-to-work","javascript","web"]},prevItem:{title:"Deep dive to immer",permalink:"/en/deep-dive-to-immer"},nextItem:{title:"How to cancel at axios",permalink:"/en/how-to-cancel-at-axios"}},d={authorsImageUrls:[void 0]},p=[{value:"Purpose",id:"purpose",level:2}],c={toc:p};function m(e){var t=e.components,n=(0,r.Z)(e,i);return(0,a.kt)("wrapper",(0,o.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"purpose"},"Purpose"),(0,a.kt)("p",null,"If you used ",(0,a.kt)("a",{parentName:"p",href:"https://redux.js.org/"},"redux")," in web application devlopment, you may have experience to use time-travel debugging with ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/zalmoxisus/redux-devtools-extension"},"redux-devtools"),"."),(0,a.kt)("p",null,"If you have confused about what ",(0,a.kt)("inlineCode",{parentName:"p"},"redux-devtools")," is, please see below video."),(0,a.kt)("iframe",{style:{width:"100%",height:"100%"},src:"https://www.youtube.com/embed/VbPgAf3FUU8",title:"YouTube video player",frameBorder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",allowFullScreen:!0}),(0,a.kt)("p",null,"If you don't have any experience about ",(0,a.kt)("inlineCode",{parentName:"p"},"redux-devtools"),", I think it may be difficult to understand this article."),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"redux-devtools")," records the redux information(action, reducer state) of web applications using redux,\nrollback to the reducer at a specific point in time and can pretend that there was no specific action.\nHowever, It is not simple to try to implement similar actions inside web applictions without using ",(0,a.kt)("inlineCode",{parentName:"p"},"redux-devtools"),".\nFor example, If you press the A button, make as if The action that's been happening so far didn't happen\nor if you leave before pressing the Submit button, rollback all actions that occurred on the page."),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"redux-devtools")," is an easy to provide function with buttons, but I don't know how to implement it myself.\nHow does ",(0,a.kt)("inlineCode",{parentName:"p"},"redux-devtools")," make these things possible?"),(0,a.kt)("p",null,"In this article, we will check below three things."),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"How to ",(0,a.kt)("strong",{parentName:"li"},"log")," the actions and reducer called in ",(0,a.kt)("inlineCode",{parentName:"li"},"redux-devtools"),"."),(0,a.kt)("li",{parentName:"ul"},"How to ",(0,a.kt)("strong",{parentName:"li"},"jump")," to a point where specific action is dispatched in ",(0,a.kt)("inlineCode",{parentName:"li"},"redux-devtools"),"."),(0,a.kt)("li",{parentName:"ul"},"How to ",(0,a.kt)("strong",{parentName:"li"},"skip")," a specific action as if it did not work in ",(0,a.kt)("inlineCode",{parentName:"li"},"redux-devtools"))),(0,a.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,a.kt)("div",{parentName:"div",className:"admonition-heading"},(0,a.kt)("h5",{parentName:"div"},(0,a.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,a.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,a.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"PREREQUISITES")),(0,a.kt)("div",{parentName:"div",className:"admonition-content"},(0,a.kt)("ul",{parentName:"div"},(0,a.kt)("li",{parentName:"ul"},"The experience about ",(0,a.kt)("a",{parentName:"li",href:"https://github.com/zalmoxisus/redux-devtools-extension"},"redux-devtools")),(0,a.kt)("li",{parentName:"ul"},"The intelligence about ",(0,a.kt)("a",{parentName:"li",href:"https://redux.js.org/"},"redux")," enhancer")))),(0,a.kt)("div",{className:"admonition admonition-caution alert alert--warning"},(0,a.kt)("div",{parentName:"div",className:"admonition-heading"},(0,a.kt)("h5",{parentName:"div"},(0,a.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,a.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},(0,a.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"}))),"Caution")),(0,a.kt)("div",{parentName:"div",className:"admonition-content"},(0,a.kt)("ul",{parentName:"div"},(0,a.kt)("li",{parentName:"ul"},"This article doesn't include content of ",(0,a.kt)("inlineCode",{parentName:"li"},"browser extension")),(0,a.kt)("li",{parentName:"ul"},"This article will say about core of ",(0,a.kt)("inlineCode",{parentName:"li"},"redux-devtools")," and you can understand if you don't know about ",(0,a.kt)("inlineCode",{parentName:"li"},"browser extension"),(0,a.kt)("br",null)),(0,a.kt)("li",{parentName:"ul"},"If you want to know ",(0,a.kt)("inlineCode",{parentName:"li"},"browser extension"),", It may not fit the purpose of this article.")))))}m.isMDXComponent=!0}}]);