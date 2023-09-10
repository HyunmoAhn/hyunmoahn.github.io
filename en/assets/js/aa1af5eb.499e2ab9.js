"use strict";(self.webpackChunkhyunmoahn_github_io=self.webpackChunkhyunmoahn_github_io||[]).push([[2830],{5358:(e,n,a)=>{a.d(n,{zD:()=>o,pe:()=>r,eY:()=>i,xX:()=>c,Vy:()=>s});const t="import { useEffect, useState } from 'react';\n\nexport const useAsyncData = () => {\n  const [data, setData] = useState([]);\n\n  useEffect(() => {\n    setTimeout(() => {\n      setData([1, 2, 3]);\n    }, 2000);\n  }, []);\n\n  return data;\n};\n",l="import { useRef, useEffect, useMemo } from 'react';\n\nexport function useCallbackRef(callback) {\n  const callbackRef = useRef(callback);\n\n  useEffect(() => {\n    callbackRef.current = callback;\n  });\n\n  return useMemo(\n    () =>\n      (...args) =>\n        callbackRef.current?.(...args),\n    [],\n  );\n}\n",o={"/App.js":"import { useEffect } from 'react';\nimport { useAsyncData } from './useAsyncData';\n\nexport default function App() {\n  const data = useAsyncData();\n  const handleCallback = () => {\n    console.log(`handle callback: ${new Date().toISOString()}`);\n  };\n\n  return (\n    <>\n      {data.map((item) => (\n        <li key={item}>{item}</li>\n      ))}\n      <ChildComponent onCallback={handleCallback} />\n    </>\n  );\n}\n\nconst ChildComponent = ({ onCallback }) => {\n  useEffect(() => {\n    onCallback();\n  }, [onCallback]);\n\n  return <>Child</>;\n};\n","/useAsyncData.js":t},r={"/App.js":"import { useEffect, useCallback } from 'react';\nimport { useAsyncData } from './useAsyncData';\n\nexport default function App() {\n  const data = useAsyncData();\n  const handleCallback = useCallback(() => {\n    console.log(`handle callback: ${new Date().toISOString()}`);\n  }, []);\n\n  return (\n    <>\n      {data.map((item) => (\n        <li key={item}>{item}</li>\n      ))}\n      <ChildComponent onCallback={handleCallback} />\n    </>\n  );\n}\n\nconst ChildComponent = ({ onCallback }) => {\n  useEffect(() => {\n    onCallback();\n  }, [onCallback]);\n\n  return <>Child</>;\n};\n","/useAsyncData.js":t},c={"/App.js":"import { useCallback, useEffect } from 'react';\nimport { useAsyncData } from './useAsyncData';\n\nexport default function App() {\n  const list = ['Hello', 'World'];\n  const data = useAsyncData();\n  const handleCallback = useCallback((index) => {\n    console.log(`handle callback: ${index}`);\n  }, []);\n\n  return (\n    <>\n      {list.map((item, index) => (\n        <ChildComponent key={index} onCallback={() => handleCallback(index)} />\n      ))}\n      {data.map((item) => (\n        <li key={item}>{item}</li>\n      ))}\n    </>\n  );\n}\n\nconst ChildComponent = ({ onCallback }) => {\n  useEffect(() => {\n    onCallback();\n  }, [onCallback]);\n\n  return <>Child</>;\n};\n","/useAsyncData.js":t},s={"/App.js":"import { useCallback, useEffect } from 'react';\nimport { useCallbackRef } from './useCallbackRef';\nimport { useAsyncData } from './useAsyncData';\n\nexport default function App() {\n  const list = ['Hello', 'World'];\n  const data = useAsyncData();\n  const handleCallback = useCallback((index) => {\n    console.log(`handle callback: ${index}`);\n  }, []);\n\n  return (\n    <>\n      {list.map((item, index) => (\n        <ChildComponent key={index} onCallback={() => handleCallback(index)} />\n      ))}\n      {data.map((item) => (\n        <li key={item}>{item}</li>\n      ))}\n    </>\n  );\n}\n\nconst ChildComponent = ({ onCallback }) => {\n  const handleCallback = useCallbackRef(onCallback);\n\n  useEffect(() => {\n    handleCallback();\n  }, [handleCallback]);\n\n  return <>Child</>;\n};\n","/useAsyncData.js":t,"/useCallbackRef.js":l},i={"/App.js":"import { useCallback, useEffect } from 'react';\nimport { useCallbackRef } from './useCallbackRef';\nimport { useAsyncData } from './useAsyncData';\n\nexport default function App() {\n  const data = useAsyncData();\n  const handleCallback = useCallback(() => {\n    if (data.length !== 0) {\n      console.log(`handle callback: ${data}`);\n    }\n  }, [data]);\n\n  return (\n    <>\n      {data.map((item) => (\n        <li key={item}>{item}</li>\n      ))}\n      <ChildComponent onCallback={handleCallback} />\n    </>\n  );\n}\n\nconst ChildComponent = ({ onCallback }) => {\n  const handleCallback = useCallbackRef(onCallback);\n\n  useEffect(() => {\n    handleCallback();\n  }, [handleCallback]);\n\n  return <>Child</>;\n};\n","/useAsyncData.js":t,"/useCallbackRef.js":l}},9288:(e,n,a)=>{a.d(n,{X:()=>R});var t=a(7294),l=a(6319),o=a(2949),r=a(362),c=a(1325),s=a(2297);const i=(0,r.ZP)(c.fC)``,u=r.ZP.div`
  display: flex;
  padding: 0 10px;
  border-bottom: 3px solid var(--ifm-color-emphasis-200);
`,p=(0,r.ZP)(c.aV)`
  flex: 1;
`,d=(0,r.ZP)(c.xz)`
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
`,m=r.ZP.button`
  color: var(--ifm-color-emphasis-700);
  background-color: transparent;
  border: none;
`,f=(0,r.ZP)(c.VY)`
  display: none;
  height: 160px;
  overflow: scroll;

  &[data-state='active'] {
    display: block;
  }
`,b=e=>{let{defaultValue:n="result"}=e;const{refresh:a}=(0,l.xN)();return t.createElement(i,{defaultValue:n},t.createElement(u,null,t.createElement(p,null,t.createElement(d,{value:"result"},"Result"),t.createElement(d,{value:"console"},"Console")),t.createElement(m,{onClick:()=>a()},t.createElement(s.Z,{height:18,width:18}))),t.createElement(f,{value:"result",forceMount:!0},t.createElement(l.Gj,{showOpenInCodeSandbox:!1,showRefreshButton:!1})),t.createElement(f,{value:"console",forceMount:!0},t.createElement(l.Tq,{standalone:!0,resetOnPreviewRestart:!0})))};var k=a(4047),h=a(8814);const C=r.ZP.div`
  display: flex;
  gap: 10px;
  margin: 10px 14px;
`,g=r.ZP.div`
  flex: 1;
  font-size: 1.25em;

  align-self: center;

  color: var(--ifm-color-primary-dark);
`,y=r.iv`
  width: 24px;
  height: 24px;

  color: var(--ifm-color-emphasis-700);
  background-color: transparent;
  border: none;
`,x=r.ZP.button`
  ${y}
`,A=(0,r.ZP)(l.lc)`
  ${y}
`,v=e=>{let{title:n}=e;const{sandpack:a,dispatch:o}=(0,l.X3)();return t.createElement(C,null,t.createElement(g,null,n),t.createElement(x,{onClick:()=>{window.confirm("Reset All files")&&(a.resetAllFiles(),o({type:"refresh"}))}},t.createElement(k.Z,{height:16,width:16})),t.createElement(A,null,t.createElement(h.Z,{height:16,width:16})))},w=r.ZP.div`
  display: flex;
  flex-direction: column;

  border: 3px solid var(--ifm-color-emphasis-200);
  border-radius: 5px;
  height: 600px;

  margin-bottom: 30px;
`,E={"/index.js":{hidden:!0,code:'import React from "react";\nimport { createRoot } from "react-dom/client";\nimport "./styles.css";\nimport App from "./App";\nconst root = createRoot(document.getElementById("root"));\nroot.render(<App />);\n'}},R=e=>{let{files:n,title:a,strict:r=!1,defaultOutput:c}=e;const{colorMode:s}=(0,o.I)();return t.createElement(l.oT,{files:{...n,...!r&&E},theme:s,template:"react",options:{autorun:!0,autoReload:!0}},t.createElement(w,null,t.createElement(v,{title:a}),t.createElement(l._V,{style:{flex:7,overflow:"scroll"},showTabs:!0,showInlineErrors:!0,showLineNumbers:!0,wrapContent:!0}),t.createElement(b,{defaultValue:c})))}},5480:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>s,contentTitle:()=>r,default:()=>d,frontMatter:()=>o,metadata:()=>c,toc:()=>i});var t=a(3117),l=(a(7294),a(3905));a(9288),a(5358);const o={slug:"avoid-re-render-by-function-props",title:"How to Avoid Re-rendering Caused by Callback Function Props",description:"This article presents a method to avoid re-rendering that can occur when injecting a callback function as props.",keywords:["react","callback function","props","re-render","ref","web"],authors:"HyunmoAhn",tags:["react","callback function","web","props","re-render","ref"]},r=void 0,c={permalink:"/en/avoid-re-render-by-function-props",source:"@site/i18n/en/docusaurus-plugin-content-blog/2023-09-10-avoid-re-render-by-function-props.mdx",title:"How to Avoid Re-rendering Caused by Callback Function Props",description:"This article presents a method to avoid re-rendering that can occur when injecting a callback function as props.",date:"2023-09-10T00:00:00.000Z",formattedDate:"September 10, 2023",tags:[{label:"react",permalink:"/en/tags/react"},{label:"callback function",permalink:"/en/tags/callback-function"},{label:"web",permalink:"/en/tags/web"},{label:"props",permalink:"/en/tags/props"},{label:"re-render",permalink:"/en/tags/re-render"},{label:"ref",permalink:"/en/tags/ref"}],readingTime:6.53,hasTruncateMarker:!0,authors:[{name:"Hyunmo Ahn",title:"Front End Engineer @ Line Biz+",url:"https://github.com/HyunmoAhn",imageURL:"https://github.com/HyunmoAhn.png",key:"HyunmoAhn"}],frontMatter:{slug:"avoid-re-render-by-function-props",title:"How to Avoid Re-rendering Caused by Callback Function Props",description:"This article presents a method to avoid re-rendering that can occur when injecting a callback function as props.",keywords:["react","callback function","props","re-render","ref","web"],authors:"HyunmoAhn",tags:["react","callback function","web","props","re-render","ref"]},nextItem:{title:"i18n and typescript",permalink:"/en/i18n-and-typescript"}},s={authorsImageUrls:[void 0]},i=[],u={toc:i},p="wrapper";function d(e){let{components:n,...a}=e;return(0,l.kt)(p,(0,t.Z)({},u,a,{components:n,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"In React, when passing a function as component props, one needs to be careful with managing references\nto avoid unnecessary re-renders.\nAlthough most case we use ",(0,l.kt)("inlineCode",{parentName:"p"},"useCallback")," to prevent unnecessary re-renders, I found an alternative solution sharing."),(0,l.kt)("p",null,"The code that inspired this article is ",(0,l.kt)("a",{parentName:"p",href:"https://github.com/radix-ui/primitives"},"radix-ui/primitives"),"'s ",(0,l.kt)("a",{parentName:"p",href:"https://github.com/radix-ui/primitives/blob/main/packages/react/use-callback-ref/src/useCallbackRef.tsx"},"useCallbackRef"),".\nThis article will discuss the use cases and logic of ",(0,l.kt)("inlineCode",{parentName:"p"},"useCallbackRef"),"."),(0,l.kt)("p",null,"Below is the ",(0,l.kt)("inlineCode",{parentName:"p"},"useCallbackRef")," code we are going to discuss.\nCan you guess in what situations it might be used?"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-tsx"},"// useCallbackRef.js\nimport { useRef, useEffect, useMemo } from 'react';\n\nexport function useCallbackRef(callback) {\n  const callbackRef = useRef(callback);\n\n  useEffect(() => {\n    callbackRef.current = callback;\n  });\n\n  return useMemo(() => ((...args) => callbackRef.current?.(...args)), []);\n}\n")))}d.isMDXComponent=!0}}]);