---
slug: deep-dive-to-immer
title: Deep dive to immer
description: immer, usually used by redux, help us to update mutable object like using immutably. How can it do this? Let's deep dive to immer. 
keywords:
  - redux
  - redux-toolkit
  - immer
  - immutable
  - javascript
  - deep-dive
  - how-to-work
  - web
authors: HyunmoAhn
tags: [redux, redux-toolkit, immer, library, how-to-work, deep-dive, javascript, web, immutable]
---

This article basically takes time to learn about immer [immer](https://immerjs.github.io/immer/).
If you don't know immer, I recommend reading [next chapter](#what-is-immer-and-why) first.

## What is my curious?

:::tip Question
Q1. How does `immer` change the mutable update way to immutable update way?
:::
`immer` functions to return data immutably even when using the object built-in method that changes to be mutable.
Let's find out how this function works internally.

This example is following basic example of [immer official docs](https://immerjs.github.io/immer/#a-quick-example-for-comparison)
```tsx
import produce from 'immer';

const baseState = [
  { 
    title: "Learn TypeScript", 
    done: true,
  },
  { 
    title: "Try Immer", 
    done: false,
  },
]

const nextState = produce(baseState, (draft) => {
  draft.push({ title: "Tweet about It" });
  draft[1].done = true;
})

console.log(baseState === nextState) // false
console.log(nextState)
/*
[
  { 
    title: "Learn TypeScript", 
    done: true,
  },
  { 
    title: "Learn TypeScript", 
    done: true,
  },
  { 
    title: "Tweet about It",
  },
]
*/
```

:::tip Question
Q2. How does `immer` use `structural sharing`?

*`structural sharing`: When coping an object, the same reference is used for an object that has not been changed.
:::
To update object immutably means that original object is copied to new object. In other word, copy needs to cost. 
When `immer` copy object, the unchanged reference copies the object using the structural sharing method that is reused.
Let's find out what kind of structural sharing is used in `immer`.

:::tip Question
Q3. `immer` sometimes updates data through return rather than mutable updating the draft within `produce` function,
in which case the logic is different?
:::

When using an `immer`, there is a case of returning a new object instead of the mutable update method suggested above. 
This is same as the method of returning objects from javascript immutably regardless of the immer.
`immer` [officially is guiding](https://immerjs.github.io/immer/return) this way and 
There will be many developers who use both methods, the method of changing objects to be mutable and method of changing objects to be immutable.
Let's see what logic differences these differences cause in the `immer`.

```tsx
// mutable method
const nextState = produce(baseState, (draft) => {
  draft.push({ title: "Tweet about It" });
  draft[1].done = true;
})

// highlight-start
// immutable method
const nextState = produce(baseState, (draft) => {
  return {
    ...baseState,
    { ...baseState[1], done: true },
    { title: "Tweet about It" },
  }
})
// highlight-end
```


:::info PREREQUISITES
- Experience using an `immer` or `redux-toolkit`
- Understanding of [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) (optional)
:::

<!--truncate-->

## What is immer, and why?

***If you know properly why we use `immer`, this can be boring. If you know, Let's [next chapter](#usage)***

What is [immer](https://immerjs.github.io/immer/)? 
Let's bring the introductory phrase from the official docs of `immer`.

> `Immer` (German for: always) is a tiny package that allows you to work with immutable state in a more convenient way.

`immer` is the library that ensures that data is immutably updated in javascript.

Then, where is `immer` being used? <br/>
In style guide of redux, [recommend to using redux-toolkit](https://ko.redux.js.org/style-guide/style-guide#use-redux-toolkit-for-writing-redux-logic) using redux 
and [recommend to using immer](https://ko.redux.js.org/style-guide/style-guide#use-immer-for-writing-immutable-updates) for managing object immutability.
Of course, If you use [redux-toolkit](https://redux-toolkit.js.org/), you already are using immer because `redux-toolkit` is using `immer` internally

It is recommended to refer to the [FAQ of redux](https://ko.redux.js.org/style-guide/style-guide#use-immer-for-writing-immutable-updates) for why immutable data should be used. <br/>
To briefly explain the content, it is as follows. <br/>
javascript 

The variable except of primitive type like number, string etc. have mutable type in javascript.
`Non-primitive` types include objects and arrays.
Even if a non-primitive type of variable is changed, the reference of the variable does not change.
So, If inner of object is changed, reference is not changed.

```tsx
let primitive = 5;
let primitive2 = primitive;

console.log(primitive === primitive2) // true
primitive2 = 10;

console.log(primitive === primitive2) // false


let nonPrimitive = { a: 5 };
let nonPrimitive2 = nonPrimitive;

console.log(nonPrimitive === nonPrimitive2) // true

nonPrimitive2.b = 10;

console.log(nonPrimitive === nonPrimitive2) // true
console.log(nonPrimitive) 
// { a: 5, b: 10 }  
```
[redux](https://redux-saga.js.org/) is using `shallow equality checking`.
When comparing whether the data is the same, `shallow equality checking` doesn't check whether the inside of the data has changed,
but rather determines that the reference of the data has changed. If it is the same, it has not changed.

If using `deep eqaulity checking`, we suffer performance losses because all object have to be compared one by one.
So, when we changed the object, we used immutable data that guarantees that the reference is also changed, 
and we use `immer` because it guarantees that the object is immutable with any changes. 

Even if you have never consciously used an `immer`, if you are using a `redux-toolkit` to use `redux`, you are already using an `immer`.

## Usage
Before deep dive to immer, Let's show check to use `immer`.
Next is the example in [immer docs](https://immerjs.github.io/immer/#a-quick-example-for-comparison).

- The compare way to update baseState immutably
```tsx
const baseState = [
  {
    title: "Learn TypeScript",
    done: true
  },
  {
    title: "Try Immer",
    done: false
  }
]
```
```tsx
// without immer
const nextState = baseState.slice()

nextState[1] = { 
  ...nextState[1], 
  done: true, 
}
nextState.push({ title: 'Tweet about it' })
```
```tsx
// with immer
import produce from "immer"

const nextState = produce(baseState, draft => {
    draft[1].done = true
    draft.push({ title: "Tweet about it" })
})
```
If we don't use `immer`, we need to do copy → update process and need to check if object is changed mutably or not. 
But, if we use `produce` of `immer`, it can be ensured that data is immutable no matter how we use it.

If you have never been used an `immer` yourself and used the `redux` using the [redux-toolkit](https://redux-toolkit.js.org/),
you are already using the `immer`.
If you're not sure, [read this document](https://redux-toolkit.js.org/api/createReducer#direct-state-mutation) on how to mutate the state in the redux-toolkit

## About immer before deep-dive 
First, I will talk about the principle of `immer`.
The contents described here will be easier to understand by referring to the article of the [document of immer](https://immerjs.github.io/immer/#how-immer-works)
and [the blog article](https://medium.com/hackernoon/introducing-immer-immutability-the-easy-way-9d73d8f71cb3#3bff) linked to the FAQ of documents. 

### immer doesn't update original data
When update data, `immer` doesn't update original data(`base_`). 
But it create copy data(`copy_`) using `base_` and update `copy_` instead of updating original data.
Using this principle, the updated data is returned without changing the original data.

### immer record if object is updated or not
`immer` set `modified_` flag to `true` when update object.
If deep part of object tree is modified, `immer` update `modified_` flag from deep part to root tree. 
Then `immer` can traverse root to lear tree. 

After completing the object update process, `immer` check the `modified_` flag. 
If object is modified, use copy data(`copy_`). 
If it is not modified, the structural share is used by reusing the existing reference using original data(`base_`).

### Recap
In short, It is summarized in three lines.

- Manage two type of object, `original data` and `copy data`, preserve original data and update copy data only.
- The changed object can be traversed from the root tree to the leaf tree by turning on the modified flag.
- After the update is completed, the process of combining the new and existing objects using the modified flag is performed.


## Deep dive to immer
Let's deep dive to immer. <br/>
To check logic of `immer`, we need to checking `produce` function used in usage first.

```tsx
// https://github.com/immerjs/immer/blob/v9.0.6/src/immer.ts#L23-L45
const immer = new Immer();
export const produce = immer.produce;
export default produce;
```
`produce` function is method function of `Immer` class. Let's see inner `Immer` class.

Excluding the curring function handling and several exception cases in the `produce` function, it is reduced as follows.
```tsx
// https://github.com/immerjs/immer/blob/v9.0.6/src/core/immerClass.ts#L66-L122
export class Immer {
  produce: (base, recipe) => { 
    let result;

    const scope = enterScope(this);
    const proxy = createProxy(this, base, undefined);
    
    result = recipe(proxy);

    return processResult(result, scope);     
  }
}
```
Since the `produce` function is simpler than excepted, let's move on to the order of the `produce` function logic.
1. `produce` function receives parameters that existing object(`base`) and the function that determines how to update the object(`recipe`).
2. Create `scope`.
3. Create `proxy`.
4. Run `recipe` using `proxy`.
5. Return the final object updated using `processResult`.

What should be questioned here is that the logic of mutable updating is included `recipe` and `recipe` function is just called only.
But the logic of mutable updating inner `recipe` does immutable update without updating target object directly.

The secret may be `proxy`. In fact, when creating a proxy, it uses a [new Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy),
which acts as a key point for the main logic of the `immer`.

Let's take a look one by one.

### scope
`scope` is an object that stores information to be used throughout the immer. 
It is not used much in the basic logic of the `immer`.
```tsx
// https://github.com/immerjs/immer/blob/v9.0.6/src/core/scope.ts#L33-L46
function createScope(
  parent_: ImmerScope | undefined,
  immer_: Immer
): ImmerScope {
  return {
    drafts_: [],
    parent_,
    immer_,
    canAutoFreeze_: true,
    unfinalizedDrafts_: 0
  }
}   
```
`drafts_` is an array that is contained one by one when creating a `proxy` that is made later 
and `immer_` is a space that contains an immer class.

### proxy
Let's check `proxy`, which is the core of the `immer`.

`immer` responds not only to objects but also to cases where Array, Map, Set and proxy can't be used(ES5), 
so the code seems complicated, but if we look at it only with objects, logic becomes a little simpler.

```tsx
// https://github.com/immerjs/immer/blob/v9.0.6/src/core/immerClass.ts#L212-L229
export function createProxy(immer, value, parent) {
  const draft = createProxyProxy(value, parent);
  const scope = getCurrentScope();
  
  scope.drafts_.push(draft);
  return draft;
}
```
To know how to create `proxy`, we need to check `createProxyProxy` function.
The focus point here is that the generated proxy is put in `scope.drafts_`.
The `proxy` first created is root proxy. So `immer` will use `scope.drafts_[0]` when get `rootProxy` later.

```tsx
// https://github.com/immerjs/immer/blob/v9.0.6/src/core/proxy.ts#L50-L95
export function createProxyProxy(base, parent) {
  const state = {
    ...
    scope_: getCurrentScope(),
    modified_: false,
    finalized_: false,
    parent_: parent,
    base_: base,
    draft_: null,
    copy_: null,
    ...
  }

  const target = state;
  const traps = objectTraps
  const { revoke, proxy } = Proxy.revocable(target, traps);
  state.draft_ = proxy;
  state.revoke_ = revoke
  
  return proxy;
} 
```
In `createProxyProxy`, various metadata and new `Proxy` objects are created to be used for immer operation.
The metadata used in the immer is summarized as follows.
- `base_`: Existing data. It came in as the first parameter in `produce` and the original data before it is changed is stored here.
- `copy_`: Updated data. Updated data is saved here using original data and `recipe`. It doesn't have any data yet.
- `draft_`: `draft_` save `Proxy` object that will create here. In the future logic, data is referred to in the same way as `draft_.base` or `draft_.copy`.
- `modified_`: It stores whether the object has been changed. Default value is `false` because object is not updated.
- `finalized_`: It stores whether the proxy complete to update and ready to be returned. Default value is `false` because the object is being prepared. 
- `parent_`: Object can be multi depth. If object composed tree form, parent tree is saved here. This is empty in root proxy.

The main metadata is summarized above. 
The default value of metadata is set here and `Proxy` object is created by `Proxy.revocable` and `traps`.
Let's see about Proxy in next chapter. 

:::info Terms
### proxy? Proxy?
From now on, I will mention the variable `proxy` that includes the `new Proxy` object, including metadata,
and also will mention the object `Proxy` to control various basic actions against objects in javascript as the terms implies.
Coincidentally, since the two terms are the same term as "proxy", in this article, the two will be divided into 'p' as follows. 
- `proxy`: The object containing metadata generated by `immer` and `draft` generated by `new Proxy`.
- `Proxy`: built-in object served by javascript. It is used as an object to control various basic traps of an object.
:::

### new Proxy
***In this chapter, we have a time to know what is the [new Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
If you are familiar with `Proxy`, it doesn't matter if you [move on to the next chapter](#traps-of-immer)***

We created `Proxy` object using `Proxy.revocable` in previous chapter.

The definition of Proxy in [MDN docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) is following.

> The Proxy object enables you to create a proxy for another object, which can intercept and redefine fundamental operations for that object.

`Proxy` object create new Object that intercept or redefine feature of object like set or get.
`Immer` uses `Proxy` to intercept logic to update the original object in a different way, rather than directly updating the object
when getting and setting the original object by creating a `Proxy` object with the original object.

For example, if you have an object and want to dobule the value you set when you set it, you can use it as follows.

```tsx
const origin = {};
const handler = {
  set: function(target, prop, value) {
    if (typeof value === 'number') {
      target[prop] = value * 2;
    } else {
      Reflect.set(...arguments);
    }
  }
}

const proxy = new Proxy(origin, handler);

proxy.a = 10;
proxy.b = {};

console.log(proxy.a); // 20
console.log(proxy.b); // {}
```
When assign to `proxy.a`, the normal set of objects is not used, but the logic of `handle.set` registered when creating the `Proxy` object is used. 
Because the value to set is 10, `proxy.a` is saved 20 not 10.
`Reflect`, which is used in the operation when the value is not the number, is used to follow the existing logic. 

Now, what if an additional value is allocated to the object `proxy.b`?
Will 40 be assigned? Or will 20 be assigned?
```tsx
proxy.b.c = 20

console.log(proxy.b.c) // 20? 40?
```
The answer is 20. The reason is that `proxy` is a Proxy object, but `proxy.b` is not a Proxy object but a plain object.
Therefore, 20 is allocated as it is using a set of plain object without using `handle.set`.

This action acts critically in the `immer`.
This is because there will be many cases in which child objects 
that become several depth are immediately changed in the process of updating the object. 

Therefore, it responds in the following ways.
```tsx
const origin = {};
const handler = {
  set: function(target, prop, value) {
    if (typeof value === 'number') {
      target[prop] = value * 2;
    } else {
      Reflect.set(...arguments);
    }
  },
  // highlight-start
  get: function(target, prop) {
    if (typeof target[prop] === 'object') {
      return new Proxy(target[prop], handler);
    }
    
    return Reflect.get(...arguments);
  }
  // highlight-end
}

const proxy = new Proxy(origin, handler);

proxy.b = {};
proxy.b.c = {};
proxy.b.c.d = 20;

console.log(proxy.b.c); // Proxy {}
console.log(proxy.b.c.d); // 40
```
When create Proxy, we add custom logic not only get but also set. 
When getting a value from a Proxy object, if it is normal object, it create and get a proxy object. 
In this case, the Proxy object is also a Proxy object, and `proxy.b` also returns the Proxy object, not the general object, using `handler.get`.
Therefore, if 20 is assigned to `proxy.b.c`, 40 is allocated in `proxy.b.c` not 20 because `proxy.b` is Proxy object. 

Using these actions of get and set, `Immer` uses logic using `base_` and `copy_` without directly updating the object 
in the set so that even when referring to deep objects in get, Proxy can be referenced.
Let's find out how it is implemented in the next chapter.

:::tip About `latest` and `peek`
From now on, we may be meet a lot about `latest` and `peek`, which are the util functions used in the `immer` code.
If you're curious about what this function does, let's take a look.
- latest
```tsx
// https://github.com/immerjs/immer/blob/master/src/utils/common.ts#L160-L162
export function latest(state) {
  return state.copy_ || state.base_
}
```
`state` is proxy object created in `produce`. proxy object has metadata and object that is created by `new Proxy`. 
`latest` brings in a `copy_` or `base_` object, and it can be seen that it is currently used to bring data held by proxy.
`copy_` is the latest object updated and `base_` is original object so the priority is to bring `copy_` first.

- peek
```tsx
// https://github.com/immerjs/immer/blob/master/src/core/proxy.ts#L234-L238
export function peek(draft, prop) {
  const state = draft[DRAFT_STATE];
  const source = state ? latest(state) : draft;
  return source[prop]
}
```
`peek` has role to bring value of specific key in object. In other word, It is used to bring key matched prop in draft.
There are three cases here.
1. When draft is plain object not Proxy object.
    - In this case, It return immediately with reference to `draft[prop]` because `draft[DRAFT_STATE]` is `undefined`.
2. When draft is Proxy object and has `copy_`
   - Returns `copy_.[prop]`.
3. When draft is PRoxy object and doesn't have `copy_`
    - Returns `base_.[prop]`.

In other word, it is util function to get value to match key from object(or proxy) for several case.  
:::

### Traps of immer
immer의 `Proxy`에서 사용되는 get은 multi depth의 객체를 참조했을때에도 Proxy를 참조할 수 있게 Proxy를 생성해주는 역할을 가지고 있고,
set은 원본 객체를 변경하려 할 때 이를 막고 `base_`, `copy_`, `modified_`와 같은 메타 데이터를 제어하도록 하는 역할을 가지고 있다.

#### Get
The purpose of logic of get is that create proxy object to use it even if we access deep tree directly. 
```tsx
// https://github.com/immerjs/immer/blob/master/src/core/proxy.ts#L101-L124
export const objecTraps = {
  get(state, prop) {
    if (prop === DRAFT_STATE) return state;

    const source = latest(state);
    const value = source[props];
    
    if (state.finalized_ || !isDraftable(value)) return value    

    if (value === peek(state.base_, prop)) {
      prepareCopy(state);
      return state.copy_[prop] = createProxy(state.scope_.immer_, value, state)
    }
    
    return value
  }
}
```

```tsx
if (prop === DRAFT_STATE) return state;
```

This first `DRAFT_STATE` condition logic seems hole logic to get draft from `immer` immediately. 
We can check that it brings proxy by calling `draft[DRAFT_STATE]` in utils function like `peek`.

```tsx
const source = latest(state);
const value = source[prop];
    
if (state.finalized_ || !isDraftable(value)) return value  
```
Next logic is condition when we don't need to create proxy object.
The `state` is `finalized` status, that is, the data is all updated and ready to return. 
Or the `value` is `isDraftable`, that is, if it is not a type such as object or array with mutable,
there is no reason to make it a proxy, so it returns as it is.

```tsx
if (value === peek(state.base_, prop)) {
  prepareCopy(state);
  return state.copy_[prop] = createProxy(state.scope_.immer_, value, state)
}

return value
```
Now, This is logic when creates proxy object. 
It calls `prepareCopy` and create child proxy in `copy_`.
`prepareCopy` is the function that do shallow copy from `state.base_` to `state.copy_`.
It creates `state.copy_` by coping and saves new proxy in `state.copy_[prop]`.
Since then, The values of `base_` and `copy_` is not same. 

Through these logics, even if we refer to the deep tree, it is implemented so that we can get proxy object if it is an object.

So, if we refer back to the object that we have created proxy with get, should we create proxy object again?
Of course, once an object that has created a proxy, it reused what has been made.
The logic that checks for reuse is condition of `value === peek(state.base_, prop)`.

##### reuse of already created proxy (`value === peek(state.base_, prop)`)

`peek(state.base_, prop)` means `prop` of `base_` and `value` means `prop` of `copy_` or `base_`.
Before `copy_` is created, that is, if we have never done `get`, it always compares `base_` and `base_`
so it is always `true` and always run logic to create proxy.
However, if we have done `get` and `copy_` is created, it compares `copy_` and `base_`.
Since the previous get logic allocates proxy to `copy_[prop]` and `copy_` is already different from `base_`, 
the logic of creating `proxy` is skipped and the `state.copy_` is returned as it is.

To use this way, `immer` prevent unnecessary to create `proxy` in `get`. 

It is complicated to explain one line at a time by code, 
but summarize what we do in the `get` logic of proxy.

1. If the referred value from object is not object, it just return it is.
2. If the referred value from object is object, create and return proxy.
3. If it is an object that has been referenced once, reuse the previously created proxy.

#### Set
The purpose of set logic is to update an object and set a `modified_` flag that the object is updated.

```tsx
// https://github.com/immerjs/immer/blob/master/src/core/proxy.ts#L131-L173
export const objectTraps = {
  set(state, prop, value) {
    if (!state.modified_) {
      const current = peek(latest(state), prop)
      const currentState = current?.[DRAFT_STATE]
      
      if (is(value, current) && has(state.base_, prop)) return;

      prepareCopy(state);
      markChanged(state);
    }

    if (state.copy[props] === value) return;

    state.copy_[props] = value;
    return;
  }
} 
```
The abbreviation of the main logic used in the set is as above.
```tsx
set() {
  ...
  if (state.copy[props] === value) return;

  state.copy_[props] = value;
  return;  
}
```
Looking at the logic that proceeds regardless of whether it is `modified_`, 
it can be seen that only `copy_` is changed without changing the original data(`base_`) when setting.

In this process, we can see that if new value has the same reference as the value stored in `copy_`, 
it doesn't do update. As a result, it can also be confirmed that unnecessary updates are being prevented.

If object to be updated has no changed history, `modified_` would be false, but the `modified_` flag is changed in set logic.
```tsx
set(state, prop, value) {
  if (!state.modified_) {
    const current = peek(latest(state), prop)
    const currentState = current?.[DRAFT_STATE]
    
    if (is(value, current) && has(state.base_, prop)) return;

    // highlight-start
    prepareCopy(state);
    markChanged(state);
    // highlight-end
  }
  ...
}
```
If `modified_` is false when proceeding with the set, the change logic is performed.
Except for edge logic, if we look at basic logic, it perform the functions `prepareCopy` and `markChanged`. 
 
:::info
#### `prepareCopy` from get and `prepareCopy` from set

Previously, we saw the use of `prepareCopy` when proceeding with get.
Does it do copy when we get and copy when we set?

If we look closely, `prepareCopy` of get and `prepareCopy` of set have different purposes.

`prepareCopy` of `get` do that copy parent object about referred object 
and `prepareCopy` of `set`do that copy itself about referred object.

For example, if the object is changed to `proxy.a.b = { ... }`, `copy_` is made through `prepareCopy` from get to `proxy.a`
and `proxy.a.b` makes `copy_` through `prepareCopy` in the set.
:::

The code of `markChanged` is as follows.
```tsx
// https://github.com/immerjs/immer/blob/v9.0.6/src/core/proxy.ts#L266-L273
export function markChanged(state: ImmerState) {
  if (!state.modified_) {
    state.modified_ = true
    if (state.parent_) {
      markChanged(state.parent_)
    }
  }
}
```
In addition to changing one's `modified_`, the `modified_` to the root proxy through the `modified_` of the parent object is changed.
By changing the root proxy in this way, it is possible to find which object has been changed from root to leaf.

In addition, let's check the edge case when changing `modified_` that was missed in the middle.
```tsx
set(state, prop, value) {
  if (!state.modified_) {
    // highlight-start
    const current = peek(latest(state), prop)
    const currentState = current?.[DRAFT_STATE]
    
    if (is(value, current) && has(state.base_, prop)) return;
    // highlight-end

    prepareCopy(state);
    markChanged(state);
  }
  ...
```
If the value to be changed is the same as the stored value and the value `base_[props]` exist,
it is determined that there is no need to change it. 
The process of updating `modified_` true is stopped and updates are not performed.
It seems to be an effort to reduce unnecessary cost by not changing `modified_` when the same value is allocated.

Now, the logic of the set is summarized as follows.
1. If `modified_` is false, copies from `base_` to `copy_` itself and updates `modified_` from parents to root including oneself true.
2. Regardless of whether it is modified or not, it allocates a value to be changed to `state.copy_`. 

### Recap of Proxy
Let's summarize the role of proxy objects in the immer.
- When referring to data, if it is an object, it creates a proxy object. 
When referred to multiple depth in an object several times, get proceeds sequentially, 
so all objects from root object to target object are generated as proxy.
Thanks to this, when referring to objects in multi depth, the same proxy logic as the root can be used.
- When allocating data, `base_` is shallowly copied to `copy_` and a value is updated to the object `copy_` is updated.
In this case, if an object that has not been updated is updated, all modifications from the object to the root object through the parent object are set to true. 

## finalize
If all data have been updated through the `recipe` function, the finalization process is now performed.
It is a process of appropriately combining `base_` and `copy_`.

Looking at the product code again, it is as follows. <br/>
Here, the logic for `processResult(result, scope)` is confirmed.

```tsx
// https://github.com/immerjs/immer/blob/v9.0.6/src/core/immerClass.ts#L66-L122
export class Immer {
  produce: (base, recipe) {
    let result;

    const scope = enterScope(this);
    const proxy = createProxy(this, base, undefined);
    
    result = recipe(proxy);
    // highlight-start
    return processResult(result, scope);
    // highlight-end
  }
}
```
```tsx
// https://github.com/immerjs/immer/blob/v9.0.6/src/core/finalize.ts#L22-L56
export function processResult(result, scope) {
  const baseDraft = scope.drafts_[0];
  const isReplaced = result !== undefined;
  
  if (isReplaced) {
    result = finalize(scope, result);
  } else {
    result = finalize(scope, baseDraft, []);
  }
}
```
The `finalize` process is largely divided into two. This is the case of returning in `recipe` or not.
The difference between these two lies in the variable that is put as a function of `finalize`.
If `recipe` is returning, `finalize` do based on the result value.
If `recipe` is not returning, `finalize` do based on the root proxy.

### using finalize with root proxy
If `recipe` is not returning, `finalize` is automatically performed using root proxy.
```tsx
// https://github.com/immerjs/immer/blob/v9.0.6/src/core/finalize.ts#L57-L110
function finalize(rootScope, value, path) {
  ...
  if (!state.modified_) {
    return state.base_;
  }
  
  if (!state.finalized_) {
    state.finalized_ = true;
    const result = state.copy_;
    
    each(result, (key, childValue) => finalizeProperty(...));
  }
  
  return state.copy_;
}
```
In here, value means root proxy. If root proxy has `modified_` as false, it means that the internal object has never been changed.
Therefore, It returns `state.base_` as it is.
It `modified_` is true because it has been changed, `finalized` is checked. To prevent the finalized logic from being performed several times,
when the finalized logic is entered, the `finalized_` is changed to true and the logic proceeds.
In ES5 mode that does not use proxy, several logics proceed, but in proxy mode, `state.copy_` is used as it is.
`finalizeProperty` including `each` is an operation to `finalize` all child objects inside the root proxy.
If the finalization of all child objects is completed, the `immer` logic ends by returning `state.copy_`.

### using finalize with return of recipe
If `recipe` has a return value, `finalize` is performed using the return value. Of course, the return value is a plane object.
```tsx
// https://github.com/immerjs/immer/blob/v9.0.6/src/core/finalize.ts#L57-L110
function finalize(rootScope, value, path) {
  const state = value[DRAFT_STATE];
  
  if (!state) {
    each(value, (key, childValue) => finalizeProperty(...))
    return value;
  }
  ...
}
```
If `immer` refers `value[DRAFT_STATE]` in value of plain object, It has to be undefined.
Therefore, it proceeds to the logic of `if (!state)`.
In the same way as `finalize` using root proxy, all child objects are finalized through `finalizeProperty` and then the value is returned.

In this time, all child objects may be considered to be plain objects, not proxy objects,
but since all objects approaching inside `recipe` are changed to proxy and returned by proxy's get operation,
the child object may be proxy even if the root is not proxy. 
Therefore, it is necessary to proceed with finalize all child objects.

## Recap
- `immer` receives the `baseState` object and the `recipe` callback function and performs both the mutable logic inside the `recipe`, 
which returns the updated new object without changing the existing object.
- When receive `baseState`, first `immer` creates `Proxy` object using `baseState` and manages it.
- Although the proxy object has several data, but main data are `base_` and `copy_`. 
It is managed that `base_` is original data and `copy_` is updated data.  
- The `recipe` callback function logic is executed with the previously created proxy object, 
where the method of not performing mutable logic is because it intercepts basic object actions such as proxy's set and get.
- In the get of `Proxy`, all the objects it meets are returned to `Proxy` so that it can create `Proxy` even if we refer to the depth of the object.
- In the set of `Proxy`, the `modified_` flag managed inside the proxy object is viewed to manage whether to change or not,
and the `copy_` object, not the `base_` object, is updated.
- After performing both proxy logic using set and get of proxy in the `immer`, 
the changed object uses the information of the proxy object to use the updated object(`copy_`) 
and the unchanged object uses the original object(`base_`) to create and return a new object.

## Answer the question
:::tip Question
Q1. How does `immer` change the mutable update way to immutable update way?
:::

A1. Because `immer` is intercepting get and set logic to using `new Proxy`,
Object is not mutated directly even if update object mutably.
In the logic of set, the `copy_` is copied from `base_` and `immer` updates `copy_` without changing `base_`. 

After all updates are completed, it is possible to immutably update the object 
by determining whether the object has been changed and returning `copy_` or `base_`.

:::tip Question
Q2. How does `immer` use `structural sharing`?
:::

A2. `immer` manages the value of `modified_` according to whether the object is changed.
If `modified_` is true, it means that object is updated.
If `modified_` is true, return a new object called `copy_` to use a new reference,
If `modified_` is false, `base_` object, original object, is returned with previous reference.  
Therefore, boolean is managed whether it has been changed or not,
and structural sharing is used to use the existing one or the new one depending on whether it has been changed.

:::tip Question
Q3. `immer` sometimes updates data through return rather than mutable updating the draft within `produce` function,
in which case the logic is different?
:::

Whether to return within the `produce` function differs in the `finalize` of the `immer`, in the process of preparing the updated object.
If return is not made, it means that the object has been directly changed inside `produce`, 
and if so, using the proxy logic get, set implemented by immer, it is that the object has been updated.
Then, Object updates are carried out using various variables and logics such as `base_`, `copy_` and `modified_` as discussed in this article.

However, what would happen if I returned?
If there is a return value in `produce`, it means that the result value is returned as it is without using logic such as proxy get and set prepared by `immer`.
Therefore, it skips all logic and moves on to the `finalize` process, such as forming a root proxy, updating objects through get, and changing `modified_` to set.
This means returning results without using most of the `immer`'s logic.

Both methods manage objects immutably and update them. 
And both methods use structural sharing in which only the changed object changes its reference.
Of course, if you use the second method, the method of returning the updated object,
you need to be careful not to create a new object unnecessarily.
As a result, either side is the same.
To choose the difference, it is only about hot to change the object. If so, it is an area of choice.
You can think about whether to choose a method of changing it to be mutable or immutable.

Of course, speaking of my opinion, I think the way we update an object depends on the purpose of how we want to update it.
Therefore, I think we can understand the advantages and disadvantages of changing to immutable and the advantages and disadvantages of changing to mutable,
and mix them according to the situation.

## Reference
- [immer official docs](https://immerjs.github.io/immer/)
- [immer repository v9.0.6](https://github.com/immerjs/immer/tree/v9.0.6)
- [redux style guide](https://ko.redux.js.org/style-guide/style-guide/#use-redux-toolkit-for-writing-redux-logic) 
- [redux-toolkit guide](https://redux-toolkit.js.org/api/createReducer#direct-state-mutation)
- [[blog] Introducing immer: Immutability the easy way](https://medium.com/hackernoon/introducing-immer-immutability-the-easy-way-9d73d8f71cb3#3bff)
- [Proxy MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
