"use strict";(self.webpackChunkhyunmoahn_github_io=self.webpackChunkhyunmoahn_github_io||[]).push([[8110],{3905:function(e,n,t){t.d(n,{Zo:function(){return u},kt:function(){return d}});var a=t(7294);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function r(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,a,o=function(e,n){if(null==e)return{};var t,a,o={},i=Object.keys(e);for(a=0;a<i.length;a++)t=i[a],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)t=i[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var l=a.createContext({}),c=function(e){var n=a.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):r(r({},n),e)),t},u=function(e){var n=c(e.components);return a.createElement(l.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},h=a.forwardRef((function(e,n){var t=e.components,o=e.mdxType,i=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),h=c(t),d=o,k=h["".concat(l,".").concat(d)]||h[d]||p[d]||i;return t?a.createElement(k,r(r({ref:n},u),{},{components:t})):a.createElement(k,r({ref:n},u))}));function d(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var i=t.length,r=new Array(i);r[0]=h;var s={};for(var l in n)hasOwnProperty.call(n,l)&&(s[l]=n[l]);s.originalType=e,s.mdxType="string"==typeof e?e:o,r[1]=s;for(var c=2;c<i;c++)r[c]=t[c];return a.createElement.apply(null,r)}return a.createElement.apply(null,t)}h.displayName="MDXCreateElement"},4837:function(e,n,t){t.r(n),t.d(n,{assets:function(){return u},contentTitle:function(){return l},default:function(){return d},frontMatter:function(){return s},metadata:function(){return c},toc:function(){return p}});var a=t(3117),o=t(102),i=(t(7294),t(3905)),r=["components"],s={slug:"how-to-cancel-at-axios",title:"How to cancel at axios",description:"The article that how to use cancel logic on axios request.",keywords:["axios","javascript","HTTP","cancel","abort"],authors:"HyunmoAhn",tags:["axios","library","how-to-work","javascript","web"]},l=void 0,c={permalink:"/en/how-to-cancel-at-axios",source:"@site/i18n/en/docusaurus-plugin-content-blog/2021-09-17-how-to-cancel-at-axios.md",title:"How to cancel at axios",description:"The article that how to use cancel logic on axios request.",date:"2021-09-17T00:00:00.000Z",formattedDate:"September 17, 2021",tags:[{label:"axios",permalink:"/en/tags/axios"},{label:"library",permalink:"/en/tags/library"},{label:"how-to-work",permalink:"/en/tags/how-to-work"},{label:"javascript",permalink:"/en/tags/javascript"},{label:"web",permalink:"/en/tags/web"}],readingTime:6.295,hasTruncateMarker:!0,authors:[{name:"Hyunmo Ahn",title:"Front End Engineer @ Line Biz+",url:"https://github.com/HyunmoAhn",imageURL:"https://github.com/HyunmoAhn.png",key:"HyunmoAhn"}],frontMatter:{slug:"how-to-cancel-at-axios",title:"How to cancel at axios",description:"The article that how to use cancel logic on axios request.",keywords:["axios","javascript","HTTP","cancel","abort"],authors:"HyunmoAhn",tags:["axios","library","how-to-work","javascript","web"]},prevItem:{title:"how to time travel debugging at redux-devtools",permalink:"/en/how-to-time-travel-debugging-at-redux-devtools"}},u={authorsImageUrls:[void 0]},p=[{value:"Purpose",id:"purpose",level:2},{value:"Usage",id:"usage",level:2},{value:"Simple Usage",id:"simple-usage",level:3},{value:"Advanced Usage",id:"advanced-usage",level:3},{value:"Inner Axios",id:"inner-axios",level:2},{value:"What about CancelToken",id:"what-about-canceltoken",level:3},{value:"Recap about CancelToken",id:"recap-about-canceltoken",level:4},{value:"Where do use CancelToken.promise?",id:"where-do-use-canceltokenpromise",level:3},{value:"Recap",id:"recap",level:2},{value:"Appendix",id:"appendix",level:2},{value:"What happens to cancelToken that have already been canceled?",id:"what-happens-to-canceltoken-that-have-already-been-canceled",level:3},{value:"Reference",id:"reference",level:2}],h={toc:p};function d(e){var n=e.components,t=(0,o.Z)(e,r);return(0,i.kt)("wrapper",(0,a.Z)({},h,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("h2",{id:"purpose"},"Purpose"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/axios/axios"},"axios")," support feature to cancel HTTP Request.\nWe will investigate that how to work about axios cancel logic."),(0,i.kt)("admonition",{title:"Prerequisites",type:"info"},(0,i.kt)("ul",{parentName:"admonition"},(0,i.kt)("li",{parentName:"ul"},"A rough knowledge about HTTP Request"),(0,i.kt)("li",{parentName:"ul"},"The usage about ",(0,i.kt)("a",{parentName:"li",href:"https://github.com/axios/axios"},"Axios")," library"))),(0,i.kt)("h2",{id:"usage"},"Usage"),(0,i.kt)("p",null,"Before to know that how to work about cancel, We will check that how to use axios cancel."),(0,i.kt)("h3",{id:"simple-usage"},"Simple Usage"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx"},"import axios from 'axios';\n\n// Make CancelToken\nconst CancelToken = axios.CancelToken;\nconst source = CancelToken.source();\n\n// Register Cancel\naxios\n  .get('/url', { cancelToken: source.token })\n  .catch((e) => {\n    if (axios.isCancel(e)) { /* cancel logic */ }\n  })\n\n// Create Cancel\nsource.cancel('message');\n")),(0,i.kt)("p",null,"If you want to cancel in axios, we need to make ",(0,i.kt)("inlineCode",{parentName:"p"},"CancelToken"),". ",(0,i.kt)("br",null),"\nEach time axios is requested, ",(0,i.kt)("inlineCode",{parentName:"p"},"cancelToken")," is injected and the axios is canceled through ",(0,i.kt)("inlineCode",{parentName:"p"},"source.cancel"),"."),(0,i.kt)("h3",{id:"advanced-usage"},"Advanced Usage"),(0,i.kt)("p",null,"If we request multiple axios same time, what action would cancel show?"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx"},"import axios from 'axios';\n\n// Make CancelToken\nconst CancelToken = axios.CancelToken;\nconst source = CancelToken.source();\n\n// Register Cancel\naxios\n  .get('/url/first', { cancelToken: source.token })\n  .catch((e) => {\n    if (e.code === '403') { // session expired \n      source.cancel('session expired');\n    } \n  })\n\n// Register Cancel\naxios\n  .get('/url/second', { cancelToken: source.token })\n  .catch((e) => {\n    if (axios.isCancel(e)) { /* cancel logic */ }\n  })\n")),(0,i.kt)("p",null,"The scenario to be assumed when two axios requests are sent at the same time as above is as follows."),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"/url/first")," response is faster than ",(0,i.kt)("inlineCode",{parentName:"li"},"/url/second")," response."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"/url/first")," will get 403 session expired error code.")),(0,i.kt)("p",null,"Then how will the response of ",(0,i.kt)("inlineCode",{parentName:"p"},"/url/second")," be handled?"),(0,i.kt)("p",null,"The answer is that at the time of cancel in ",(0,i.kt)("inlineCode",{parentName:"p"},"/url/first"),", the request for ",(0,i.kt)("inlineCode",{parentName:"p"},"/url/second")," also becomes cancel."),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"This article starts with curiosity about how cancel in ",(0,i.kt)("inlineCode",{parentName:"strong"},"/url/first")," axios affects ",(0,i.kt)("inlineCode",{parentName:"strong"},"/url/second")," axios?")," "),(0,i.kt)("admonition",{title:"Question",type:"caution"},(0,i.kt)("p",{parentName:"admonition"},"Q1. If cancelToken is canceled in one axios request, why others axios request are also canceled?")),(0,i.kt)("h2",{id:"inner-axios"},"Inner Axios"),(0,i.kt)("h3",{id:"what-about-canceltoken"},"What about CancelToken"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/axios/axios/blob/v0.21.1/lib/axios.js#L40-L42"},"axios")," has method associated with Cancel."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx"},"// https://github.com/axios/axios/blob/v0.21.1/lib/axios.js#L40-L42\n// Expose Cancel & CancelToken\naxios.Cancel = require('./cancel/Cancel');\naxios.CancelToken = require('./cancel/CancelToken');\naxios.isCancel = require('./cancel/isCancel');\n")),(0,i.kt)("p",null,"The preceding work to cancel axios was that create ",(0,i.kt)("inlineCode",{parentName:"p"},"CancelToken"),".\nSo, We will watch ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/axios/axios/blob/v0.21.1/lib/cancel/CancelToken.js"},"axios.CancelToken")," first. Because we created token to use ",(0,i.kt)("inlineCode",{parentName:"p"},"CancelToken.source"),". "),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx"},"// https://github.com/axios/axios/blob/v0.21.1/lib/cancel/CancelToken.js\nCancelToken.source = function source() {\n  var cancel;\n  var token = new CancelToken(function executor(c) {\n    cancel = c;\n  });\n  return {\n    token: token,\n    cancel: cancel\n  };\n};\n")),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"source")," is simple. It returns the object that has ",(0,i.kt)("inlineCode",{parentName:"p"},"token")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"cancel")," and creates ",(0,i.kt)("inlineCode",{parentName:"p"},"CancelToken")," internally."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx"},"// https://github.com/axios/axios/blob/v0.21.1/lib/cancel/CancelToken.js\nfunction CancelToken(executor) {\n  var resolvePromise;\n  this.promise = new Promise(function promiseExecutor(resolve) {\n    resolvePromise = resolve;\n  });\n\n  var token = this;\n  executor(function cancel(message) {\n    token.reason = new Cancel(message); // https://github.com/axios/axios/blob/v0.21.1/lib/cancel/Cancel.js\n    resolvePromise(token.reason);\n  });\n}\n")),(0,i.kt)("p",null,"To watch about ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/axios/axios/blob/v0.21.1/lib/cancel/CancelToken.js"},"CancelToken"),", It seems complicated about structure. It has two roles."),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},"Creates promise in ",(0,i.kt)("inlineCode",{parentName:"li"},"CancelToken"),". We can't know how to use this promise yet."),(0,i.kt)("li",{parentName:"ol"},"Assigns ",(0,i.kt)("inlineCode",{parentName:"li"},"function cancel")," to cancel in ",(0,i.kt)("inlineCode",{parentName:"li"},"CancelToken.source")," scope. Through this, cancel is connected to the outside of the scope.")),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"CancelToken")," make two function that promise and cancel function and when ",(0,i.kt)("inlineCode",{parentName:"p"},"cancel")," is called ",(0,i.kt)("inlineCode",{parentName:"p"},"promise")," is resolved.\n",(0,i.kt)("inlineCode",{parentName:"p"},"cancel")," is expanded to ",(0,i.kt)("inlineCode",{parentName:"p"},"CancelToken.source")," scope by ",(0,i.kt)("inlineCode",{parentName:"p"},"executor")," and it will be method to use outside."),(0,i.kt)("h4",{id:"recap-about-canceltoken"},"Recap about CancelToken"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"CancelToken is made by ",(0,i.kt)("inlineCode",{parentName:"li"},"CancelToken.source"),", it will create promise and cancel function."),(0,i.kt)("li",{parentName:"ul"},"The generated ",(0,i.kt)("inlineCode",{parentName:"li"},"cancel")," here is transferred as a ",(0,i.kt)("inlineCode",{parentName:"li"},"CancelToken.source")," return value and used as an external usable function. We can't know the purpose of promise yet.")),(0,i.kt)("h3",{id:"where-do-use-canceltokenpromise"},"Where do use CancelToken.promise?"),(0,i.kt)("p",null,"axios uses ",(0,i.kt)("inlineCode",{parentName:"p"},"adapter")," in HTTP request internally and ",(0,i.kt)("inlineCode",{parentName:"p"},"adapter")," has code that associated with ",(0,i.kt)("inlineCode",{parentName:"p"},"CancelToken.promise"),"."),(0,i.kt)("p",null,"Among them, look at the code on the ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/axios/axios/blob/master/lib/adapters/xhr.js"},"xhr")," side."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx"},"// https://github.com/axios/axios/blob/master/lib/adapters/xhr.js#L22-L187\nvar request = new XMLHttpRequest();\n\nrequest.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);\nrequest.onreadystatechange = function handleLoad() {\n  // HTTP success logic \n};\nrequest.send(requestData);\n")),(0,i.kt)("p",null,"The basic work is same with logic of ",(0,i.kt)("a",{parentName:"p",href:"https://developer.mozilla.org/ko/docs/Web/API/XMLHttpRequest"},"XMLHttpRequest")," generally.\nIt connects url through ",(0,i.kt)("inlineCode",{parentName:"p"},"request.open"),", handles success flow through ",(0,i.kt)("inlineCode",{parentName:"p"},"onreadystatechange")," and sends HTTP requests through ",(0,i.kt)("inlineCode",{parentName:"p"},"request.send"),".\nUp to this point, it is the same as the ",(0,i.kt)("inlineCode",{parentName:"p"},"XMLHttpRequest")," in the callback method."),(0,i.kt)("p",null,"In addition to normal operation, xhr adapter of axios uses cancelToken to use one more promise logic."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx"},"// https://github.com/axios/axios/blob/master/lib/adapters/xhr.js#L168-L180\nif (config.cancelToken) {\n  // Handle cancellation\n  config.cancelToken.promise.then(function onCanceled(cancel) {\n    if (!request) {\n      return;\n    }\n\n    request.abort();\n    reject(cancel);\n    // Clean up request\n    request = null;\n  });\n} \n")),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"CancelToken.promise")," is used here. Every HTTP request uses cancelToken to call a promise.\n",(0,i.kt)("strong",{parentName:"p"},"In other words, as if using ",(0,i.kt)("inlineCode",{parentName:"strong"},"Promise.race"),", it is using logic that handles the first of the two requests of ",(0,i.kt)("inlineCode",{parentName:"strong"},"xhr")," and ",(0,i.kt)("inlineCode",{parentName:"strong"},"cancelToken.proimse"),".")),(0,i.kt)("p",null,"If ",(0,i.kt)("inlineCode",{parentName:"p"},"promise")," of cancelToken is resolved, ",(0,i.kt)("inlineCode",{parentName:"p"},"xhr")," request is aborted and ",(0,i.kt)("inlineCode",{parentName:"p"},"axios")," request is end with reject.\nIn this time, error object is ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/axios/axios/blob/v0.21.1/lib/cancel/Cancel.js"},"cancel")," Object."),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"cancelToken")," is injected when axios is called, multiple axios request can use same ",(0,i.kt)("inlineCode",{parentName:"p"},"cancelToken"),". So we can answer the first question we had. "),(0,i.kt)("admonition",{title:"Question & Answer",type:"tip"},(0,i.kt)("blockquote",{parentName:"admonition"},(0,i.kt)("p",{parentName:"blockquote"},"Q1. If cancelToken is canceled in one axios request, why others axios request are also canceled?")),(0,i.kt)("p",{parentName:"admonition"},"A1. axios receives cancelToken for every HTTP request, it enters a state of race with xhr requests and promise of cancelToken.\nIf cancelToken is resolved from another axios request, All axios requests injected with the same cancelToken are terminated with reject because promise is resolved."),(0,i.kt)("p",{parentName:"admonition"},"In the other words, if cancel occurs in one axios request, the remaining axios requests are also canceled because reject is being performed according to the progress state of cancelToken commonly used")),(0,i.kt)("h2",{id:"recap"},"Recap"),(0,i.kt)("p",null,"axios make race condition by generating not only HTTP requests but also promise associated with cancel. The cancel promise used in this process may be used in several axios requests. ",(0,i.kt)("br",null),"\nThe promise associated with cancel is created together when creating ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/axios/axios/blob/v0.21.1/lib/cancel/CancelToken.js"},"cancelToken")," and the ",(0,i.kt)("inlineCode",{parentName:"p"},"cancelToken")," also provides a function called ",(0,i.kt)("inlineCode",{parentName:"p"},"cancel")," that resolves the cancel promise.",(0,i.kt)("br",null),"\nIf ",(0,i.kt)("inlineCode",{parentName:"p"},"cancelToken.cancel")," is called, cancel promise is resolved and every axios requests that is using canceled ",(0,i.kt)("inlineCode",{parentName:"p"},"cancelToken")," are aborted and will return reject because cancel promise is associated race condition with HTTP request."),(0,i.kt)("h2",{id:"appendix"},"Appendix"),(0,i.kt)("p",null,"We checked how to process about axios cancel. In the next article, we will look at the questions encountered when using the axios cancel."),(0,i.kt)("h3",{id:"what-happens-to-canceltoken-that-have-already-been-canceled"},"What happens to cancelToken that have already been canceled?"),(0,i.kt)("p",null,"So far, we've learned how to behave when cancelToken is canceled. Then how to work about already canceled ",(0,i.kt)("inlineCode",{parentName:"p"},"cancelToken"),"? ",(0,i.kt)("br",null),"\nLet's take a look at ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/axios/axios/blob/v0.21.1/lib/cancel/CancelToken.js"},"CancelToken")," again, which we looked at above.\nWhen the cancel occurs, ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/axios/axios/blob/v0.21.1/lib/cancel/Cancel.js"},"Cancel")," is assigned in ",(0,i.kt)("inlineCode",{parentName:"p"},"CancelToken.reason"),". This reason is used to determine whether there is a cancel."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx"},"// https://github.com/axios/axios/blob/v0.21.1/lib/cancel/CancelToken.js\nfunction CancelToken(executor) {\n  var resolvePromise;\n  this.promise = new Promise(function promiseExecutor(resolve) {\n    resolvePromise = resolve;\n  });\n\n  var token = this;\n  executor(function cancel(message) {\n    token.reason = new Cancel(message); // https://github.com/axios/axios/blob/v0.21.1/lib/cancel/Cancel.js\n    resolvePromise(token.reason);\n  });\n}\n")),(0,i.kt)("p",null,"CancelToken has another method to check cancel. It is ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/axios/axios/blob/v0.21.1/lib/cancel/CancelToken.js#L36-L40"},"CancelToken.throwIfRequested"),"."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx"},"CancelToken.prototype.throwIfRequested = function throwIfRequested() {\n  if (this.reason) {\n    throw this.reason;\n  }\n};\n")),(0,i.kt)("p",null,"It check it has reason, If it has reason it decide that this is canceled token and throw it."),(0,i.kt)("p",null,"This ",(0,i.kt)("inlineCode",{parentName:"p"},"throwIfRequested")," is showed several location in axios request. It is presumed that these measures have been taken because cancels may occur in various cases.  "),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx"},"// https://github.com/axios/axios/blob/v0.21.1/lib/core/dispatchRequest.js\nfunction throwIfCancellationRequested(config) {\n  if (config.cancelToken) {\n    config.cancelToken.throwIfRequested();\n  }\n}\n\nmodule.exports = function dispatchRequest(config) {\n  throwIfCancellationRequested(config);\n  ...\n\n  return adapter(config).then(function onAdapterResolution(response) {\n    throwIfCancellationRequested(config);\n    ...\n  }\n}\n")),(0,i.kt)("p",null,"Therefore, once canceled ",(0,i.kt)("inlineCode",{parentName:"p"},"cancelToken")," is implemented to automatically reject upon request from axios.\nIn order to normalize the axios request again after cancel,\nthe ",(0,i.kt)("inlineCode",{parentName:"p"},"cancelToken")," must be abandoned and a new ",(0,i.kt)("inlineCode",{parentName:"p"},"cancelToken")," must be created to call the axios so that the axios request will not stop and make a normal call."),(0,i.kt)("h2",{id:"reference"},"Reference"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/axios/axios/tree/v0.21.1"},"axios github")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://axios-http.com/docs/cancellation"},"axios cancellation docs"))))}d.isMDXComponent=!0}}]);