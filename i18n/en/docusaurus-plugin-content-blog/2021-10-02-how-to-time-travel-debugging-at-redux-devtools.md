---
slug: how-to-time-travel-debugging-at-redux-devtools
title: how to time travel debugging at redux-devtools 
description: We will check how to time travel debugging at redux-devtools. 
keywords:
  - redux
  - redux-devtools
  - time-travel
  - javascript
authors: HyunmoAhn
tags: [redux, redux-devtools, time-travel, library, how-to-work, javascript, web]
---

## Purpose
If you used [redux](https://redux.js.org/) in web application devlopment, you may have experience to use time-travel debugging with [redux-devtools](https://github.com/zalmoxisus/redux-devtools-extension).

If you have confused about what `redux-devtools` is, please see below video.
<iframe style={{ width: "100%", height: "100%" }} src="https://www.youtube.com/embed/VbPgAf3FUU8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

If you don't have any experience about `redux-devtools`, I think it may be difficult to understand this article.

`redux-devtools` records the redux information(action, reducer state) of web applications using redux,
rollback to the reducer at a specific point in time and can pretend that there was no specific action.
However, It is not simple to try to implement similar actions inside web applictions without using `redux-devtools`.
For example, If you press the A button, make as if The action that's been happening so far didn't happen 
or if you leave before pressing the Submit button, rollback all actions that occurred on the page.

`redux-devtools` is an easy to provide function with buttons, but I don't know how to implement it myself.
How does `redux-devtools` make these things possible?

In this article, we will check below three things.
- How to **log** the actions and reducer called in `redux-devtools`.
- How to **jump** to a point where specific aciton is dispatched in `redux-devtools`.
- How to **skip** a specific action as if it did not work in `redux-devtools`

:::info PREREQUISITES
- The experience about [redux-devtools](https://github.com/zalmoxisus/redux-devtools-extension)
- The intelligence about [redux](https://redux.js.org/) enhancer
:::
:::caution Caution
- This article doesn't include content of `browser extension`
- This article will say about core of `redux-devtools` and you can understand if you don't know about `browser extension`<br/>
- If you want to know `browser extension`, It may not fit the purpose of this article.
:::

<!--truncate-->

## How to connect redux-devtools and web application?
We need to know how `redux-devtools` can affect web applictions.<br />
First, we will check guide to use `redux-devtools`

### Simple usage
The way to apply redux-devtools with chrome extension is below. ([docs](https://github.com/zalmoxisus/redux-devtools-extension#11-basic-store)) 
```tsx
 const store = createStore(
   reducer, /* preloadedState, */
+  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
 );
```
When we create `redux store`, we inject `window.__REDUX_DEVTOOLS_EXTENSION__` in `enhancer`.
We know that `redux-devtools` use `enhancer` of `redux store`, but we can't knwo where `window.__REDUX_DEVTOOLS_EXTENSION__` is registered.
And, if you used [redux-toolkit](https://github.com/reduxjs/redux-toolkit), you might not have cared about devtools because devtools options is [set true at default value](https://github.com/reduxjs/redux-toolkit/blob/v1.6.1/packages/toolkit/src/configureStore.ts#L63).
`redux-toolkit` also inject same setting code internally.([code](https://github.com/reduxjs/redux-toolkit/blob/v1.6.1/packages/toolkit/src/devtoolsExtension.ts#L184))

I guess `window.__REDUX_DEVTOOLS_EXTENSION__` is injected from chrome extension. But we don't read chrome extension code, we will find another usage about `redux-devtools`.

### Manual usage
If we look for `redux-devtools` document, we can find document that manully apply redux-devtools without using `browser extension`.   

In short about that document, add below dependency and create `createDevTools` and add it at store enhancer.
- install dependecny
```shell
npm install --save-dev @redux-devtools/core
npm install --save-dev @redux-devtools/log-monitor
npm install --save-dev @redux-devtools/dock-monitor
```
- create `DevTools` component
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

we will create `DevTools` component using `createDevTools` interface in `redux-devtools/core`.
This `DevTools` component have a two roles.
First is a devtools component to show inner web application. By manual usage, it is possible to use a way that can be operated by displaying devtools on web application rather than by browser extension.
`DevTools` is a component that displayed in web application.
Second is the intrument method that is served in `DevTools`. 
This method return enhancer to use redux store. As it will follow, connect web application and redux-devtools through these two.

- Inject enhancer in store & Render `DevTools`
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
The above code is the example of the part used for store enhancer and component the created `DevTools`. 

Now, we can figure out what to check to see the contents of redux-devtools.<br/>
`redux-devtools` is connected to web applications in the form of component and redux store enhancer, and we can check the inside of `@redux-devtools/core`.

In here, We will check only `@redux-devtools/core` in this article 
because  `DockMonitor` or `LogMonitor` is an additional function to display redux-devtools inside of web applictions.

### Recap about devtools connection with web application
The link between `redux-devtools` and `web application` was able to get hints through a [manual usage])(https://github.com/reduxjs/redux-devtools/blob/main/docs/Walkthrough.md#manual-integration) rather than a usage using browser extension. 

`@redux-devtools/core` is serving `createDevTools` function and it provides a component that renders devtools, while at the same time creating an enhancer to inject redux store.

Now we can find hint, we will check about `createDevTools` of `@redux-devtools/core`.

## createDevTools
[createDevTools](https://github.com/reduxjs/redux-devtools/blob/v3.6.0/packages/redux-devtools/src/createDevTools.js#L24) has component to render `DevTools` and method to create enhancer in registered redux store. 
We will check about enhancer.
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
`createDevTools ` serve `instrument` as a static function and it is [redux-devtools-instrument](https://github.com/reduxjs/redux-devtools/blob/v3.6.0/packages/redux-devtools-instrument/src/instrument.js#L737)

## redux enhancer
`DevTools.instrument()` is used in store enhancer. So, we can expect that [instrument](https://github.com/reduxjs/redux-devtools/blob/v3.6.0/packages/redux-devtools-instrument/src/instrument.js#L737) is return enhancer function.
Before we study `instrument`, Let's recap about redux enhancer.

[redux store enhancer](https://redux.js.org/usage/configuring-your-store#enhancersmonitorreducerjs) form is below.
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
`enhnacer` get `createStore` parameter and return function that return store.  
Above code is a example of redux document, It have a role that make `monitorReducer` and replace existing reducer.

`enhancer` mutate reducer or state in this method. `redux-devtools` also use the redux enhancer features to implement logging, rollback and skip features.

## instrument
The [instrument](https://github.com/reduxjs/redux-devtools/blob/v3.6.0/packages/redux-devtools-instrument/src/instrument.js#L737) returns the redux enhancer
and the internal structure is as follows.
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
Now, it returns result of `unliftStore` function and reducer is processed through `liftReducer`.

To give you an additional explanation to make it easier to understand,
`redux-devtools` create another store of devtools separately from the store of app.
In other words, the app creates and uses a redux store, but devtools creates and uses a redux store different from the app.
The words `lift` and `unlift` are used for these two distinction, as can be seen in the function name used in `instrument`.

`lift` means raising app information to devtools. And `unlift` means pulling down devtools information so that it can be used on the app. 
To infer the role of `liftReducer` and `unliftStore` based on this assumption,
`liftReducer` is reducer used in devtools and `liftedStore` means that it is store used in devtools.
In contrast, `unliftStore` can be understood as meaning that create a store used in the app using `liftStore` that used in devtools. 

Of course, it is not an official expression found in the devtools document, but I brought it 
because I thought it would be good to understand devtools in this way. 

:::tip TIP
`redux-devtools` is separated with app's store and devtools's store.<br/>
`lift` means replacing what is app with that of devtools and `unlift` means replacing what is devtools that of app.

For example, `unliftStore` is function that get store of app using `liftedStore`(store of devtools).

It is not official commentary, if you check the code of redux-devtools with this meaning, it will be easier to understand.
:::

## unliftStore
Let's see [unliftStore](https://github.com/reduxjs/redux-devtools/blob/v3.6.0/packages/redux-devtools-instrument/src/instrument.js#L680-L732) used in return of `instrument` first. 
`unliftStore` is a function that create store used in app.
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
`unliftStore` has several methods such as dispatch, getState, replaceReducer and the method names are familiar for us.  
Because these is served method by redux.
In other word, `unliftStore` doesn't use `createStore` but it returns store of redux.
Because `unliftStore` is used for redux store enhancer and the return value of redux store,
It may be natural that the return value of `unliftStore` is the same as the redux store

### getState
`getState` of redux store has a role to return state object of redux store.
`getState` of return value of `unliftStore` is used in app part rather than devtools.
So, we can expect that `getState` will return state of redux store on app.
Let's take a look at the code.

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
`getState` calls `unliftState` and `unliftState` returns state.
If we think means of `lift` and `unlift`, `unliftState` means state used on app.
So, `getState` returns `unliftState`(app's redux state) from state of `liftStore`(devtools's store). 

Inside of `unliftState`, it extract state using `computedStates` and `currentStateIndex` from `liftedState`.
In other words, we can expect when data is saved, `liftState` saves all app state in `computedStates` and saves index of state in `currentStateIndex`.  
Of course, we can't know how to make `liftState` yet. Let's guess this much and keep reading.

:::note Note
`unliftState` is a function that returns `unliftState` from `liftedState`.<br/>
Let's remember that we don't know that `liftedState` has what kind of data,
but `liftedState` are looking for the state of the app through `computedStates` and `currentStateIndex`.
:::

### dispatch
This `dispatch` is also dispatch used in app. Let's take a look some code. 

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
The action from parameter of `dispatch` is the action object defined in app because the method of `unliftStore` will be use directly in app. It is not exception about `dispatch`.
So, `liftedStore`(devtools's store) transfer action from app to use dispatch, but action is not transmitted directly, it is converted by `liftAction` and it will change action of app to action of devtools.   
Let's see inside of `liftAction`.
[ActionCreators.performAction](https://github.com/reduxjs/redux-devtools/blob/v3.6.0/packages/redux-devtools-instrument/src/instrument.js#L38-L97) is an action object having an action type as `PERFORM_ACTION`. 
So, all actions that dispatched in app, are converted to `PERFORM_ACTION` and used in `liftedStore`.

Let's think about flow included `redux-devtools` when we dispatch actions.
1. `action` is dispatched from app.
2. `dispatch` convert `action` to `liftedAction` inside.
3. `liftedAction` is called through `liftedStore.dispatch` and consumed in `liftedStore`.

In this flow doesn't have flow to call dispatch of app.
The process of updating the state by handling over the action to the reducer, which is the role of the [original dispatch](https://github.com/reduxjs/redux/blob/master/src/createStore.ts#L257-L262), was not included.
Therefore, the dispatch has a role that converts action of app to `PERFORM_ACTION` and calls dispatch of the `liftedStore` without changing the state of the app.

### Recap about unliftStore
- `unliftStore` returns the store form as it is. In other words, it returns `getState` and `dispatch`.
- `unliftStore.getState` returns redux state of app and it is identifying the state of the app using `computedStates` and `currentStateIndex` of `liftedState`
- `unliftStore.dispatch` changes all actions to `PERFORM_ACTION` and calls `liftedStore.dispatch`.
  - The operation of updating the state of the app of the original dispatch has not yet been performed.

## liftReducer
Let's take a look `instrument` code again.
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
Through the previous process, we could understand that `unliftStore` has a role to use new method like `getState` or `dispatch` by redefine.<br />
The next thing to look at is `liftStore` and `liftReducer`. `createStore` used in `liftStore` is served by `redux` 
so if only `liftReducer` is confirmed, we can know that the secret of time-travel debugging.

According to the term `lift`, [liftReducer](https://github.com/reduxjs/redux-devtools/blob/v3.6.0/packages/redux-devtools-instrument/src/instrument.js#L258-L666) means
that reducer used in `devtools`.
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
`liftReducerWith` has long size of code. According to the term `reducer`, it has initial state(`initialLiftedState`) and makes condition state by `liftedAction.type`.
Because we saw `unliftStore`, we know that all actions from app are converted to `PERFORM_ACTION` and are transmitted to `liftReducer`.

Therefore, we will check the initialState of reducer and check the behavior when `PERFORM_ACION` is dispatched. 

### initialState
`initialState` of `liftReducer` is below.
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
We don't know what data is saved roughly by looking at the `initialState`, but we've checked which one of the `liftState` is used in `unliftState`. 
:::note Note
What mentioned in `unliftState`
  - In other words, we can expect when data is saved, `liftState` saves all app state in `computedStates` and saves index of state in `currentStateIndex`.
:::
`unliftState` computed using `computedStates` and `currentStateIndex`, 
So `computedStates` save data of app's state and `currentStateIndex` save index about current state index.

When looking at other predictable states, `actionId` seems to store action data on id and `stagedActionIds` or `skippedActionIds` seems that save actionId about action status like `staged` or `skipped`.
`isLocked` or `isPaused` is option about devtools. First of all, let's just organize the contents below and move on.

#### recap about initialState
- devtools saves byId and id forms about action data to [normalized](https://redux.js.org/usage/structuring-reducers/normalizing-state-shape) form.   
- we expect that `computedStates` saves all state and `currentStateIndex` seems that save index what kind of state is used in `computedStates`.  
- devtools has options value like `isLocked` or `isPaused`.

### The behavior of PERFORM_ACTION
We checked that all action dispatched in app is converted `PERFORM_ACTION` and is used in `liftReducer`.
So, Let's check how `PERFORM_ACTION` will operate in the `liftReducer`.

Before see the reducer, Let's check payload of `PERFORM_ACTION`.
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
`PERFORM_ACTION` stores the action received as a factor as it is and doesn't particularly store other data. 
If you see the code following links, you can see complicate logic like `stack`.
This is because devtools has various logics to show the trace function. But our purpose is not to look at trace, it will be okay pass lightly.

Not that we have seen the form of action, let's look at the reducer part.
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
When looking at the original code, the logic varies depending on the various conditions, but when you check the basic logic, it comes out simply as above.<br/>
`currentStateIndex` is increased, `actionId` is set, `actionById` save action data. And `stagedActionIds` come and `minInvalidatedStateIndex` also come.
Obviously, `stagedActionIds` is a value that existed in `initialState` and `minInvalidatedStateIndex` is not stored in `initialState` but a local variable.
we don't know how to use these yet, so let's move on.

:::tip TIP
we don't know how to work about `stagedActionIds` and `minInvalidatedStateIndex`. However, to explain the role in advance to make it easier to understand, it is as follows. 
- `stagedActionIds`
  - It is array that ids of the action that should be apply in devtools are saved.
  - In other words, it save valid action list and when `PERFORM_ACTION` is dispatched, `stagedActionIds` always add it because new action is added.
- `minInvalidatedStateIndex`
  - In short, `minInvalidatedStateIndex` means the index value of the action that must be recalculated.
  - In `PERFORM_ACTION`, `minInvalidatedStateIndex` is  `stagedActionIdex.length - 1`. In other words, `stagedActionIndex` point last index of actions and it means that last action need to recalculate.  
:::

We checked how to implement when action is dispatched, we don't know how to calculated nextState yet.
Obviously, it saved action info and saved action id here and there but, we can't expect that info calculate nextState.
Let's show next logic of switch.

### Recap about logic of PERFORM_ACTION
- `PERFORM_ACTION` brings all the data of the action generated in the app as it is.
- all actions that dispatched from app are converted to `PERFORM_ACTION`. So it are performed through a `PERFORM_ACTION` reducer logic.  
- In reducer, it increases `currentStateIndex`, save action like byId and ids form and save `minInvalidatedStateIndex`. 
- The logic to calculate `nextState` is not come yet.
- We don't know means that `stagedActionIds` and `minInvalidatedStateIndex`, but if we know it in advance, it's as follows.
  - `stagedActionIds`: A array that saved ids that need to apply actions in devtools.
  - `minInvalidatedStateIndex`: A index of action to calculate state. Later, it calculate use this value.

## recomputeStates
After switch logic, `computedState` logic is come. It seems that update state using `recomputeStates`, Let's look at.

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

`recomputeStates` is function that recalculate state when action is dispatched. 
In parameters, It seems that gets various information like `computedStates`(currentState), `reducer`, `minInvalidatedStateIndex`, `actionByIds` etc. 
Let's look at the code.
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
After omitting the code for skip or error processing, it becomes the above code.
Initially, `nextComputedStates` is prepared and the state up to `minInvalidatedStateIndex` is cut. 
Here, the meaning of `minInvalidatedStateIndex` may be known.

The value of `minInvalidatedStateIndex` calculated in `PERFORM_ACTION` earlier refers to the index that has recently entered `stagedActionIds`. 
For example, If `stagedActionIds` has four ids, `minInvalidatedStateIndex` is three and nextComputedStates` is a array thet three number of value because it save 0 to 3. 
In `for` loop, it start calculate from `minInvalidatedStateIndex` and to `stagedActionIds.length`.
In other words, `minInvalidatedStateIndex` means index of action that need to recalculate.   

`for` loop logic is simple. Find out id of the current action and take the action from `actionById`, and state is calculated using `computeNextEntry` function.
`computeNextEntry` logic is simple. It consists of several functions because it contains logic for errors, and the code related to errors is omitted as follows.
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
In other words, It calculates next state using previous state, current action and reducer.
This calculated value is entered entry and this entry is injected the last of `nextComputedStates`. 

When `PERFORM_ACTION` action is dispatched, for loop always work once and calculated state newly is contained `nextComputedStates` array. It will be assign to `computedStates`. 
The `computedStates` changed here is transmitted to state of app.

### Recap about recomputeStates
- The logic to update state of store in devtools is `recomputeStates` logic in next part of switch.
- `recomputeStates` prepares computed state array and computes new state through the for loop based on the index that needs to be calculated and places it in the state array.
- `minInvalidatedStateIndex` refers to a start index that requires calculation.
- When `PERFORM_ACTION` is dispatched, for loop run only once and the state of current action is appended in previous `computedStates`.

## The process that action is consumed with devtools
Now we can see how devtools processes an action when an action occurs in the app.

- action is called with dispatch on app

The dispatch used when dispatched action in app is [dispatch](#dispatch) of [unliftStore](#unliftstore). 
dispatch call dispatch of `liftStore` and action is called with converting `PERFORM_ACTION`.

- `liftReducer` of `liftStore`

Action is called to `PERFORM_ACTION`, and it is consumed at `liftReducer`. If you see [The behavior of PERFORM_ACTION](#the-behavior-of-perform_action), 
it increases 1 about `currentStateIndex`, saves action info with generating action id and injects actionId in `stagedActionIds` and updates `minInvalidatedStateIndex`.

In `recomputedStates` a new state is calculated based on `minInvalidatedStateIndex`, and in `PERFORM_ACTION`, only the action called this time is calculated.
Here, the calculated state is added to the last array of `computedStates`.

- get state from app to `getState`

`store.getState` to get state from app is same with `dispatch`. It also use [getState](#getstate) of [unliftStore](#unliftstore) 
`getState` calculate state to using `computedStates` and `currentStateIndex` in `liftedState`.

If only `PERFORM_ACTION` was dispatched, `currentStateIndex` would have increased by 1 and the return value of `getState` would have brought the state in the last index of `computedStates`. 

## Analysis of the main behaviour of devtools

We checked that action is processed in devtools, so it is now possible to answer the questions presented at the beginning of the article.

### How to log the actions and reducer called in redux-devtools?

About logging, it can be derived using the information identified so far. 

:::tip Question & Answer
> Q1. How to **log** the actions and reducer called in redux-devtools?

A1. `liftReducer` save all information of action in `actionsById` and save all action id in `stagedActionIds`. 
Also, It save state by actions in `computedStates`.

Therefore, since the order of actions generated in the app, payload data, and state by action are stored, the devtools can take enough logs. 
In addition, encapsulation of information on action and state managed by devtools is maintained through getState of `unliftStore`.
In the app, you can proceed with development without understanding these matters.
:::

### How to **jump** to a point where specific aciton is dispatched in redux-devtools.

There is something we need to look at in order to know how to jump in redux-devtools.
We only looked at `PERFORM_ACTION` in `liftReducer`. All action that dispatched in app is converted to `PERFORM_ACTION`,
but the action dispatched in `devtools` can dispatch other type of action.

Let's look at how `liftReducer` handles jump related actions.
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
This is the part that processes the action in `liftReducer` that we have seen before.

There will be a difference between calling based on state or action, but both have the same principle.
It is to allocate `currentStateIndex` as the index of the action to jump.

`getState` brings state from `computedStates` based on updated `currentStateIndex`.
For example, `computedState` has 5 state and `currentStateIndex` is set 4 then `getState` will return last state of `computedStates`. 
In this time, we suppose that currentStateIndex will be changed to 2 by `JUMP_TO_STATE` action. Then `getState` will return 3 index of `computedStates` 
and store of app back to the state when third action was dispatched.

Since `computedStates` and `stagedActionIds` is not mutated, if you come back to `currentStateIndex` using `JUMP_TO_STATE` action, we can come back to original state.

:::tip Question & Answer
> Q2. How to **jump** to a point where specific aciton is dispatched in redux-devtools.

A2. Through the action generated inside devtools, `currentStateIndex` is returned to the previous value 
and the state suitable for the index is imported, so it is possible to return to the previous state.
In this process, since data on `computedStates` or `stagedActionIds` storing action or state is not changed, the state before jump may return through action.  
:::

### How to **skip** a specific action as if it did not work in redux-devtools

A method to skip as if no action had already occurred confirms `TOGGLE_ACTION`.

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
`TOGGLE_ACTION` also get target actionId and save it on `skippedActionIds` and change `minInvalidatedStateIndex` to index of actionId. 
Then state that after index of skipped action will be calculated again.

Since we didn't focus on logic about skipped action, I have never checked where `skippedActionIds` works.
So, we will check `recomputeState` again.

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
This time, I omitted the logic except skip. It is same entered for loop, if `actionId` is contained `skippedActionIds`, entry doesn't calculate next state 
and return `previousEntry` like action doesn't act.   

In `TOGGLE_ACTION`, since action updates `minInvalidatedStateIndex` to target actionId, states after target index are recalculated 
so it is possible to set the app as if a specific action did not work.

Based on the state, it is summarized as follows.
- previous state: [A, B, C, D, E, ...]
- skipped action index: 2
- after skip state: [A, B, B, D', E' ...]

:::tip Question & Answer
> Q3. How to **skip** a specific action as if it did not work in redux-devtools

A2. actionId is put into `skippedActionIds` through an action generated inside devtools.
When calculating the state for the action included in `skippedActionIds`, return the previous state without calculating the state. 

Since `minInvalidatedStateIndex`, which stores an index requiring recalculation, has been changed to a target action index,
all states after the index are recalculated.
Since the target action continues the calculation to the skipped state, the state is formed as if the target action was not called.
:::

## Recap
Through this article, we checked how `redox-devtools` is connected to the `redux` of the app and how to manage the `redux` data of the app.

A brief summary of the core of `redux-devtools` is as follows.
- `redux-devtools` is connected to the redux store of the app through a redux store enhancer.
- In order not to affect the app while utilizing various functions of `redux-devtools`, two stores, `unliftStore` and `liftStore` are managed. 
- All actions generated in the app are converted into `liftAction` having a `PERFORM_ACTION` type and transmitted to `liftReducer`.
- `liftReducer` stores data on all actions occuring in the app and state on the action.
- The redux state used in the app is data obtained from the `getState` of `unliftStore` to the state suitable for the current action. 
- Various functions used in `devtools` use a method of changing action and state stored through `liftReducer` and delivering the state suitable for the desired time to the app.

Some of the readers of this article may be curious about functions other than `jump` and `skip` of `redux-devtools`.
However, there is a limit to explaining everything in `redux-devtools`, and I have not checked logic for all functions either.
If you have understood through this article how `redux-devtools` is operating and how it is implementing its main functions (jump, skip),
I think you can solve your curiosity by looking at the [@redux-devtools/core](https://github.com/reduxjs/redux-devtools/blob/v3.6.0/packages/redux-devtools/src/index.js) code
or analyzing the code of other monitors ([@redux-devtools/log-monitors](https://github.com/reduxjs/redux-devtools/blob/v3.6.0/packages/redux-devtools-log-monitor/src/LogMonitor.js)).

## Reference
- [redux](https://redux.js.org/)
- [redux-devtools](https://github.com/reduxjs/redux-devtools)
- [redux-devtools-extensions](https://github.com/zalmoxisus/redux-devtools-extension)
