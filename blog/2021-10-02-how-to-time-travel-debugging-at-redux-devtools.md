---
slug: how-to-time-travel-debugging-at-redux-devtools
title: redux-devtools의 time-travel-debugging 톺아보기
description: redux-devtools에서 사용하는 time-travel-debugging이 어떤 방식으로 동작하는지 확인해보는 시간을 가진다. 
keywords:
  - redux
  - redux-devtools
  - time-travel
  - javascript
authors: HyunmoAhn
tags: [redux, redux-devtools, time-travel, library, how-to-work, javascript, web]
---

## 목적
[redux](https://redux.js.org/)를 이용해서 웹 어플리케이션 개발을 진행해 본 사람이라면 [redux-devtools](https://github.com/zalmoxisus/redux-devtools-extension)를 이용해서 time-travel 디버깅을 사용해본 경험이 있을 것이다.

`redux-devtools`가 어떤 것인지 헷갈리시는 분이 있다면 아래 영상을 참고하기 바란다.
<iframe style={{ width: "100%", height: "315px" }} src="https://www.youtube.com/embed/VbPgAf3FUU8" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />

만약 `redux-devtools`를 사용해 본 경험이 없다면 이번 article을 이해하기 어려울 수 있다.

`redux-devtools`는 redux를 사용한 web application의 redux정보(action, reducer, state)를 **기록**하고, 특정 시점의 reducer로 **rollback**하고, 특정 action을 **없었던 일**로 할 수 있다.
하지만, `redux-devtools`를 사용하지 않고 web application 내부에 비슷한 동작을 구현을 하려 한다면 간단한 일이 아니다. 
예를들어, A버튼을 눌렀을 때 이제껏 발생시켰던 action을 없었던 일로 한다거나, Submit버튼을 누르기 전 이탈 한다면 해당 페이지에서 발생시켰던 모든 action을 rollback한다거나 하는 로직말이다.

`redux-devtools`는 버튼으로 손쉽게 제공하는 동작을 직접 로직을 구현한다고 하면 방법을 모르겠다. `redux-devtools`는 어떻게 이러한 일들을 가능하게 할까?

이 article에서는 
- `redux-devtools` 에서 호출되는 action과 reducer를 **logging**하는 방법.
- `redux-devtools` 에서 특정 action이 dispatch 된 시점으로 **jump**하는 방법.
- `redux-devtools` 에서 특정 action이 동작하지 않은 것 처럼 **skip**시키는 방법.  

에 대해서 확인해 볼 것 이다.

:::info 사전지식
- [redux-devtools](https://github.com/zalmoxisus/redux-devtools-extension) 사용 경험
- [redux](https://redux.js.org/) enhancer에 대한 지식
:::
:::caution Caution
- 이 문서는 `browser extension`에 대한 내용은 다루지 않습니다. <br/>
- `redux-devtools`의 core에 대해서 다루고 있으며 `browser extension`에 대한 지식이 없어도 이해가 가능합니다. <br/>
- `redux-devtools-extensions`와 관련하여 `browser extension`에 대한 내용을 원하는 분들은 이 글에서 다루는 내용과 맞지 않을 수 있습니다. 
:::

<!--truncate-->

## redux-devtools는 어떻게 웹 어플리케이션과 연결이 될까?
우리는 어떻게 redux-devtools가 web application에 영향을 줄 수 있는지 알아야한다. <br />
먼저 `redux-devtools`를 사용하기 위한 가이드를 확인해보자.

### 기본 적용
redux-devtools를 chrome extension으로 적용하는 방법은 다음과 같다. ([docs](https://github.com/zalmoxisus/redux-devtools-extension#11-basic-store))
```tsx
 const store = createStore(
   reducer, /* preloadedState, */
+  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
 );
```
`redux store`를 생성할 때 `enhancer` 위치에 `window.__REDUX_DEVTOOLS_EXTENSION__`를 넣어준다. `redux store`의 `enhancer`를 이용한다는 것을 알 수 있지만, `window.__REDUX_DEVTOOLS_EXTENSION__`가 어디서 등록되는 함수인지는 알지 못한다.
또한, [redux-toolkit](https://github.com/reduxjs/redux-toolkit)을 사용한다면 devTools 옵션의 [default값이 true](https://github.com/reduxjs/redux-toolkit/blob/v1.6.1/packages/toolkit/src/configureStore.ts#L63)이므로 이런 설정을 신경쓰지 않았던 개발자도 있을 것이다.
redux-toolkit도 내부적으로는 위와 같은 redux-devtools 설정 코드를 주입시켜주고 있다. ([code](https://github.com/reduxjs/redux-toolkit/blob/v1.6.1/packages/toolkit/src/devtoolsExtension.ts#L184))

아무래도 chrome extension에서 `window.__REDUX_DEVTOOLS_EXTENSION__`를 주입시켜주는 것이 아닌가 추측해보지만 우리는 chrome extension 코드를 확인하지 않고 다른 `redux-devtools` 적용방법을 찾아본다.

### 수동 적용
`redux-devtools` 문서를 찾아보다보면 `browser extension`을 사용하지 않고 수동으로 적용할 수 있는 [문서](https://github.com/reduxjs/redux-devtools/blob/main/docs/Walkthrough.md#manual-integration)가 있다.

문서 내용을 간략하게 요약하면, 아래 dependency를 추가하고 `createDevTools`를 생성한 뒤 store enhancer에 이를 추가해주는 방식이다.
- dependecny 추가
```shell
npm install --save-dev @redux-devtools/core
npm install --save-dev @redux-devtools/log-monitor
npm install --save-dev @redux-devtools/dock-monitor
```
- `DevTools` 컴포넌트 생성
```tsx
// DevTools.tsx
import React from 'react';

import { createDevTools } from '@redux-devtools/core';
import LogMonitor from '@redux-devtools/log-monitor';
import DockMonitor from '@redux-devtools/dock-monitor';

const DevTools = createDevTools(
  <DockMonitor
    toggleVisibilityKey="ctrl-h"
    changePositionKey="ctrl-q"
    defaultIsVisible={true}
  >
    <LogMonitor theme="tomorrow" />
  </DockMonitor>
);

export default DevTools;
```
`@redux-devtools/core`에서 `createDevTools` 인터페이스를 통해서 `DevTools` 컴포넌트를 생성한다. 이 `DevTools` 컴포넌트는 두가지 역할을 담당한다.
첫번째는 web application 내부에서 보여주는 devtools 컴포넌트이다. 수동 적용을 하면 browser extension으로 조작하는 것이 아닌 web application에 devtools를 띄워서 조작할 수 있는 방식을 사용 할 수 있고,
그 화면을 조작하는 컴포넌트이다.
두번째는 DevTools에서 제공하는 instrument라는 메소드이다. 이 메소드는 redux store에 포함되는 enhancer를 리턴한다. 뒤이어 나오겠지만 이 2가지를 통해서 web application과 redux-devtools를 연결한다.

- Store에 enhancer 주입 & DevTools 랜더링
```tsx
// Store.ts
import { createStore, applyMiddleware, compose } from 'redux';
import DevTools from './DevTools';

const enhancer = compose(
  // Middleware you want to use in development:
  applyMiddleware(d1, d2, d3),
  // Required! Enable Redux DevTools with the monitors you chose
  DevTools.instrument()
);
const store = createStore(rootReducer, initialState, enhancer);

export default store;
```
```tsx
// App.tsx
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

render(
  <Provider store={store}>
    <div>
      <TodoApp />
      <DevTools />
    </div>
  </Provider>
document.getElementById('app')
);
```
위쪽 코드는 만들어 놓은 `DevTools`를 이용해서 store enhancer와 Component에 쓰이는 부분의 예시코드이다.

자, 이제 redux-devtools 내용을 보려면 무엇을 확인해야하는지 파악 할 수 있다. <br/>
redux-devtools는 컴포넌트와 redux store enhancer형태로 web application에 연결되며 `@redux-devtools/core`의 내부를 확인해보면 될 것 같다.   

여기서 `DockMonitor`나 `LogMonitor`는 web application 내부에 redux-devtools를 표시하는 부수적인 기능이므로 이 글에서는 `@redux-devtools/core`만 확인 할 예정이다.

### Recap about devtools connection with web application
redux-devtools와 web application의 연결고리는 browser extension을 이용한 연결보다 [직접 연결하는 방법](https://github.com/reduxjs/redux-devtools/blob/main/docs/Walkthrough.md#manual-integration)을 통해서 힌트를 얻을 수 있었다.

`@redux-devtools/core`에서 `createDevTools` 함수를 제공하며, 이 함수는 devtools를 그려주는 컴포넌트를 제공하는 동시에 redux store에 들어가는 enhancer를 생성할 수 있게 해준다.

연결 고리를 찾았으니 `@redux-devtools/core`의 `createDevTools` 내용을 확인해 볼 예정이다.

## createDevTools
[createDevTools](https://github.com/reduxjs/redux-devtools/blob/v3.6.0/packages/redux-devtools/src/createDevTools.js#L24)는 DevTools를 그려주는 컴포넌트와, store에 등록할 enhancer 생성 메소드를 가지고 있다.
우리는 enhancer를 위주로 살펴볼 것 이다.

```tsx
import instrument from 'redux-devtools-instrument';

// https://github.com/reduxjs/redux-devtools/blob/v3.6.0/packages/redux-devtools/src/createDevTools.js#L24
export default function createDevTools(children) {
  const Monitor = monitorElement.type;
  ...
  return class DevTools extends Component {
    static instrument = options => instrument(
      (state, action) => Monitor.update(monitorProps, state, action),
      options,
    )
    
    render() {
      ...
    }
  }
}
```
`createDevTools`에서는 static함수로 `instrument`를 제공하며 `instrument`는 [redux-devtools-instrument](https://github.com/reduxjs/redux-devtools/blob/v3.6.0/packages/redux-devtools-instrument/src/instrument.js#L737)로 들어간다.

## redux enhancer
`DevTools.instrument()`는 store의 enhancer에서 사용될 예정이다. 따라서 [instrument](https://github.com/reduxjs/redux-devtools/blob/v3.6.0/packages/redux-devtools-instrument/src/instrument.js#L737)는 enhancer 함수를 리턴하는 것이라고 예상할 수 있다.
`instrument`를 알아보기 전에 redux enhancer에 대해서 되짚어보자.

[redux store enhancer](https://redux.js.org/usage/configuring-your-store#enhancersmonitorreducerjs) 형식은 다음과 같다.
```tsx
// https://redux.js.org/usage/configuring-your-store#enhancersmonitorreducerjs
const exampleEnhancer = (createStore) => (reducer, initialState, enhancer) => {
  const monitorReducer = (state, action) => {
    const start = performance.now()
    const newState = reducer(state, action)
    const end = performance.now()
    const diff = round(end - start)

    console.log('reducer process time:', diff)

    return newState
  }
  
  return createStore(monitorReducer, initialState, enhancer) 
}
```
`enhancer`는 `createStore`를 인자로 받고, store를 리턴하는 함수를 만들어서 리턴한다. 
위 코드는 redux문서에 있는 예시인데, `monitorReducer`를 만들어서 기존 reducer를 `monitorReducer`로 대체하는 역할을 하는 것이다.

`enhancer`는 이런 방식으로 reducer나 state를 변형시키고, `redux-devtools` 또한 enhancer의 이러한 기능을 사용하여 logging, rollback, skip 기능 등을 구현하고 있다.

## instrument
[instrument](https://github.com/reduxjs/redux-devtools/blob/v3.6.0/packages/redux-devtools-instrument/src/instrument.js#L737)는 redux enhancer를 반환하고 내부 구조를 보면 다음과 같다.
```tsx
// https://github.com/reduxjs/redux-devtools/blob/v3.6.0/packages/redux-devtools-instrument/src/instrument.js#L737-L771
export default function instrument(monitorReducer, options) {
  return (createStore) => (reducer, initialState, enhancer) => {
    function liftReducer(r) {
      return liftReducerWith(r, initialState, monitorReducer, options);
    }
  }
  
  const liftedStore = createStore(liftReudcer(reducer), enhancer);
  
  return unliftStore(liftedStore, liftReducer, options);
}
```
여기서 `unliftStore` 함수 결과 값을 리턴하고, reducer는 `liftReducer`를 통해서 가공된다.

앞으로의 설명을 조금 이해하기 쉽도록 부연설명을 하자면, `redux-devtools`는 app의 store와는 별도로 devtools의 store를 하나 더 만드는 방식이다.
즉, app에서 redux store를 생성해서 사용하지만 devtools에서는 app과는 다른 redux store를 만들어서 사용한다. 
이 두가지의 구분에는 `instrument`에서 사용하는 함수명에도 확인 할 수 있듯이 `lift`와 `unlift`라는 단어를 사용한다.

`lift`는 app 정보들을 devtools로 끌어올리는 것을 의미하고, `unlift`는 devtools 정보들을 app에서 쓸 수 있게 끌어내리는 것을 의미한다.
즉, 이 가정을 토대로 `liftReducer`와 `unliftStore`가 하는 역할을 유추해보자면 `liftReducer`는 devtools에서 사용되는 reducer이고, 
`liftedStore`는 devtools에서 사용되는 store를 의미한다. 반대로 `unliftStore`는 devtools에서 사용하는 `liftedStore`를 이용해서 app에서 사용되는 store를 만든다는 의미로 이해하면 된다.

물론 devtools 문서에서 발견한 공식표현은 아니고 devtools를 이해하려 하는 입장에서 이렇게 이해하면 좋을 것 같아서 표현을 가져왔다.

:::tip TIP
`redux-devtools`에서는 app의 store와 devtools의 store를 구분하고 있다. <br/>
`lift`는 app의 것을 이용해서 devtools의 것으로 치환하는 것을 의미하고 `unlift`는 devtools 것을 이용하여 app의 것으로 치환하는 의미이다.

예를 들어서 `unliftStore`라는 것은 `liftedStore`(devtools의 store)를 이용해서 app의 store를 구하는 함수인 것이다.

공식적인 용어해설은 아니지만 이러한 의미를 가지고 redux-devtools의 코드를 확인하면 좀 더 이해하기 쉬울 것이다.
:::

## unliftStore
`instrument`의 return에 쓰이는 [unliftStore](https://github.com/reduxjs/redux-devtools/blob/v3.6.0/packages/redux-devtools-instrument/src/instrument.js#L680-L732)를 먼저 살펴본다.
`unliftStore`는 app에서 쓰이는 store를 생성하는 함수이다.
```tsx
// https://github.com/reduxjs/redux-devtools/blob/v3.6.0/packages/redux-devtools-instrument/src/instrument.js#L680-L732
export function unliftStore(liftedStore, liftReducer, options) {
  function getState() { ... }
  function dispatch() { ... }
  
  return {
    ...liftedStore,
    liftedStore,
    dispatch,
    getState,
    replaceReducer() { ... },
    [$$observable]() { ... },
  }
}
```
`unliftStore`는 dispatch, getState, replaceReducer등 여러 메소드를 리턴하는데 메소드 명들이 익숙한 것들이다. 바로 redux store에서 제공하는 메소드이기 때문이다.
즉, `unliftStore`는 `createStore`를 사용하진 않지만 redux store를 리턴한다는 것을 알 수 있다. 
`unliftStore`는 redux store enhancer에 사용되며, enhancer의 리턴 값은 redux store가 반환되므로 
`unliftStore`의 return 값이 redux store와 동일한 건 당연한 것일지도 모른다. 

### getState
redux store에서 getState는 redux store가 가지고 있는 state 객체를 반환하는 역할을 갖고있다. `unliftStore`에서 리턴 된 `getState`는 devtools가 아니라 app에서 쓰인다.
따라서, `getState`가 return하는 값은 app의 redux store가 가지고 있는 state라는 점을 예상 할 수 있다. 한번 코드를 살펴보자.

```tsx
// https://github.com/reduxjs/redux-devtools/blob/v3.6.0/packages/redux-devtools-instrument/src/instrument.js#L685-L691
function getState() {
  return unliftState(liftedStore.getState());
  if (state !== undefined) {
    lastDefinedState = state;
  }
  return lastDefinedState;
}

// https://github.com/reduxjs/redux-devtools/blob/v3.6.0/packages/redux-devtools-instrument/src/instrument.js#L671-L674
function unliftState(liftedState) {
  const { computedStates, currentStateIndex } = liftedState;
  const { state } = computedStates[currentStateIndex];
  
  return state;
}
```
`getState`는 `unliftState`를 호출하고 `unliftState`는 state를 리턴한다. `lift`와 `unlift`의 의미를 생각해보면 `unliftState`는 app에서 사용하는 state를 의미한다.
따라서 `getState`는 `liftedStore`(devtools의 store) 로부터 state를 가져와서 `unliftState`(app의 redux state)를 추출해낸다.

`unliftState` 내부 구현을 살펴보면 `liftedState`로부터 `computedStates`와 `currentStateIndex`를 가져와서 state를 추출한다.
즉, `liftState`는 데이터를 저장할 때 app의 state를 모두 `computedStates`에 저장하고 state의 index를 따로 `currentStateIndex`에 저장한다는 것을 예측할 수 있다.
물론, 아직 liftState를 어떻게 만드는지에 대해서는 확인하기 전이므로 이정도 예측만 하고 계속 코드를 읽어보자.

:::note Note
`unliftState`는 liftedState로 부터 unliftState를 리턴하는 함수이다. <br/>
현재는 `liftedState`가 어떤 데이터를 갖고 있는지 모르지만 `computedStates`와  `currentStateIndex`를 통해서 app의 state를 구하고 있다는 점을 기억해두자. 
:::

### dispatch
이 `dispatch`도 app에서 쓰이는 dispatch이다. 코드를 살펴보자.

```tsx
// https://github.com/reduxjs/redux-devtools/blob/v3.6.0/packages/redux-devtools-instrument/src/instrument.js#L693-L696
function dispatch(action) {
  liftedStore.dispatch(liftAction(action, trace, traceLimit, dispatch))

  return action;
}

// https://github.com/reduxjs/redux-devtools/blob/v3.6.0/packages/redux-devtools-instrument/src/instrument.js#L246-L253
function liftAction(action, trace, traceLimit, toExcludeFromTrace) {
  return ActionCreators.performAction(
    action,
    trace,
    traceLimit,
    toExcludeFromTrace
  );
}
```
`dispatch`의 parameter로 들어오는 action은 app에서 정의한 action객체일 것이다. 왜냐하면 `unliftStore`에서 만들어지는 메소드는 모두 app에서 그대로 쓰일 것이기 때문이다. 이는 dispatch도 예외는 아니다.
따라서 app의 action 객체를 받아서 `liftedStore`(devtools의 store)에 dispatch를 사용해서 action을 전달해주는데 action을 그대로 전달해주는 것이 아니라 `liftAction`을 통해서 app의 action을 devtools의 action 형식으로 바꾸어준다.
`liftAction` 내부를 보면 [ActionCreators.performAction](https://github.com/reduxjs/redux-devtools/blob/v3.6.0/packages/redux-devtools-instrument/src/instrument.js#L38-L97)은
actionType을 `PERFORM_ACTION`으로 가지는 액션 객체이다. 따라서 app에서 발생하는 모든 action은 `PERFORM_ACTION`으로 변경되어 `liftedStore`에서 쓰인다.

자 여기서 action을 dispatch 했을 때 redux-devtools가 포함 된 흐름을 생각해보자.
1. action이 app에서 dispatch 된다.
2. dispatch는 내부에서 action을 liftedAction으로 변환시킨다.
3. liftedAction은 `liftedStore.dispatch`를 통해서 호출되어 `liftedStore`에서 소비된다.

이 플로우에서 app의 dispatch를 호출하는 과정은 포함되지 않는다.
본래의 [dispatch](https://github.com/reduxjs/redux/blob/master/src/createStore.ts#L257-L262)가 하는 역할인 reducer에 action을 넘겨서 state를 업데이트하는 과정이 포함되지 않았다.
따라서 dispatch 로직은 app의 state를 변경하지 않고 `PERFORM_ACTION`으로 변경하여 liftedStore의 dispatch를 호출하는 역할로 변경되었다. 

### Recap about unliftStore
- `unliftStore`는 store형식을 그대로 반환한다. 즉, getState와 dispatch를 반환하고 있다.
- `unliftStore.getState`는 app의 redux state를 반환하며, `liftedState`의 `computedStates`와 `currentStateIndex`를 사용하여 app의 state를 식별하고 있다.
- `unliftStore.dispatch`는 action을 모두 `PERFORM_ACTION`으로 변환시키며 `liftedStore.dispatch`를 호출한다.
  - 본래의 dispatch가 가지는 app의 state를 업데이트 시키는 동작은 아직 진행되지 않았다.

## liftReducer
자, 그럼 다시 `instrument`의 코드를 살펴보자.
```tsx
// https://github.com/reduxjs/redux-devtools/blob/v3.6.0/packages/redux-devtools-instrument/src/instrument.js#L737-L771
export default function instrument(monitorReducer, options) {
  return (createStore) => (reducer, initialState, enhancer) => {
    function liftReducer(r) {
      return liftReducerWith(r, initialState, monitorReducer, options);
    }
  }
  
  const liftedStore = createStore(liftReudcer(reducer), enhancer);
  
  return unliftStore(liftedStore, liftReducer, options);
}
```
이전 과정을 통해서 우리는 `unliftStore`의 쓰임은 `getState`나 `dispatch`와 같은 메소드를 새롭게 정의해서 app에서 사용할 때 쓰이게 하는 역할이라는 것을 이해할 수 있었다. <br />
다음으로 살펴볼 것은 `liftedStore`와 `liftReducer` 인데 `liftedStore`에서 사용하는 `createStore`는 redux에서 제공하는 것이므로 `liftReducer`만 확인 된다면
`redux-devtools`의 타임머신 디버깅의 비밀을 알 수 있을 것이다.

[liftReducer](https://github.com/reduxjs/redux-devtools/blob/v3.6.0/packages/redux-devtools-instrument/src/instrument.js#L258-L666)는 `lift`라는 용어에 걸맞게 devtools에서 사용하는 reducer를 의미한다.
```tsx
// https://github.com/reduxjs/redux-devtools/blob/v3.6.0/packages/redux-devtools-instrument/src/instrument.js#L258-L666
export function liftReducerWith(reducer, initialCommittedState, monitorReducer, options) {
  const initialLiftedState = { ... };
  ...
  return (liftedState, liftedAction) => {
    ...
    switch (liftedAction.type) {
      case ActionTypes.PERFORM_ACTION: {
        ...
      },
      ...
    }
  }
}
```
`liftReducerWith`는 코드가 상당히 길다. reducer라는 이름에 걸맞게 초기 상태(`initialLiftedState`)도 존재하고, `liftedAction.type`에 따라 state를 분기해주고 있다.
우리는 `unliftStore`를 살펴보고 왔기 때문에 app에서 발생하는 모든 action은 `PERFORM_ACTION`으로 치환되어 `liftReducer`에 전달된다는 것을 알고 있다.

따라서, `initialState`와 `PERFORM_ACTION`일때의 reducer 동작에 대해서 확인해 볼 것이다.

### initialState
`liftReducer`의 `initialState`는 다음과 같다.
```tsx
// https://github.com/reduxjs/redux-devtools/blob/v3.6.0/packages/redux-devtools-instrument/src/instrument.js#L264-L275
const initialLiftedState = {
  monitorState: monitorReducer(undefined, {}),
  nextActionId: 1,
  actionsById: { 0: liftAction(INIT_ACTION) },
  stagedActionIds: [0],
  skippedActionIds: [],
  committedState: initialCommittedState,
  currentStateIndex: 0,
  computedStates: [],
  isLocked: options.shouldStartLocked === true,
  isPaused: options.shouldRecordChanges === false
};
```
initialState를 보고 대략적으로 어떤 정보들을 저장하는지는 알 수 없지만, 우리는 `unliftState`에서 liftState의 어떤 것을 사용하는지 확인한 적이 있다.
:::note Note
`unliftState`에서 언급했던 내용
  - 즉, `liftState`는 데이터를 저장할 때 app의 state를 모두 `computedStates`에 저장하고 state의 index를 따로 `currentStateIndex`에 저장한다는 것을 예측할 수 있다.
:::
`computedStates`와 `currentStateIndex`를 사용해서 unliftState를 계산을 했었으니, `computedStates`에는 app의 state에 대한 정보들이 저장되고, 
`currentStateIndex`는 현재 state가 어떤 index에 저장되어있는지를 저장하는 것 처럼 보인다. 

이외에 예상 가능한 state를 보면 `actionsById`는 id에 대한 action 정보를 저장하는 것 같아보이고, `stagedActionIds`나 `skippedActionIds`는 특정 상태의 액션(staged상태나 skipped상태)에 대한 action id 값을 저장한 것 같아 보인다.
`isLocked`나  `isPaused`는 devtools에서 action의 기록 여부를 저장하는 옵션 같아보인다. 우선은 아래 내용만 정리하고 넘어가자.

#### recap about initialState
- devtools는 action정보를 [normalized](https://redux.js.org/usage/structuring-reducers/normalizing-state-shape)를 사용해서 byId와 id형태로 저장하고 있다.   
- `computedStates`에 state들을 저장하는 것으로 예상되며, `currentStateIndex`는 `computedStates` 중 어떤 state가 사용되고 있는지 index를 저장하고 있는 것 같아 보인다.
- `isLocked`나 `isPaused`에 대한 옵션 값들을 가지고 있다.

### PERFORM_ACTION의 동작
우리는 app에서 발생하는 모든 action은 `PERFORM_ACTION` 타입을 가지는 action으로 변환되어 liftReducer에서 사용되는 것을 확인했었다.
따라서 liftReducer에서 `PERFORM_ACTION`이 어떤 방식으로 동작할지 확인해보자.

reducer를 보기 전에 `PERFORM_ACTION`의 payload에는 어떤 정보들이 저장되어있는지 확인해보자.
```tsx
// https://github.com/reduxjs/redux-devtools/blob/v3.6.0/packages/redux-devtools-instrument/src/instrument.js#L38-L97
export const ActionCreators = {
  performAction(action, trace, traceLimit, toExcludeFromTrace) {
    ...
    return {
      type: ActionTypes.PERFORM_ACTION,
      action,
      timestamp: Date.now(),
      stack,
    }
  }
}
```
`PERFORM_ACTION`은 인자로 받은 action을 그대로 저장하고 특별히 다른 정보들을 저장하고 있지는 않는다. 링크를 통해서 직접 코드를 찾아가면 `stack`과 같은 로직이 복잡하게 있는 것을 볼 수 있다.
이는, devtools의 trace 기능을 보여주기 위해서 여러가지 로직을 갖고 있는 것 때문인데 우리의 목적은 trace를 살펴보는 것이 아니기 때문에 가볍게 지나가도 괜찮을 것이다.

action의 형태를 보았으니 이제 reducer부분을 살펴보자.
```tsx
// https://github.com/reduxjs/redux-devtools/blob/v3.6.0/packages/redux-devtools-instrument/src/instrument.js#L426-L446
export function liftReducerWith() {
  ...
  let minInvalidatedStateIndex = 0;
  ...
  swtich (liftedAction.type) {
    case ActionTypes.PERFORM_ACTION: {
      ...
      if (currentStateIndex === stagedActionIds.length - 1) {
        currentStateIndex++;
      }
      const actionId = nextActionId++;
      actionById[actionId] = liftedAction;
      stagedActionIds = [...stagedActionIds, actionId];
      minInvalidatedStateIndex = stagedActionIds.length - 1;
      break;
    }
    ...
  }
}
```
원문 코드를 보면 여러 상태에 따라 로직이 다르지만 기본 동작을 확인해보면 위와 같이 간단하게 나온다. <br/>
`currentStateIndex`를 증가하고, `actionId`를 지정하고, action의 정보를 `actionById`에 현재 action을 저장한다. 그리고 `stagedActionIds`가 나오고 `minInvalidatedStateIndex`가 나온다.
분명 `stagedActionIds`는 `initialState`에 존재했던 값이고 `minInvalidatedStateIndex`는 `initialState`에 저장되지 않고 로컬변수라는 것을 알수 있지만, 
아직 어떻게 사용되는지 알지 못하므로 일단 넘어가보자.

:::tip TIP
`stagedActionIds`와 `minInvalidatedStateIndex`가 어떤 역할을 하는지 아직 알지 못한다. 하지만 이해하기 쉽게 역할을 미리 설명하자면 다음과 같다.
- `stagedActionIds`
  - devtools에 반영이 되어야하는 action의 id를 모아둔 배열이다.
  - 즉, dispatch된 것이 유효한 action의 list를 모아둔 것이고 `PERFORM_ACTION`은 새로운 action이 추가 되는 것이기 때문에 항상 stagedActionIds에 포함되는 것이다.
- `minInvalidatedStateIndex`
  - `minInvalidatedStateIndex`는 한마디로 말해서 재계산을 해야하는 action의 index 값을 의미한다.
  - `PERFORM_ACTION`에서 `minInvalidatedStateIndex`는 `stagedActionIdex.length - 1` 이다. 즉, `stagedActionIndex`의 마지막 값을 가리키고 있고 나중에 마지막 action에 대해서 계산이 필요하다는 의미로 쓰일 것이다.  
:::

action이 발생했을때 어떻게 동작하는지를 확인해보았는데, 아직 어떻게 nextState가 계산되는지 알지 못한다. 분명 action정보를 저장하고 action id들을 여기저기 저장했지만 이 정보들이 reducer를 통해서 nextState를 계산할 것이라 기대하지 못한다.
switch 다음로직을 살펴보자.

### Recap about logic of PERFORM_ACTION
- `PERFORM_ACTION`은 app에서 발생한 action의 정보를 모두 그대로 가져온다.
- app에서 발생하는 action은 모두 `PERFORM_ACTION`로 변환되므로 app에서 발생하는 모든 action은 `PERFORM_ACTION` reducer 동작을 통한다. 
- reducer에서 `currentStateIndex`를 증가시키고 action을 byId와 ids 형태로 저장하고 `minInvalidatedStateIndex`를 저장한다.
- nextState를 계산하는 로직은 아직 나오지 않았다. 
- `stagedActionIds`와 `minInvalidatedStateIndex`는 아직 의미를 알 수 없지만 미리 알고 가자면 다음과 같다.
  - `stagedActionIds`: devtools에 반영 되어야하는 action의 id를 모아둔 배열이다.
  - `minInvalidatedStateIndex`: state를 계산해야하는 action의 index이다. 나중에 이 값을 기준으로 state를 계산한다.

## recomputeStates
swtich가 끝난 뒤 로직에 드디어 `computedState`를 계산하는 로직이 나온다. `recomputeStates`를 통해서 업데이트 하는 것으로 보이는데, 한번 살펴보자.

```tsx
// https://github.com/reduxjs/redux-devtools/blob/v3.6.0/packages/redux-devtools-instrument/src/instrument.js#L642-L666
export function liftReducerWith() {
  ...
  computedStates = recomputeStates(
    computedStates,
    minInvalidatedStateIndex,
    reducer,
    committedState,
    actionsById,
    stagedActionIds,
    skippedActionIds,
    options.shouldCatchErrors
  );
  
  return {
    monitorState,
    actionsById,
    nextActionId,
    stagedActionIds,
    skippedActionIds,
    committedState,
    currentStateIndex,
    computedStates,
    isLocked,
    isPaused
  }
}
```

`recomputeStates`는 action이 발생할 때마다 호출되어서 state를 재계산해주는 함수이다. 
parameter로는 `computedStates`(currentState), `reducer`, `minInvalidatedStateIndex`, `actionByIds` 등 다양한 정보들을 받아서 사용하는 것 처럼 보인다. 
코드를 살펴보자.
```tsx
// https://github.com/reduxjs/redux-devtools/blob/v3.6.0/packages/redux-devtools-instrument/src/instrument.js#L189-L241
function recomputeStates(
  computedStates,
  minInvalidatedStateIndex,
  reducer,
  committedState,
  actionsById,
  stagedActionIds,
  skippedActionIds,
  shouldCatchErrors
) {
  const nextComputedStates = computedStates.slice(0, minInvalidatedStateIndex);
  
  for (let i = minInvalidatedStateIndex; i < stagedActionIds.length; i++) {
    const actionId = stagedActionIds[i];
    const action = actionsById[actionId].action;

    const previousEntry = nextComputedStates[i - 1];
    const previousState = previousEntry ? previousEntry.state : committedState;

    const entry = computeNextEntry(
      reducer,
      action,
      previousState,
      shouldCatchErrors
    );
    nextComputedStates.push(entry);
  }

  return nextComputedStates;
}
```
skip이나 error처리에 대한 코드를 생략하고나면 위와 같은 코드가 된다.
처음에 `nextComputedStates`를 준비하고 `minInvalidatedStateIndex` 까지의 state를 자르게 된다. 여기서 `minInvalidatedStateIndex`의 의미를 알 수 있다.

아까 `PERFORM_ACTION`에서 계산했던 `minInvalidatedStateIndex`값은 가장 최근 `stagedActionIds`에 들어갔던 index를 의미한다.
예를들어, `stagedActionIds`에 4개의 id가 들어가 있다면 `minInvalidatedStateIndex`값은 3이 되고 `nextComputedStates`는 0번째 index부터 3까지의 값을 저장하므로 총 3개의 값을 가진 array가 된다.
`for` 문을 보면 `minInvalidatedStateIndex`값부터 시작해서 `stagedActionIds.length`까지의 계산을 진행한다. 즉, `minInvalidatedStateIndex`는 재계산 해야하는 action의 index를 의미하는 것이다.

for문의 로직은 간단하다. 현재 action의 id를 알아내어 action값을 `actionsById`로부터 가져온 뒤, previousState를 가져온다. 이후 `computeNextEntry`를 이용해서 state계산이 이루어지는데, `computedNextEntry`의 코드는 간단하다.
error에 대한 로직이 들어가있어서 여러 함수로 구성되어 있는데, error와 관련된 코드를 생략하면 다음과 같다.
```tsx
// https://github.com/reduxjs/redux-devtools/blob/v3.6.0/packages/redux-devtools-instrument/src/instrument.js#L179-L184
function computeNextEntry(reducer, action, state, shouldCatchErrors) {
  ...
  return computeWithTryCatch(reducer, action, state);
} 

// https://github.com/reduxjs/redux-devtools/blob/v3.6.0/packages/redux-devtools-instrument/src/instrument.js#L153-L174
function computeWithTryCatch(reducer, action, state) {
  let nextError;
  const nextState = reducer(state, action);
  ...
  return {
    state: nextState,
    error: nextError,
  }
}
```
즉, 이전 state와 현재의 action, reducer를 통해서 다음 state를 계산하는 것이다.
이 계산한 값이 entry로 들어가게되고, 이 entry는 nextComputedStates의 마지막으로 들어가게 된다.

`PERFORM_ACTION` action이 발생한 상황에서는 for문은 항상 1번만 동작할 것이고 새롭게 계산 된 state는 `nextComputedStates` 배열에 포함 되고, 이는 결국 `computedStates`에 할당된다.
여기서 변경된 `computedStates`는 app의 state로 전달 될 것이다.

### Recap about recomputeStates
- devtools에서 store state를 변경하는 로직은 reducer의 switch 다음에 위치한 `recomputeStates` 로직이다.
- `recomputeStates`는 계산 된 state배열을 준비하고, 계산이 필요한 index를 기준으로 for문을 통해서 새로운 state를 계산 한 뒤 state배열에 넣는다.
- `minInvalidatedStateIndex`는 계산이 필요한 시작 index를 가리키는 역할이다.
- `PERFORM_ACTION`이 dispatch 되었을 때는 for문이 항상 1번만 진행되며 기존 `computedStates`배열 뒤에 이번 action에 대한 state가 저장된다.

## devtools가 포함된 action을 처리되는 과정
이제 우리는 app에서 action이 발생했을 때 devtools에서 어떻게 action을 처리하는지 알 수 있다.

- app에서 action이 dispatch로 호출됨

app에서 action을 dispatch할 때 사용되는 dispatch는 [unliftStore](#unliftstore)에 있는 [dispatch](#dispatch)이다. 
dispatch는 `liftStore`의 dispatch를 호출하고 action은 `PERFORM_ACTION` type으로 변경되어 호출된다.

- `liftStore`의 `liftReducer`

action은 `PERFORM_ACTION`으로 호출되고, `liftReducer`에서 소비된다. [PERFORM_ACTION의 동작](#perform_action의-동작)을 보면 
`currentStateIndex`를 1 증가시키고, action에 id를 부여해서 action정보를 저장한다. 또 `stagedActionIds`에 actionId를 넣고 `minInvalidatedStateIndex`를 업데이트한다.

`recomputedStates`에서는 `minInvalidatedStateIndex`를 기준으로 새로운 state를 계산하는데, `PERFORM_ACTION`에서는 이번에 호출된 action에 대해서만 계산한다.
여기서 계산 된 state는 `computedStates`의 마지막 배열에 추가된다.

- app에서 getState로 state를 가져옴

app에서 state를 가져오기위해 사용하는 `store.getState`도 dispatch와 마찬가지로 [unliftStore](#unliftstore)에 있는 [getState](#getstate)를 사용한다.
`getState`는 `liftedState`에서 `computedStates`와 `currentStateIndex`를 이용해서 state를 계산한다.

`PERFORM_ACTION`만 dispatch되었다면 `currentStateIndex`는 1씩 증가했을 것이고 getState의 리턴 값은 computedStates의 마지막 index에 있는 state를 가져온다.

## devtools의 주요 동작에 대한 분석

devtools에서 action이 처리되는 것을 확인해보았으니, article의 초기에 제시했던 질문에 대해서 답변을 할 수 있게 되었다.

### `redux-devtools`에서 어떻게 action과 reducer를 **logging**하고 있을까?

logging에 대해서는 지금까지 확인한 정보를 이용해서 도출해 낼 수 있다. 

:::tip Question & Answer
> Q1. `redux-devtools`에서 어떻게 action과 reducer를 **logging**하고 있을까?

A1. `liftReducer`는 `actionsById`로 모든 action에 대한 정보를 저장하고 `stagedActionIds`에 모든 action에 대한 id를 저장한다.
또, `computedStates`에 action별 state를 저장하고 있다.

따라서 app에서 발생시킨 action의 순서 및 payload 정보, action별 state를 저장하고있으므로 충분히 devtools에서 로그를 찍을 수 있다.
그리고, `unliftStore`의 getState를 통해서 devtools에서 관리하고 있는 action, state에 대한 정보에 대한 캡슐화를 지키고 있어서
app에서는 이러한 사항들을 이해하지 않고 개발을 진행할 수 있다.
:::

### `redux-devtools`에서 어떻게 특정 action이 dispatch 된 시점으로 **jump**하고 있을까?

redux-devtools에서 jump하는 방법에 대해서 알기 위해서는 우리가 살펴보아야 하는 것이 있다.
우리는 `liftReducer`에서 `PERFORM_ACTION`에 대해서만 살펴보았다. app에서 발생시키는 action은 모두 `PERFORM_ACTION`으로 치환되지만, 
`devtools`에서 발생시키는 action은 다른 타입의 action을 발생시킬 수 있다.

`liftReducer`에서 Jump와 관련된 action을 어떻게 처리하는지 살펴보자.
```tsx
// https://github.com/reduxjs/redux-devtools/blob/v3.6.0/packages/redux-devtools-instrument/src/instrument.js#L511-#L526
case ActionTypes.JUMP_TO_STATE: {
  currentStateIndex = liftedAction.index;
  minInvalidatedStateIndex = Infinity;
  break;
}
case ActionTypes.JUMP_TO_ACTION: {
  const index = stagedActionIds.indexOf(liftedAction.actionId);
  if (index !== -1) currentStateIndex = index;
  minInvalidatedStateIndex = Infinity;
  break;
}
```
이전에 살펴보았던 `liftReducer`에서 action을 처리하는 부분이다.

state를 기준으로 호출하냐, action을 기준으로 호출하냐의 차이는 있을테지만, 두가지 모두 원리는 같다. 
`currentStateIndex`를 jump할 action의 index로 할당시키는 것이다.

getState는 업데이트 된 `currentStateIndex`를 기준으로 `computedStates`에서 state를 가져온다.
예를 들어, `computedStates`에 5개의 state가 담겨있고 `currentStateIndex`가 4인 상태라면 `getState`는 `computedStates`의 마지막 state를 리턴할 것이다.
이때, `JUMP_TO_STATE` 액션을 통해서 `currentStateIndex`를 2로 바꾼다고 가정해보자. 
그러면 `getState`에서 `computedStates`의 3번째 state를 리턴할 것이고 app의 store는 3번째 action을 호출한 상태로 되돌아가는 것이다. 

`computedStates`나 `stagedActionIds`는 변함없이 그대로이기 때문에 다시 `JUMP_TO_STATE` 액션을 통해 `currentStateIndex`를 되돌린다면
원래의 state상태로 돌아 올 수도 있을 것이다.

:::tip Question & Answer
> Q2. redux-devtools`에서 어떻게 특정 action이 dispatch 된 시점으로 **jump**하고 있을까?

A2. devtools 내부에서 발생시키는 action을 통해서 `currentStateIndex`를 이전 값으로 돌리고, index에 맞는 state를 가져오기 때문에 이전의 state 상태로 돌아올 수 있다.
이 과정에서 action이나 state정보를 저장해 둔 `computedStates`나 `stagedActionIds` 정보를 변경시키지 않기 때문에 다시 action을 통해서 Jump 이전의 state 상태로 돌아올 수도 있다.
:::

### `redux-devtools`에서 어떻게 특정 action이 동작하지 않은 것 처럼 **skip**을 할 수 있을까?

이미 발생한 action을 발생하지 않은 것 처럼 변동하는 방법은 `TOGGLE_ACTION`을 확인한다.

```tsx
// https://github.com/reduxjs/redux-devtools/blob/v3.6.0/packages/redux-devtools-instrument/src/instrument.js#L481-L494
case ActionTypes.TOGGLE_ACTION: {
  // Toggle whether an action with given ID is skipped.
  // Being skipped means it is a no-op during the computation.
  const { id: actionId } = liftedAction;
  const index = skippedActionIds.indexOf(actionId);
  if (index === -1) {
    skippedActionIds = [actionId, ...skippedActionIds];
  } else {
    skippedActionIds = skippedActionIds.filter(id => id !== actionId);
  }
  // Optimization: we know history before this action hasn't changed
  minInvalidatedStateIndex = stagedActionIds.indexOf(actionId);
  break;
}
```
`TOGGLE_ACTION`도 target이 될 actionId를 받고 해당 actionId를 `skippedActionIds`에 넣고 `minInvalidatedStateIndex`를 타겟이 된 actionId의 index로 변경한다. 
이러면 skip된 action이후에 계산했던 state들에 대해서 다시 계산을 진행한다.

우리는 skip상태인 action에 대한 로직 분석에 집중하지 않았기 때문에 `skippedActionIds`가 어디서 동작하는지 확인 한 적이 없다.
따라서 `recomputeState`를 다시 한번 확인한다.

```tsx
// https://github.com/reduxjs/redux-devtools/blob/v3.6.0/packages/redux-devtools-instrument/src/instrument.js#L218-L222
function recomputeStates(
  computedStates,
  minInvalidatedStateIndex,
  reducer,
  committedState,
  actionsById,
  stagedActionIds,
  skippedActionIds,
  shouldCatchErrors
) {
  ...
  const nextComputedStates = computedStates.slice(0, minInvalidatedStateIndex);
  for (let i = minInvalidatedStateIndex; i < stagedActionIds.length; i++) {
    const actionId = stagedActionIds[i];
    const action = actionsById[actionId].action;

    const previousEntry = nextComputedStates[i - 1];
    const previousState = previousEntry ? previousEntry.state : committedState;

    const shouldSkip = skippedActionIds.indexOf(actionId) > -1;
    let entry;
    if (shouldSkip) {
      entry = previousEntry;
    } else {
      ...
    }
    nextComputedStates.push(entry);
  }

  return nextComputedStates;
}
```
이번에는 skip을 제외한 로직을 생략해보았다. for문을 들어오는 것까지는 동일하나, actionId가 `skippedActionIds`에 포함되어있다는 것을 알게 되면 entry는 state를 계산하지 않고
previousEntry를 반환하여 현재 차례의 action이 동작하지 않은 것 처럼 결과를 리턴한다.

`TOGGLE_ACTION`에서는 대상이 되는 action의 index로 `minInvalidatedStateIndex`를 업데이트 했기 때문에 target index 이후의 state를 다시 재 계산하므로 
마치 특정 action이 동작하지 않았던 것처럼 app을 설정할 수 있는 것이다.

state를 기준으로 정리하자면 다음과 같다.
- 기존 state: [A, B, C, D, E, ...]
- skip된 action index: 2
- skip이후 state: [A, B, B, D', E' ...]

:::tip Question & Answer
> Q3. `redux-devtools`에서 어떻게 특정 action이 동작하지 않은 것 처럼 **skip**을 할 수 있을까?

A2. devtools 내부에서 발생시키는 action을 통해서 actionId를 `skippedActionIds`에 넣는다. `skippedActionIds`에 포함된 action에 대해서 state를 계산할때는 
state를 계산하지 않고 이전 state를 리턴한다. 

재계산이 필요한 index를 저장하는 `minInvalidatedStateIndex`를 target action index로 변경하였기 때문에 해당 index 이후 state들을 모두 재계산한다. 
target action이 skip된 state로 계산을 이어나가기 때문에 target action이 마치 호출되지 않았던 것 처럼 state가 형성되게 된다.
:::

## Recap
우리는 이 글을 통해서 redux-devtools가 app의 redux와 어떻게 연결이 되고, app의 redux정보를 어떻게 관리하는지 확인해보았다.

`redux-devtools`에 대한 핵심을 간략하게 정리하자면 다음과 같다.
- `redux-devtools`는 redux store enhancer를 통해서 app의 redux store와 연결된다.
- `redux-devtools`의 여러 기능을 활용하면서 app에는 영향을 주지 않기 위해 2가지 store인 `unliftStore`(app part)와 `liftStore`(devtools part)를 관리한다. 
- app에서 발생하는 모든 action은 `PERFORM_ACTION` type을 가지는 `liftAction`으로 변환되어 `liftReducer`으로 전달된다.
- `liftReducer`는 app에서 발생하는 모든 action의 정보와 action에 대한 state정보를 저장한다.
- app에서 사용하는 redux state는 `unliftStore`의 `getState`에서 `liftReducer`에서 가지고 있는 데이터 중 현재 action에 맞는 state를 추출한 데이터이다. 
- `devtools`에서 사용하는 다양한 기능들은 `liftReducer`를 통해서 저장된 action, state 정보들을 변경해서 원하는 시점에 맞는 state를 app쪽으로 전달해주는 방식을 사용하고 있다.

이 글을 읽는 분들 중에서는 `redux-devtools`의 jump, skip이 아닌 다른 기능들에 대해서도 궁금해 하시는 분들이 있을 것이다. 
하지만 `redux-devtools`의 모든 것들을 설명하기엔 한계가 있고, 저 또한 모든 기능에 대해서 로직을 확인해 본 것도 아니다.
만약 이 글을 통해서 `redux-devtools`가 어떤 방식으로 동작하고 있고, 주요 기능(jump, skip)에 대해서 어떻게 구현을 하고 있는지 이해를 했다면, 
[@redux-devtools/core](https://github.com/reduxjs/redux-devtools/blob/v3.6.0/packages/redux-devtools/src/index.js)코드를 살펴보거나 
다른 monitor([@redux-devtools/log-monitor](https://github.com/reduxjs/redux-devtools/blob/v3.6.0/packages/redux-devtools-log-monitor/src/LogMonitor.js))
들 코드를 분석해보면 궁금증을 풀 수 있을 것이라 생각한다.

## Reference
- [redux](https://redux.js.org/)
- [redux-devtools](https://github.com/reduxjs/redux-devtools)
- [redux-devtools-extensions](https://github.com/zalmoxisus/redux-devtools-extension)
