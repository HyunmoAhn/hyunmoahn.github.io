---
slug: deep-dive-to-immer
title: immer 내부 살펴보기
description: redux에서 주로 사용되는 immer는 mutable한 객체 업데이트를 immutable하게 사용하는 것 처럼 도와준다. 어떻게 이런 로직이 가능한걸까?
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

이 글은 기본적으로 [immer](https://immerjs.github.io/immer/)에 대해서 알아보는 시간을 가진다. 만약 immer를 잘 모르는 분들은 [아래 챕터](#immer는-무엇이고-왜-사용하는걸까)를 먼저 읽어보는 것을 권장한다.

## 무엇이 궁금할까?

:::tip Question
Q1. `immer`는 객체 mutable하게 바꾸는 방식을 어떻게 immutable한 방식으로 바꾸어주고 있을까? 
:::
immer는 mutable하게 변경하는 객체 built-in method를 사용하더라도 immutable하게 데이터를 반환해주는 기능을 한다. 이 기능이 내부적으로 어떤 방식으로 이루어지는지 알아본다.

아래 코드 예시는 [immer 공식 문서](https://immerjs.github.io/immer/#a-quick-example-for-comparison)에 존재하는 basic example을 가져온 것이다.
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
Q2. `immer`는 어떻게 structural sharing을 사용하는걸까?

*`structural sharing`: 객체를 copy할 때 변경되지 않은 객체는 reference를 동일하게 사용하는 방식.
:::

객체를 immutable하게 업데이트 한다는 것은 기존 객체를 새로운 객체로 복사한다는 것이다. 즉, 복사에 비용이 발생한다. 
immer는 객체를 복사할 때, 변경되지 않은 reference는 재사용하는 structural sharing 방식을 사용해서 객체를 복사한다. 
immer에서는 어떤방식을 사용해서 structural sharing을 사용하고 있는지 알아본다.

:::tip Question
Q3. immer에서는 produce함수 내에서 draft를 직접 업데이트하는 방식이 아니라 return을 통해서 데이터를 업데이트하는 경우가 있는데, 이런 경우에 로직이 다른지?
:::

immer를 사용할 때, 위에서 제시한 mutable한 객체 변경 방식이 아닌, 새로운 객체를 리턴하는 경우가 있다.
이는 immer와는 무관하게 immutable하게 Javascript에서 객체를 반환해주는 방식과 동일하다.
immer에서는 이러한 방식을 [공식적으로 허용](https://immerjs.github.io/immer/return)하고 있고 
두 방식, mutable하게 객체를 변경하는 방식과 immutable하게 객체를 변경시키는 방식 모두 혼용해서 쓰는 개발자도 많을 것 이다. 
이러한 방식 차이는 immer에서 어떤 로직차이를 발생시키는지 알아본다. 

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


:::info 사전지식
- immer 혹은 redux-toolkit을 사용해 본 경험
- [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)에 대한 이해 (optional)
:::

<!--truncate-->

## Immer는 무엇이고, 왜 사용하는걸까?

***immer를 왜 사용하는지 잘 이해하고 있다면 지루한 이야기가 될 수 있다. 알고 있다면 [다음 챕터로 넘어가자](#사용법).***

[immer](https://immerjs.github.io/immer/)란 무엇인가? immer 공식 문서에서의 소개 문구를 가져와보자.

> `Immer` (German for: always) is a tiny package that allows you to work with immutable state in a more convenient way.

immer는 javascript에서 data가 immutable하게 업데이트 되는 것을 보장해주는 라이브러리이다.

그렇다면 immer는 어디서 쓰이고 있을까? <br/>
redux의 style guide에서는 [redux-toolkit을 사용하는 것을 권장](https://ko.redux.js.org/style-guide/style-guide#use-redux-toolkit-for-writing-redux-logic)하고 있고 immutable data 관리를 위해서는
[immer를 사용하는 것이 좋다고 권장](https://ko.redux.js.org/style-guide/style-guide#use-immer-for-writing-immutable-updates)하고 있다. 
물론 [redux-toolkit](https://redux-toolkit.js.org/)에는 immer를 사용하고 있으므로 redux-toolkit을 
사용하고 있다면 이미 redux에 immer를 사용하고 있는 것이다.

왜 immutable data를 사용해야하는가는 [redux의 FAQ항목](https://ko.redux.js.org/style-guide/style-guide#use-immer-for-writing-immutable-updates)을 참고하는 것이 좋다. <br/>
내용을 간략하게 설명하자면, 다음과 같다. <br/>
javascript에서는 primitive한 타입의 변수(number, string, etc)를 제외하면 모두 mutable한 속성을 가진다. 
non-primitive한 타입은 object, array와 같은 것들이 있다. 
non-primitive한 타입의 변수는 변경되어도 변수의 reference가 바뀌지 않는다. 따라서 object 내부가 변경되더라도 reference가 변경되지 않는 것이다.

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
[redux](https://redux-saga.js.org/)에서는 shallow equality checking을 사용하고 있다. shallow equality checking은 데이터가 동일한지 비교할 때, 
데이터 내부가 변경되었는지를 확인하는 것이 아니라 데이터의 reference가 변경되었는지만 체크를 하고 동일하면 변경되지 않았다고 판단하는 것이다.

만약 deep equality checking을 사용하면 모든 객체를 하나씩 비교해야하기 때문에 성능상 손해를 보게된다. 
그래서 object값을 변경할 때 reference도 변경되는 것을 보장하는 immutable data를 사용하게 되었고 어떤 변경이더라도 객체가 immutable함을 보장해주는 immer를 사용하게 되는 것이다.

만약 따로 immer를 의식적으로 사용한 적이 없더라도, redux를 사용하는데 redux-toolkit을 사용하고 있다면
이미 immer를 사용하고 있는 것이다.

## 사용법
immer의 내부를 확인하기 전에 immer를 어떻게 사용하는지 한번 확인해보자.
다음은 [immer docs](https://immerjs.github.io/immer/#a-quick-example-for-comparison)에 나와 있는 예제이다.

- baseState를 immutable하게 변경하는 방법에 대한 비교.
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
immer를 사용하지 않으면 복사 → 업데이트 과정을 진행하고, 이 과정에서 mutable하게 변경되진 않는지 확인해야하는 반면, 
immer의 `produce` 를 사용하면 어떤 방식으로 사용하더라도 data가 immutable하다는 것을 보장 할 수 있다.

만약 immer를 직접 사용해 본 적 없고, [redux-toolkit](https://redux-toolkit.js.org/)을 사용해서 redux를 사용하였다면 immer를 이미 사용하고 있는 것이다.
잘 모르겠다면 redux-toolkit에서 state를 mutation하는 [방법에 대한 문서](https://redux-toolkit.js.org/api/createReducer#direct-state-mutation)를 읽어보자.

## deep-dive 전 immer에 대해서
먼저 immer의 원리를 이야기 해볼 예정이다. 
여기서 설명하는 내용은 [immer의 문서](https://immerjs.github.io/immer/#how-immer-works)와 문서의 FAQ에 링크되어 있는 
[blog 글](https://medium.com/hackernoon/introducing-immer-immutability-the-easy-way-9d73d8f71cb3#3bff) 을 참고하면 더 쉽게 이해할 수 있을 것이다.

### immer는 원래 객체를 변경시키지 않는다.
immer는 객체를 직접 변경하지 않고 original data(`base_`)를 그대로 두고, copy data(`copy_`)를 생성하고 변경하는 동작을 진행한다. 
이런 원리를 이용해서 기존 데이터를 변경하지 않은 채 변경된 데이터를 리턴한다.

### immer는 객체가 변경되었는지를 기록한다.
immer는 객체를 변경할 때 modified flag를 `true`로 설정한다. 
만약 객체 트리의 깊숙한 곳이 변경되었다면 변경된 자신을 포함하여 root 트리까지 modified flag를 변경하여 root에서도 객체 트리의 끝까지 순회할 수 있도록 조정한다.

객체 변경과정을 마친 뒤에는 modified flag를 확인하여 변경된 객체들만 copy data(`copy_`)를 사용하고 
modified 되지 않았다면 original data(`base_`)를 사용해서 기존 reference를 재사용함으로써 structural share를 사용한다.

### Recap
즉, 정리하자면 다음과 같이 3줄로 정리된다.

- original data와 copy data 2가지 객체를 관리하여 원본을 보존하고 copy data만 변경한다.
- 변경한 객체는 modified flag를 켜서 root tree에서 leaf tree까지 순회할 수 있도록 한다.
- 변경이 완료된 뒤 modifed flag를 이용해서 새 객체와 기존 객체를 합성하는 과정을 진행한다.


## Deep dive to immer
자, immer로 deep dive 해보자. <br/>
immer 로직을 확인해보려면 usage에서 사용했던 `produce` 함수를 먼저 살펴봐야한다.

```tsx
// https://github.com/immerjs/immer/blob/v9.0.6/src/immer.ts#L23-L45
const immer = new Immer();
export const produce = immer.produce;
export default produce;
```
produce함수는 `Immer` 클래스의 메소드 함수이다. `Immer` class 안을 살펴보자.

produce함수에서 curring 함수 대응과 여러 예외 케이스를 제외하면 다음과 같이 축소된다.

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
`produce` 함수가 생각보다 간단하니, 여기서 produce 함수 로직의 순서를 짚고 넘어가자.
1. `produce` 함수는 기존 객체(`base`)와 객체를 어떻게 변경시킬지 결정하는 함수(`recipe`)를 인자로 받는다.
2. `scope`를 생성한다.
3. `proxy`를 생성한다.
4. `proxy`를 이용해서 `recipe`를 실행시킨다.
5. `processResult`를 이용해서 업데이트 된 최종 객체를 리턴한다.

여기서 의문을 가져야하는 점은 mutable하게 변경시키는 로직이 `recipe`에 포함되어 있고 `recipe`는 단순히 호출될 뿐이라는 것이다. 
하지만 `recipe` 내부의 mutable한 변경로직은 대상 객체를 직접 변경하지 않고 immutable을 보장시켜준다.

비밀은 `proxy`에 있을 것 같다. 실제로 `proxy`를 만들 때 [new Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)를
사용하고 있고, 이 `new Proxy`가 immer의 주요 로직에 key point로 작용한다.

차근차근 하나씩 살펴보자.

### scope
scope는 immer 전역에서 사용할 정보들을 저장하는 객체이다. immer의 기본동작에는 크게 쓰이지 않으므로 어떤 데이터를 저장하고 있는지만 훑고 넘어가자.

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
`drafts_`는 나중에 만드는 `proxy` 를 생성할 때 하나씩 담기는 배열이고 `immer_`는 immer 클래스를 담는 공간이다.

### proxy
immer의 핵심이 되는 `proxy`에 대해서 확인해보자.

immer에서는 Object 뿐 아니라 Array, Map, Set 그리고 Proxy를 쓰지 못하는 경우(ES5)까지 대응하므로 코드가 복잡해보이는데,
Object만으로 한정해서 본다면 로직이 조금 간단해진다.

```tsx
// https://github.com/immerjs/immer/blob/v9.0.6/src/core/immerClass.ts#L212-L229
export function createProxy(immer, value, parent) {
  const draft = createProxyProxy(value, parent);
  const scope = getCurrentScope();
  
  scope.drafts_.push(draft);
  return draft;
}
```
proxy를 어떻게 만드는지는 `createProxyProxy` 함수를 한번 더 들어가야 확인할 수 있겠지만, 
여기서 주목할 점은 `scope.drafts_` 에 생성한 proxy를 넣어둔다는 것이다. 맨 처음 만든 proxy가 root proxy이기 때문에 
나중에 rootProxy를 획득할 때 `scope.drafts_[0]`를 참조할 예정이다.


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
`createProxyProxy`에서는 immer 동작에 사용할 여러 메타 데이터들과 새 `Proxy`객체를 생성한다.
immer에서 쓰이는 메타데이터는 다음과 같이 정리된다.
- `base_`: 기존 data. produce에서 첫번째 인자로 들어왔으며 변경되기 이전 원본 데이터를 여기에 저장한다.
- `copy_`: 업데이트 된 data. 원본 데이터와 `recipe`를 이용해서 업데이트 된 데이터를 여기에 저장한다. 아직은 아무 데이터도 저장되어 있지 않다.
- `draft_`: `draft_` 는 여기서 생성되는 `Proxy` 객체를 저장한다. 앞으로의 로직에서 `draft_.base_`나 `draft_.copy_`와 같은 방법으로 데이터를 참조하게 된다.
- `modified_`: 객체가 변경되었는지 여부를 저장한다. 기본 값은 객체가 변경되지 않았으므로 `false` 이다.
- `finalized_`: proxy가 업데이트가 완료되어 return 될 준비가 되었는지를 저장한다. 기본 값은 객체가 준비 중이므로 `false` 이다. 
- `parent_`: 객체는 multi depth로 구성될 수 있다. 만약 객체가 트리 형태로 구성된다면 부모 객체를 이 곳에 저장하게 된다. root proxy에서는 부모가 없다.

주요 메타데이터들은 위에서 정리한 정도이다. 메타 데이터의 기본 값을 설정하고 `Proxy.revocable`과 `traps`를 이용해서 Proxy 객체를 생성한다. Proxy에 대해서는 다음 챕터에서 알아보자.

:::info 용어 정리
### proxy? Proxy?
앞으로 immer에서 meta 데이터를 포함해서 `new Proxy` 객체를 포함하는 변수 `proxy`를 언급하기도 하고,
용어 그대로 Javascript에서 object에 대한 여러 기본 동작을 제어하기 위한 객체 `Proxy`를 언급하기도 할 예정이다.
공교롭게도 두 용어가 "프록시" 로 동일한 용어이기 때문에 이 글에서는 다음과 같이 `p` 대, 소문자 유무로 구분해서 사용할 예정이다.
- `proxy`: immer에서 생성한 메타 데이터와 `new Proxy`로 생성한 draft를 포함하고 있는 객체.
- `Proxy`: javascript에서 제공하는 built-in 객체. Object의 여러 기본 동작을 제어하기 위한 객체로 쓰인다.
:::

### new Proxy
***이번 챕터에서는 [new Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)가
어떤 것인지 알아보는 시간을 가질 것이다. Proxy에 대해 익숙하다면 [다음 챕터로 넘어가도 무관하다](#traps-of-immer).***

우리는 이전 챕터에서 `Proxy.revocable` 을 이용해서 Proxy 객체를 만들었다.

[MDN 문서](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)에서 Proxy에 대해 정의한 내용은 다음과 같다.

> The Proxy object enables you to create a proxy for another object, which can intercept and redefine fundamental operations for that object.

Proxy 객체는 object의 기능, set과 get과 같은 기능들을 intercept하거나 redefine을 하는 새로운 객체를 생성한다.
immer에서는 원본 객체로 Proxy 객체를 만들어 원본 객체를 get, set할 때 직접적으로 객체를 변경하는 것이 아니라 다른 방식으로 업데이트를 하게끔 로직을 
intercept하는데 Proxy를 사용하고 있다.

예를들어서 Object가 있고 set을 할때 설정한 값을 2배로 만들고 싶다면 다음과 같이 사용하면 된다.

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
`proxy.a`에 할당할 때 일반 객체의 set을 사용하는게 아니라 `Proxy` 객체를 만들때 등록했던 `handler.set`의 로직을 따르게 된다. 
set하는 value가 10이기 때문에 `proxy.a` 에는 10이 아닌 20이 저장된다. value가 number가 아닐때의 동작에서 쓰이는 `Reflect` 는 기존 로직을 따르게 할 때 사용한다.

자, 만약에 `proxy.b` 객체에 추가로 값을 할당하면 어떻게 될까? `handler.set`이 사용되어 40이 할당될까? 아니면 그대로 20이 할당될까?
```tsx
proxy.b.c = 20

console.log(proxy.b.c) // 20? 40?
```
정답은 20이다. 그 이유는 `proxy`는 Proxy 객체이지만, `proxy.b`는 Proxy 객체가 아니라 일반 객체이기 때문이다. 
따라서 `handler.set`을 사용하지 않고 일반 객체의 set을 사용하여 그대로 20을 할당하고 있는 것이다.

이러한 동작은 immer에서 critical하게 작용된다. 객체를 변경하는 과정에서 몇 depth가 되는 자식 객체를 바로 변경하는 케이스가 많을 것이기 때문이다. 

따라서 다음과 같은 방법으로 이를 대응한다.
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
Proxy를 만들때 set뿐 아니라 get에서도 커스텀 로직을 추가한다. Proxy 객체에서 값을 가져올 때 일반 객체를 가져온다면 Proxy 객체를 만들어서 가져오게끔 하는 것이다.
이렇게 되면, `proxy` 객체도 Proxy 객체이고, `proxy.b`도 `handler.get`을 사용해서 일반객체가 아닌 Proxy객체를 반환한다. 
따라서 `proxy.b.c`에 20을 할당한다면, `proxy.b`는 Proxy 객체이므로 `handle.set` 로직을 사용하여 `proxy.b.c`에는 20이 아닌 40이 할당되게 되는 것이다.

이러한 get과 set의 동작을 이용해서 immer에서는 get에서는 깊숙한 객체를 참조할때에도 Proxy를 참조할 수 있게끔, 
set에서는 객체를 직접 변경하지 않고 `base_`와 `copy_`를 이용하는 로직을 사용하고 있다. 다음 챕터에서 어떻게 구현되어 있는지 알아보자.

:::tip `latest`와 `peek`에 대해서
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
2. draft가 Proxy 객체이고 `copy_` 를 갖고 있을 경우
    - `copy_.[prop]`를 리턴한다.
3. draft가 Proxy 객체이고 `copy_` 를 갖고 있지 않은 경우
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
`state.copy_`를 복사해서 만들고, `state.copy_[prop]`에 새로운 proxy를 생성하여 저장한다.
이때부터 `base_`와 `copy_`가 가지고 있는 값들이 같지 않게 된다. 

이러한 로직을 통해서 deep tree를 참조하더라도 객체인 경우 proxy를 가져올 수 있도록 구현해놓았다.

자 그렇다면, 한번 get으로 proxy를 만든 객체를 다시 참조하면 다시 proxy 객체를 만들까? 
당연한 말이지만 한번 proxy를 만든 객체라면 기존에 만들어 둔 것을 재사용한다.
재사용할 수 있게끔 검사를 하는 로직이  `value === peek(state.base_, prop)` 의 분기이다.

##### 이미 생성한 proxy의 재사용 (`value === peek(state.base_, prop)`)

`peek(state.base_, prop)`는 `base_`의 prop를 의미하고, `value`는 `copy_` 혹은 `base_`의 prop를 의미한다. 
`copy_`가 생성되기 전, 즉 get을 한 적이 없다면 항상 `base_`와 `base_`를 비교하므로 항상 true이고 proxy를 만드는 로직을 항상 실행 할 것이다.
하지만, get을 한 적이 있고 `copy_`가 만들어진 상태라면 `copy_` 와 `base_`를 비교한다.
이전 get로직에서 `copy_[prop]`에 proxy를 할당하여 이미 `base_`와 값이 달라졌기 때문에 proxy를 만드는 로직을 스킵하고 그대로 `state.copy_`를 리턴한다.
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
이 과정에서 새로운 값이 `copy_`에 저장되어 있는 값과 reference가 같다면 업데이트를 진행하지 않는다. 이로써 불필요한 업데이트는 방지하고 있는 것도 확인 할 수 있다.

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
set을 진행할 때 `modified`가 false 상태라면 변경 로직을 진행한다. edge로직을 제외하고 기본로직만 본다면 `prepareCopy`와 `markChanged` 함수를 실행한다.

:::info
#### get에서의 `prepareCopy`와 set에서의 `prepareCopy`

이전에 get을 진행할 때 `prepareCopy`를 사용하는 걸 보았다. get할때 copy를 진행하고 set할때도 copy를 진행하는걸까?

자세히보면 get의 `prepareCopy`와 set의 `prepareCopy`는 목적이 다르다.
get의 `prepareCopy`는 참조할 객체의 부모객체를 copy하는 동작을 하고, set의 `prepareCopy`는 참조하는 객체 본인를 copy하는 동작을 한다.
예를들어, 만약 `proxy.a.b = { ... }`로 객체를 변경한다면 `proxy.a` 까지는 get에서 `prepareCopy`를 통해 `copy_`를 만들고, 
`proxy.a.b`는 set에서 `prepareCopy`를 통해 `copy_`를 만든다.
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

### root proxy를 사용하는 finalize
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

### recipe의 return을 사용하는 finalize
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
- immer는 baseState를 받으면 우선 baseState를 Proxy객체로 만들어서 관리한다.
- proxy 객체는 여러 값을 갖고있지만 `base_`와 `copy_`두 객체를 내부적으로 관리하며 `base_`는 original data, `copy_`는 updated data로써 관리한다.
- 앞에서 만든 Proxy 객체로 recipe 콜백 함수 로직을 실행하는데, 여기서 mutable한 로직을 mutable하지 않게 수행하는 방법은 Proxy의 set과 get 등 객체 기본 동작들을 intercept하기 때문이다.
- proxy의 get에서는 만나는 객체를 모두 Proxy로 리턴하여 객체 깊숙한 곳을 참조하더라도 Proxy를 생성할 수 있도록 만든다.
- Proxy의 set에서는 Proxy객체 내부에서 관리하고 있는 `modified_` flag를 보고 변경 여부를 관리하며 `base_`객체가 아닌 `copy_`객체를 업데이트한다.
- immer에서 Proxy의 set, get을 활용해서 recipe 로직을 모두 수행하고나면 Proxy객체의 정보를 이용해서 변경된 객체는 업데이트 된 객체(`copy_`)를 사용하고 변경되지 않은 객체는 기존 객체(`base_`)를 사용함으로써 structuring share를 사용하여 새로운 객체를 만들어서 리턴한다.

## 궁금증 해소
:::tip Question
Q1. `immer`는 mutable하게 객체를 변경하는 것을 어떻게 immutable한 방식으로 바꾸어주고 있을까?
:::

A1. `immer`는 `new Proxy`를 사용하여 get과 set 로직을 intercept하기 때문에 객체를 mutable하게 변경하더라도 객체가 직접적으로 변경되지 않는다.
set로직에서 `base_`를 변경하지 않고 `copy_`로 shallow copy하여 `copy_` 객체에 업데이트를 진행한다.

모든 업데이트가 끝나면 값을 리턴할때 객체가 변경되었는지를 판단해서 `copy_`혹은 `base_`를 리턴함으로써 객체를 immutable하게 업데이트 할 수 있다.

:::tip Question
Q2. `immer`는 어떤 방식으로 structural sharing을 사용하는가?
:::

A2. `immer`는 객체의 변경여부에 따라서 `modified_`값을 관리한다. `modified_`가 true라면 객체가 업데이트 되었다는 것이다. 
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
