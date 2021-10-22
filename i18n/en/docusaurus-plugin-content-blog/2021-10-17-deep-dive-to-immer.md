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
앞으로의 immer코드에서 immer에서 쓰이는 유틸 함수인 `latest`와 `peek`에 대해서 많이 확인하게 될 것 이다.
이 유틸 함수가 어떤 동작을 하는지 궁금하다면 살펴보자.
- latest
```tsx
// https://github.com/immerjs/immer/blob/master/src/utils/common.ts#L160-L162
export function latest(state) {
  return state.copy_ || state.base_
}
```
state는 produce에서 생성한 proxy 객체이다. proxy 객체는 meta data와 `new Proxy`로 생성한 객체를 가지고 있다.
`latest`는 `copy_` 혹은 `base_` 객체를 가져오는데, 현재 proxy가 가지고 있는 데이터를 가져오는데 쓰이는 것을 알 수 있다.
`copy_`는 변경된 최신 객체이고, `base_`는 원본 객체이므로 `copy_`를 먼저 가져오는 것을 우선시하고 있다.

- peek
```tsx
// https://github.com/immerjs/immer/blob/master/src/core/proxy.ts#L234-L238
export function peek(draft, prop) {
  const state = draft[DRAFT_STATE];
  const source = state ? latest(state) : draft;
  return source[prop]
}
```
`peek`는 객체에서 특정 key에 대한 값을 가져오는 역할을 한다. 즉, draft에서 prop를 key로 가지는 값을 가져오기 위해 사용하는 것이다.
여기서는 3가지 경우가 존재한다.
1. draft가 Proxy객체가 아니라 일반 객체인 경우 <br/>
    - 이 경우는 `draft[DRAFT_STATE]`가 `undefined` 이기 때문에 draft[prop] 를 참조해서 바로 리턴한다.
2. draft가 Proxy 객체이고 copy_ 를 갖고 있을 경우
    - `copy_.[prop]`를 리턴한다.
3. draft가 Proxy 객체이고 copy_ 를 갖고 있지 않은 경우
    - `base_.[prop]`를 리턴한다.

즉, 여러 경우에 대해서 object(혹은, proxy)에서 key에 맞는 값을 구하기 위한 유틸 함수 인 것이다.
:::

### Traps of immer
immer의 `Proxy`에서 사용되는 get은 multi depth의 객체를 참조했을때에도 Proxy를 참조할 수 있게 Proxy를 생성해주는 역할을 가지고 있고,
set은 원본 객체를 변경하려 할 때 이를 막고 `base_`, `copy_`, `modified_`와 같은 메타 데이터를 제어하도록 하는 역할을 가지고 있다.

#### Get
get 로직의 목적은 deep한 tree에 접근하여 set을 하더라도 proxy객체를 사용할 수 있도록 만들어주는 것이다.
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

가장 먼저 보이는 DRAFT_STATE 비교 로직은 immer에서 draft를 바로 획득하기위한 hole같은 동작으로 보인다. 
`peek` 와 같은 유틸함수에서 proxy객체에서 `draft[DRAFT_STATE]`를 호출해서 proxy 그 자체를 가져오는 것을 확인 할 수 있다.

```tsx
const source = latest(state);
const value = source[prop];
    
if (state.finalized_ || !isDraftable(value)) return value  
```
다음 로직은, proxy 객체를 만들 필요가 없는 경우에 대한 분기이다.
state가 `finalized` 상태, 즉 데이터가 모두 업데이트 되어 return할 준비가 된 상태라면 proxy로 변경할 필요가 없고,
value가 `isDraftable`, 즉 mutable한 속성을 가지는 object나 array 같은 타입이 아닌 경우는 proxy로 만들 이유가 없으므로 그대로 리턴을 한다.


```tsx
if (value === peek(state.base_, prop)) {
  prepareCopy(state);
  return state.copy_[prop] = createProxy(state.scope_.immer_, value, state)
}

return value
```
이제는 proxy 객체를 만들때의 로직이다. `prepareCopy` 를 호출하고 `copy_`에 자식 proxy를 생성한다. 
`prepareCopy`는 `state.base_`를 `state.copy_`로 shallow copy를 하는 함수이다.
`state.copy_`를 복사해서 만들고, `state.copy_[props]`에 새로운 proxy를 생성하여 저장한다.
이때부터 `base_`와 `copy_`가 가지고 있는 값들이 바뀌게 된다. 
get에서부터 proxy를 생성해서 저장 해주면서 multi depth Object를 참조했을때 proxy 객체를 참조할 수 있게 된다.

자 그렇다면, 한번 get으로 proxy를 만든 객체를 다시 참조하면 다시 proxy 객체를 만들까? 당연한 말이지만 한번 proxy를 만든 객체라면 기존에 만들어 둔 것을 재사용한다.
재사용할 수 있게끔 검사를 하는 로직이  `value === peek(state.base_, prop)` 의 분기이다.

##### reuse of already created proxy (`value === peek(state.base_, prop)`)

`peek(state.base_, prop)`는 `base_`의 prop를 의미하고, `value`는 `copy_` 혹은 `base_`의 prop를 의미한다. 
`copy_`가 생성되기 전, 즉 get을 한 적이 없다면 항상 `base_`와 `base_`를 비교하므로 항상 true이고 proxy를 만드는 로직을 항상 실행 할 것이다.
하지만, get을 한 적이 있고 `copy_`가 만들어진 상태라면 `copy_` 와 `base_`를 비교하고 이전 get로직에서 `copy_[prop]`에 proxy를 할당하여 
이미 `base_`와 값이 달라졌기 때문에 proxy를 만드는 로직을 스킵하고 그대로 `state.copy_`를 리턴하게 되는 것이다.
이러한 방식을 사용해서 get에서 불필요하게 proxy를 생성하는 것을 방지하고 있다.

코드로 한줄씩 설명하니 복잡한데, proxy의 get동작에서 하는 일을 요약해보자.

1. 객체에서 참조하는 값이 object가 아닌 경우 그대로 값을 리턴한다.
2. 객체에서 참조하는 값이 object일 경우 proxy를 만들어서 리턴한다.
3. 만약 한번 참조한 적이 있는 object라면 이전에 만들어둔 proxy를 재사용한다.

#### Set
set 로직의 목적은 객체를 변경하고 객체가 변경되었다는 `modified_` flag를 설정하는 목적을 가진다.

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
set에서 사용하는 주요 로직을 축약하면 위와 같다.
```tsx
set() {
  ...
  if (state.copy[props] === value) return;

  state.copy_[props] = value;
  return;  
}
```
`modified_` 여부에 관계없이 진행하는 로직을 보면 set을 할 때 original data(`base_`)를 변경하지 않고 `copy_`만을 변경시키는 것을 확인 할 수 있다.
이 과정에서 새로운 값이 `copy_` 저장되어 있는 값과 reference가 같다면 업데이트를 진행하지 않는 불필요한 업데이트는 방지하고 있는 것도 확인 할 수 있다.

만약, 업데이트 될 객체가 변경된 이력이 없다면 `modified_`가 false일 텐데, set 로직에서 `modified_` flag가 변경된다. 
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
set을 진행하고 `modified`가 false 상태라면 변경 로직을 진행한다. edge로직을 제외하고 기본로직만 본다면 `prepareCopy`와 `markChanged` 함수를 실행한다.

:::info
#### `prepareCopy` from get and `prepareCopy` from set

이전에 get을 진행할 때 `prepareCopy`를 사용하는 걸 보았다. get할때 copy를 준비하고 set할때도 copy를 진행하는걸까?

자세히보면 get의 `prepareCopy`와 set의 `prepareCopy`는 목적이 다르다.
get의 `prepareCopy`는 참조할 객체의 부모객체를 copy하는 동작을 하고, set의 `prepareCopy`는 참조하는 객체 본인를 copy하는 동작을 한다.
예를들어, 만약 `proxy.a.b = { ... }`로 객체를 변경한다면 `proxy.a` 까지는 get에서 `prepareCopy`를 통해 `copy_`를 만들고, 
`proxy.a.b`는 set에서 `prepareCopy`를 통해 `copy_`를 만든다는 점이다.
:::

`markChanged`의 코드는 다음과 같다.
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
본인의 `modified_`를 변경하는 것과 더불어 부모객체의 `modified_`를 통해 root proxy까지의 `modified_`를 변경한다.
이렇게 root proxy까지 변경함으로써 root부터 leaf까지 어떤 객체가 변경되었는지를 찾아 갈 수 있다.

추가로 중간에 빠뜨렸던 `modified` 변경시의 edge case를 확인해보자.
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
변경 될 값(value)과 저장되어 있는 값(current)이 같고, `base_[prop]`가 값이 있다면 변경 할 필요가 없다고 판단하고 
`modified_`를 true로 만드는 과정을 중단하고 업데이트를 진행하지 않는다. 같은 값을 할당했을때 modified_를 변경하지 않음으로써 
불필요한 연산을 줄이려는 노력으로 보인다.

자 이제 set의 로직을 요약하면 다음과 같다.
1. `modified_`가 false라면 자신의 `copy_`를 `base_`에서 복사해주고 자신 포함 부모부터 루트까지의 `modified_`를 true로 만들어준다.
2. modified 여부와 관계없이 `state.copy_`에 변경할 값을 할당해준다.

### Recap of Proxy
immer에서 Proxy객체가 하는 역할을 정리해보자.
- 데이터를 참조할때 객체라면 Proxy 객체를 생성해준다. 객체에서 여러번 multi depth로 참조를 했을때  get은 순차적으로 진행되기 때문에 root 객체부터 target 객체까지 통하는 모든 객체가 proxy로 생성되게 된다. 덕분에 multi depth로 객체를 참조하였을때도 root와 동일한 Proxy 로직을 사용할 수 있게 된다.
- 데이터를 할당할때에는 `base_`를 `copy_`로 얕은 복사를 하고 `copy_` 객체에 변경되는 값을 업데이트한다. 이때, 변경된 적 없는 객체를 변경하는 것이라면 해당 객체부터 부모 객체를 거쳐 root 객체까지 modified를 모두 true로 설정한다.

## finalize
`recipe` 함수를 통해서 데이터를 모두 변경하였다면 이제 finalize 과정을 진행한다. `base_`와 `copy_`들을 적절하게 합쳐주는 과정인 것이다.
다시 produce 코드를 보자면 다음과 같다. <br/>
여기서 `return processResult(result, scope)` 에 대한 로직을 확인하는 것이다.

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
`finalize`과정은 크게 두가지로 나뉜다. `recipe`에서 return을 하는 경우와 아닌 경우이다.
이 두가지의 차이는 `finalize` 함수로 넣어주는 변수에 있다. `recipe`가 return을 하고 있다면 result값을 기준으로 finalize를 진행하고,
`recipe`가 return을 하지 않으면 root proxy를 기준으로 finalize를 진행한다.

### using finalize with root proxy
`recipe`가 return을 하지 않는다면 자동으로 root proxy를 사용해서 finalize를 진행한다.
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
여기서 value는 root proxy를 의미한다. 만약 root proxy가 `modified_`를 false로 갖고있다면 내부 객체는 한번도 변경된 적이 없다는 의미이다. 
따라서 `state.base_`를 그대로 리턴한다. 변경된 적이 있어서 `modified_`가 true라면  `finalized_`를 확인한다. finalize를 여러번 하는 것을 방지하기 위함이며,
finalized 로직을 들어가면 `finalized_`를 true로 변경하고 로직을 진행한다. proxy를 사용하지 않는 ES5 모드라면 여러 로직들이 진행되지만 proxy모드라면
`state.copy_`를 그대로 사용한다. `each`를 포함한 `finalizeProperty`는 root proxy 내부에 있는 자식 객체들을 모두 `finalize`하기 위한 동작이다. 
모든 자식 객체의 finalize를 완료하였다면 `state.copy_`를 리턴함으로써 immer로직이 종료된다.

### using finalize with return of recipe
`recipe`가 return 값을 가지고 있다면 return 값을 사용하여 finalize를 진행한다. 물론 return 값은 plain object이다.
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
plain object인 value에서 `value[DRAFT_STATE]`를 참조한다면 undefined일 수 밖에 없다. 따라서 `if (!state)` 로직으로 진행된다.
root proxy를 사용하는 finalize와 동일하게 `finalizeProperty`를 통해서 자식 객체들을 모두 finalize 과정을 진행한 뒤 value를 리턴한다.

이때, 자식 객체 모두 proxy객체가 아닌 plain object라고 생각할 수 있는데 `recipe` 내부에서 접근하는 객체의 경우 모두 Proxy의 get 동작에 의해서 
proxy로 변경되어 리턴되기 때문에 root는 proxy가 아니더라도 자식 객체는 proxy일 수도 있다. 따라서 자식 객체까지 모두 finalize 를 진행해주어야한다.



## Recap
- immer는 baseState 객체와 recipe 콜백함수를 받아서 recipe 내부 mutable한 로직들을 모두 수행하는데, 기존 객체는 변경하지 않고 업데이트 된 새로운 객체를 반환하는 것이다.
- immer는 baseState를 받으면 우선 baseState의 일반객체를 이용해서 Proxy객체로 만들어서 관리한다.
- Proxy객체는 여러 값을 갖고있지만 `base_`와 `copy_`두 객체를 내부적으로 관리하며 `base_`는 original data, `copy_`는 updated data로써 관리한다.
- 앞에서 만든 Proxy 객체로 recipe 콜백 함수 로직을 실행하는데, 여기서 mutable한 로직을 mutable하지 않게 수행하는 방법은 Proxy의 set과 get 등 객체 기본 동작들을 intercept하기 때문이다.
- Proxy의 get에서는 만나는 객체를 모두 Proxy로 리턴하여 객체 깊숙한 곳을 참조하더라도 Proxy를 생성할 수 있도록 만든다.
- Proxy의 set에서는 Proxy객체 내부에서 관리하고 있는 `modified_` flag를 보고 변경 여부를 관리하며 `base_`객체가 아닌 `copy_`객체를 업데이트한다.
- immer에서 Proxy의 set, get을 활용해서 recipe 로직을 모두 수행하고나면 Proxy객체의 정보를 이용해서 변경된 객체는 업데이트 된 객체(`copy_`)를 사용하고 변경되지 않은 객체는 기존 객체(`base_`)를 사용함으로써 structuring share를 사용하여 새로운 객체를 만들어서 리턴한다.

## Answer the question
:::tip Question
Q1. `immer`는 mutable하게 객체를 변경하는 것을 어떻게 immutable한 방식으로 바꾸어주고 있을까?
:::

A1. `immer`는 `new Proxy`를 사용하여 get과 set 로직을 intercept하기 때문에 객체를 mutable하게 변경하더라도 객체가 직접적으로 변경되지 않는다.
set로직에서 `base_`를 변경하지 않고 `copy_`로 shallow copy하여 `copy_` 객체에 업데이트를 진행한다.

모든 업데이트가 끝나면 값을 리턴할때 객체가 변경되었는지를 판단해서 `copy_`혹은 `base_`를 리턴함으로써 객체를 immutable하게 업데이트 할 수 있다.

:::tip Question
Q2. `immer`는 어떤 방식으로 structural sharing을 사용하는가?
:::

A2. `immer는` 객체의 변경여부에 따라서 `modified_`값을 관리한다. `modified_`가 true라면 객체가 업데이트 되었다는 것이다. 
`modified_` 값을 보고 true라면 `copy_`라는 새로운 객체를 리턴하여 새로운 reference를 사용하고, 
`modifed_`가 false라면 `base_` 객체, 기존 객체를 반환함으로써 기존 reference를 사용한다. 
따라서 변경된 여부에 대한 boolean을 관리하고 그 여부에 따라 기존 것을 사용하거나 새로운 것을 사용해서 structural sharing을 사용하고 있다.

:::tip Question
Q3. `immer`에서는 `produce`함수 내에서 객체를 직접 업데이트하는 방식이 아니라 return을 통해서 데이터를 업데이트하는 경우가 있는데, 이런 경우에 immer의 로직에 차이가 있을까?
:::

`produce` 함수 내에서 return을 하는지 아닌지 여부는 immer의 finalize, 업데이트 된 객체를 준비하는 과정에서 차이가 난다.
return을 하지 않은 경우는 `produce` 내부에서 객체를 직접 변경했다는 의미이고 그렇다면 immer에서 구현하는 Proxy로직인 get, set을 이용하여
객체를 업데이트 했다는 것이다. 그렇다면 이 글에서 알아보았던 `base_`, `copy_`, `modified_` 등 여러 변수와 로직들을 이용해서 객체 업데이트를 진행한다.

하지만, return을 한다면 어떻게 될까? `produce`에서 return 값이 존재한다면 immer에서 준비한 Proxy get, set 등 로직을 사용하지 않고 
결과값을 그대로 리턴하고 있다는 의미이다. 따라서 root proxy를 형성하고 get을 통해서 객체를 업데이트하고 set으로 `modified_`를 변경하는 등 로직을 모두
스킵하고 `finalize` 과정으로 넘어온다. 이는 immer의 대부분의 로직을 사용하지 않고 결과를 리턴한다는 의미이다.

두 방법 모두 객체를 immutable하게 관리하여 업데이트한다. 그리고 두 방식 모두 변경된 객체만 reference가 바뀌는 structural sharing을 사용하고 있다.
물론 두번째 방법, 업데이트 된 객체를 리턴하는 방식을 사용한다면 불필요하게 객체를 새로 만들지 않게 주의는 필요하다. 결과적으로 이야기하면 어느쪽이든 동일하다.
차이점을 고르자면 어떤 방식으로 객체를 변경하느냐에 대한 것일 뿐이다. 그렇다면 선택의 영역이다. 
mutable하게 변경하는 방식을 선택하느냐, immutable하게 변경하는 방식을 선택하느냐를 고민하면 된다. 

물론, 주관적인 의견을 이야기하자면 어떤 객체를 어떻게 업데이트 하고자하는지 목적에 따라서 업데이트하는 방식이 달라진다고 생각한다. 
따라서 immutable하게 변경하는 방식의 장단점, mutable하게 변경하는 방식의 장단점을 각각 이해하고, 상황에 맞게 혼용해서 사용을 하면 될 것이라고 생각한다.

## Reference
- [immer official docs](https://immerjs.github.io/immer/)
- [immer repository v9.0.6](https://github.com/immerjs/immer/tree/v9.0.6)
- [redux style guide](https://ko.redux.js.org/style-guide/style-guide/#use-redux-toolkit-for-writing-redux-logic) 
- [redux-toolkit guide](https://redux-toolkit.js.org/api/createReducer#direct-state-mutation)
- [[blog] Introducing immer: Immutability the easy way](https://medium.com/hackernoon/introducing-immer-immutability-the-easy-way-9d73d8f71cb3#3bff)
- [Proxy MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
