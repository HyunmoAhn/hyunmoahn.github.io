"use strict";(self.webpackChunkhyunmoahn_github_io=self.webpackChunkhyunmoahn_github_io||[]).push([[4650],{5358:(e,n,a)=>{a.d(n,{zD:()=>r,pe:()=>o,eY:()=>i,xX:()=>c,Vy:()=>s});const t="import { useEffect, useState } from 'react';\n\nexport const useAsyncData = () => {\n  const [data, setData] = useState([]);\n\n  useEffect(() => {\n    setTimeout(() => {\n      setData([1, 2, 3]);\n    }, 2000);\n  }, []);\n\n  return data;\n};\n",l="import { useRef, useEffect, useMemo } from 'react';\n\nexport function useCallbackRef(callback) {\n  const callbackRef = useRef(callback);\n\n  useEffect(() => {\n    callbackRef.current = callback;\n  });\n\n  return useMemo(\n    () =>\n      (...args) =>\n        callbackRef.current?.(...args),\n    [],\n  );\n}\n",r={"/App.js":"import { useEffect } from 'react';\nimport { useAsyncData } from './useAsyncData';\n\nexport default function App() {\n  const data = useAsyncData();\n  const handleCallback = () => {\n    console.log(`handle callback: ${new Date().toISOString()}`);\n  };\n\n  return (\n    <>\n      {data.map((item) => (\n        <li key={item}>{item}</li>\n      ))}\n      <ChildComponent onCallback={handleCallback} />\n    </>\n  );\n}\n\nconst ChildComponent = ({ onCallback }) => {\n  useEffect(() => {\n    onCallback();\n  }, [onCallback]);\n\n  return <>Child</>;\n};\n","/useAsyncData.js":t},o={"/App.js":"import { useEffect, useCallback } from 'react';\nimport { useAsyncData } from './useAsyncData';\n\nexport default function App() {\n  const data = useAsyncData();\n  const handleCallback = useCallback(() => {\n    console.log(`handle callback: ${new Date().toISOString()}`);\n  }, []);\n\n  return (\n    <>\n      {data.map((item) => (\n        <li key={item}>{item}</li>\n      ))}\n      <ChildComponent onCallback={handleCallback} />\n    </>\n  );\n}\n\nconst ChildComponent = ({ onCallback }) => {\n  useEffect(() => {\n    onCallback();\n  }, [onCallback]);\n\n  return <>Child</>;\n};\n","/useAsyncData.js":t},c={"/App.js":"import { useCallback, useEffect } from 'react';\nimport { useAsyncData } from './useAsyncData';\n\nexport default function App() {\n  const list = ['Hello', 'World'];\n  const data = useAsyncData();\n  const handleCallback = useCallback((index) => {\n    console.log(`handle callback: ${index}`);\n  }, []);\n\n  return (\n    <>\n      {list.map((item, index) => (\n        <ChildComponent key={index} onCallback={() => handleCallback(index)} />\n      ))}\n      {data.map((item) => (\n        <li key={item}>{item}</li>\n      ))}\n    </>\n  );\n}\n\nconst ChildComponent = ({ onCallback }) => {\n  useEffect(() => {\n    onCallback();\n  }, [onCallback]);\n\n  return <>Child</>;\n};\n","/useAsyncData.js":t},s={"/App.js":"import { useCallback, useEffect } from 'react';\nimport { useCallbackRef } from './useCallbackRef';\nimport { useAsyncData } from './useAsyncData';\n\nexport default function App() {\n  const list = ['Hello', 'World'];\n  const data = useAsyncData();\n  const handleCallback = useCallback((index) => {\n    console.log(`handle callback: ${index}`);\n  }, []);\n\n  return (\n    <>\n      {list.map((item, index) => (\n        <ChildComponent key={index} onCallback={() => handleCallback(index)} />\n      ))}\n      {data.map((item) => (\n        <li key={item}>{item}</li>\n      ))}\n    </>\n  );\n}\n\nconst ChildComponent = ({ onCallback }) => {\n  const handleCallback = useCallbackRef(onCallback);\n\n  useEffect(() => {\n    handleCallback();\n  }, [handleCallback]);\n\n  return <>Child</>;\n};\n","/useAsyncData.js":t,"/useCallbackRef.js":l},i={"/App.js":"import { useCallback, useEffect } from 'react';\nimport { useCallbackRef } from './useCallbackRef';\nimport { useAsyncData } from './useAsyncData';\n\nexport default function App() {\n  const data = useAsyncData();\n  const handleCallback = useCallback(() => {\n    if (data.length !== 0) {\n      console.log(`handle callback: ${data}`);\n    }\n  }, [data]);\n\n  return (\n    <>\n      {data.map((item) => (\n        <li key={item}>{item}</li>\n      ))}\n      <ChildComponent onCallback={handleCallback} />\n    </>\n  );\n}\n\nconst ChildComponent = ({ onCallback }) => {\n  const handleCallback = useCallbackRef(onCallback);\n\n  useEffect(() => {\n    handleCallback();\n  }, [handleCallback]);\n\n  return <>Child</>;\n};\n","/useAsyncData.js":t,"/useCallbackRef.js":l}},9288:(e,n,a)=>{a.d(n,{X:()=>w});var t=a(7294),l=a(6319),r=a(2949),o=a(362),c=a(1325),s=a(2297);const i=(0,o.ZP)(c.fC)``,u=o.ZP.div`
  display: flex;
  padding: 0 10px;
  border-bottom: 3px solid var(--ifm-color-emphasis-200);
`,p=(0,o.ZP)(c.aV)`
  flex: 1;
`,m=(0,o.ZP)(c.xz)`
  font-size: 1.1em;
  padding: 10px;

  color: var(--ifm-color-primary-darkest);
  background-color: transparent;
  border: none;

  &[data-state='active'] {
    color: var(--ifm-color-primary);
    font-weight: 500;
    border-bottom: 3px solid var(--ifm-color-primary);
  }
`,d=o.ZP.button`
  color: var(--ifm-color-emphasis-700);
  background-color: transparent;
  border: none;
`,f=(0,o.ZP)(c.VY)`
  display: none;
  height: 160px;
  overflow: scroll;

  &[data-state='active'] {
    display: block;
  }
`,b=e=>{let{defaultValue:n="result"}=e;const{refresh:a}=(0,l.xN)();return t.createElement(i,{defaultValue:n},t.createElement(u,null,t.createElement(p,null,t.createElement(m,{value:"result"},"Result"),t.createElement(m,{value:"console"},"Console")),t.createElement(d,{onClick:()=>a()},t.createElement(s.Z,{height:18,width:18}))),t.createElement(f,{value:"result",forceMount:!0},t.createElement(l.Gj,{showOpenInCodeSandbox:!1,showRefreshButton:!1})),t.createElement(f,{value:"console",forceMount:!0},t.createElement(l.Tq,{standalone:!0,resetOnPreviewRestart:!0})))};var k=a(4047),h=a(8814);const C=o.ZP.div`
  display: flex;
  gap: 10px;
  margin: 10px 14px;
`,y=o.ZP.div`
  flex: 1;
  font-size: 1.25em;

  align-self: center;

  color: var(--ifm-color-primary-dark);
`,g=o.iv`
  width: 24px;
  height: 24px;

  color: var(--ifm-color-emphasis-700);
  background-color: transparent;
  border: none;
`,x=o.ZP.button`
  ${g}
`,A=(0,o.ZP)(l.lc)`
  ${g}
`,E=e=>{let{title:n}=e;const{sandpack:a,dispatch:r}=(0,l.X3)();return t.createElement(C,null,t.createElement(y,null,n),t.createElement(x,{onClick:()=>{window.confirm("Reset All files")&&(a.resetAllFiles(),r({type:"refresh"}))}},t.createElement(k.Z,{height:16,width:16})),t.createElement(A,null,t.createElement(h.Z,{height:16,width:16})))},R=o.ZP.div`
  display: flex;
  flex-direction: column;

  border: 3px solid var(--ifm-color-emphasis-200);
  border-radius: 5px;
  height: 600px;

  margin-bottom: 30px;
`,v={"/index.js":{hidden:!0,code:'import React from "react";\nimport { createRoot } from "react-dom/client";\nimport "./styles.css";\nimport App from "./App";\nconst root = createRoot(document.getElementById("root"));\nroot.render(<App />);\n'}},w=e=>{let{files:n,title:a,strict:o=!1,defaultOutput:c}=e;const{colorMode:s}=(0,r.I)();return t.createElement(l.oT,{files:{...n,...!o&&v},theme:s,template:"react",options:{autorun:!0,autoReload:!0}},t.createElement(R,null,t.createElement(E,{title:a}),t.createElement(l._V,{style:{flex:7,overflow:"scroll"},showTabs:!0,showInlineErrors:!0,showLineNumbers:!0,wrapContent:!0}),t.createElement(b,{defaultValue:c})))}},6587:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>s,contentTitle:()=>o,default:()=>m,frontMatter:()=>r,metadata:()=>c,toc:()=>i});var t=a(3117),l=(a(7294),a(3905));a(9288),a(5358);const r={slug:"avoid-re-render-by-function-props",title:"callback function props\ub85c \uc778\ud55c re-render\ub97c \ud53c\ud558\ub294 \ubc95",description:"callback function\uc744 props\ub85c \uc8fc\uc785 \ud560 \ub54c \ubc1c\uc0dd \ud560 \uc218 \uc788\ub294 re-render\ub97c \ud53c\ud558\ub294 \ubc29\ubc95\uc744 \uc81c\uc2dc\ud55c\ub2e4.",keywords:["react","callback function","props","re-render","ref","web"],authors:"HyunmoAhn",tags:["react","callback function","web","props","re-render","ref"]},o=void 0,c={permalink:"/avoid-re-render-by-function-props",source:"@site/blog/2023-09-10-avoid-re-render-by-function-props.mdx",title:"callback function props\ub85c \uc778\ud55c re-render\ub97c \ud53c\ud558\ub294 \ubc95",description:"callback function\uc744 props\ub85c \uc8fc\uc785 \ud560 \ub54c \ubc1c\uc0dd \ud560 \uc218 \uc788\ub294 re-render\ub97c \ud53c\ud558\ub294 \ubc29\ubc95\uc744 \uc81c\uc2dc\ud55c\ub2e4.",date:"2023-09-10T00:00:00.000Z",formattedDate:"2023\ub144 9\uc6d4 10\uc77c",tags:[{label:"react",permalink:"/tags/react"},{label:"callback function",permalink:"/tags/callback-function"},{label:"web",permalink:"/tags/web"},{label:"props",permalink:"/tags/props"},{label:"re-render",permalink:"/tags/re-render"},{label:"ref",permalink:"/tags/ref"}],readingTime:10.55,hasTruncateMarker:!0,authors:[{name:"Hyunmo Ahn",title:"Front End Engineer @ Line Biz+",url:"https://github.com/HyunmoAhn",imageURL:"https://github.com/HyunmoAhn.png",key:"HyunmoAhn"}],frontMatter:{slug:"avoid-re-render-by-function-props",title:"callback function props\ub85c \uc778\ud55c re-render\ub97c \ud53c\ud558\ub294 \ubc95",description:"callback function\uc744 props\ub85c \uc8fc\uc785 \ud560 \ub54c \ubc1c\uc0dd \ud560 \uc218 \uc788\ub294 re-render\ub97c \ud53c\ud558\ub294 \ubc29\ubc95\uc744 \uc81c\uc2dc\ud55c\ub2e4.",keywords:["react","callback function","props","re-render","ref","web"],authors:"HyunmoAhn",tags:["react","callback function","web","props","re-render","ref"]},nextItem:{title:"i18n\uacfc typescript",permalink:"/i18n-and-typescript"}},s={authorsImageUrls:[void 0]},i=[],u={toc:i},p="wrapper";function m(e){let{components:n,...a}=e;return(0,l.kt)(p,(0,t.Z)({},u,a,{components:n,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"React\ub97c \uc0ac\uc6a9\ud558\ub2e4 \ubcf4\uba74 function\uc744 component props\ub85c \ub118\uae38 \ub54c re-render\ub97c \ud53c\ud558\uae30 \uc704\ud574 reference \uad00\ub9ac\uc5d0 \uc8fc\uc758\ud574\uc57c \ud55c\ub2e4.\n\ub300\ubd80\ubd84 ",(0,l.kt)("inlineCode",{parentName:"p"},"useCallback"),"\uc744 \uc0ac\uc6a9\ud574\uc11c \ubd88\ud544\uc694\ud55c re-render\ub97c \ud53c\ud558\uac8c \ub418\uc9c0\ub9cc \uc88b\uc740 \ub300\uc548\uc744 \ubc1c\uacac\ud558\uac8c \ub418\uc5b4\n\uc774 \uae00\uc744 \uc4f0\uac8c \ub418\uc5c8\ub2e4."),(0,l.kt)("p",null,"\uc601\uac10\uc744 \ubc1b\uc740 \ucf54\ub4dc\ub294 ",(0,l.kt)("a",{parentName:"p",href:"https://github.com/radix-ui/primitives"},"radix-ui/primitives")," \uc758 ",(0,l.kt)("a",{parentName:"p",href:"https://github.com/radix-ui/primitives/blob/main/packages/react/use-callback-ref/src/useCallbackRef.tsx"},"useCallbackRef")," \uc774\uba70\n\uc774 \uae00\uc5d0\uc11c\ub294 ",(0,l.kt)("inlineCode",{parentName:"p"},"useCallbackRef"),"\ub97c \uc4f0\ub294 \ucf00\uc774\uc2a4\uc640 \ub3d9\uc791\uc744 \uc774\uc57c\uae30 \ud560 \uc608\uc815\uc774\ub2e4."),(0,l.kt)("p",null,"\uc544\ub798\uc758 \ucf54\ub4dc\ub294 \uc55e\uc73c\ub85c \uc124\uba85 \ud560 ",(0,l.kt)("inlineCode",{parentName:"p"},"useCallbackRef")," \ucf54\ub4dc\uc774\ub2e4.\n\uacfc\uc5f0 \uc5b4\ub5a4 \uc0c1\ud669\uc5d0\uc11c \uc0ac\uc6a9 \ud560 \uac83 \uac19\uc740\uac00?"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-tsx"},"// useCallbackRef.js\nimport { useRef, useEffect, useMemo } from 'react';\n\nexport function useCallbackRef(callback) {\n  const callbackRef = useRef(callback);\n\n  useEffect(() => {\n    callbackRef.current = callback;\n  });\n\n  return useMemo(() => ((...args) => callbackRef.current?.(...args)), []);\n}\n")))}m.isMDXComponent=!0}}]);