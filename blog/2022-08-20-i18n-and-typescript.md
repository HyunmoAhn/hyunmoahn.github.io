---
slug: i18n-and-typescript
title: i18n과 typescript
description: i18n and typescript
keywords:
  - i18n
  - typescript
  - web
  - Template Literal Types
authors: HyunmoAhn
tags: [i18n, typescript, template literal type]
---

프로젝트에서 typescript와 [i18next](https://www.i18next.com/)을 사용하는데, 
i18n JSON 파일의 type check를 강하게 사용할 필요성을 느끼게되어 관련 내용을 정리하고자한다.

먼저 i18n을 어떤식으로 활용하고 있었는지 소개한다.

i18n은 같은 화면에서 여러 언어로 된 Text를 보여주기 위해 사용하는 것으로, 하나의 key, 여러개의 value를 가지고 언어에 맞게 보여주는 것을 의미한다.

```tsx
const i18nJSON = {
  'simple-example': 'This is example text',
  'values-example': 'I need to show {0} value',
  'line-break-example': 'Hello. \n I am FE developer'
} as const
```
첫번째로 위와 같은 Key-Value 형태의 객체가 존재한다. 객체는 JSON이 될 수도 있고, typescript의 객체가 될 수도 있다.

```tsx
import i18n from 'i18next'

i18n.t('simple-example') // This is example text
i18n.t('values-example', [15]) // I need to show 15 value
i18n.t('line-break-example') // Hello <br /> I am FE developer
```
두번째로 `i18n.t`를 사용해서 key를 집어 넣어서 key에 맞는 string을 가져오며, 케이스에 따라서는 `values-example`과 같이 변수를 넣어 Text별로 맞는 value를 포함한 string을 리턴하는 경우도 있다.
마지막 `line-break-example`에서는 `\n` 줄바꿈 문자를 인식하여 `<br/>` 태그로 변환해서 React에서 줄바꿈을 할 수 있도록 사용하고 있다. 

:::caution
물론, 본 article은 i18next를 예시로 사용하고 있지만 i18next의 동작을 그대로 가져오지 않고 상황에 맞게 바꾸어 설명하고 있다. 그 점은 참고해서 article을 읽어주길 바란다.
:::

여기서, `i18n.t`에서 return 된 값에 대해서는 어떤 식으로 나오는지 알 수 있다. 그렇다면 각 return 된 값의 type은 어떻게 될까?
```json
- This is example text // string
- I need to show 15 value // string
- Hello <br /> I am FE developer // ReactElement
```
첫번째 두번째는 string 타입이라고 보아도 무방하다. 하지만 세번째 `line-break-example`를 사용하는 경우는 ReactElement가 리턴된다.
`React`에서 string으로 줄바꿈을 그리기 위해서는 [dangerouslySetInnerHTML](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)를 사용해야하지만, 이는 한계가 있으므로 string 대신에 ReactElement인 컴포넌트로 리턴하도록 만든 것 이다.

만약 `values-example`의 인자로 `15`가 아니라 a tag와 같은 컴포넌트를 넣는다면, `values-example`의 리턴 타입 또한 달라진다.
```tsx
import i18n from 'i18next'

i18n.t('values-example', [15]) 
// I need to show 15 value
// string

i18n.t('values-example', [<a href="/about">more</a>]) 
// I need to show <a href="/about">more</a> value
// ReactElement
```
위와 같이 같은 `values-example`을 사용하더라도 values로 어떤 값이 오느냐에 따라서 타입이 달라져야한다. `a tag` 또한 `<br/>`과 마찬가지로 string이 아니라 ReactElement인 컴포넌트로 리턴해야 하기 때문이다. 

자, i18n 리턴 값이 상황에 따라 string, ReactElement 달라진다는 것을 알았다. 이런 타입핑이 안될때 어떤 경우에 문제가 발생할까?

```tsx
<input 
  type='input' 
  placeholder={i18n.t('line-break-example')} // type error  
/>
```
여러가지 경우가 있겠지만, 대표적으로는 HTML tag를 사용할 떄 string으로 정의 된 attribute에 string이 아닌 i18n 값이 포함 될 수 있다. 이러면, placeholder에 xlt value 대신 `[object Object]`가 보이게 된다.

물론, placeholder에 a tag가 들어가거나 \n 같은 줄바꿈이 들어가는 케이스가 명백히 이상하다. 하지만 i18n key를 잘못 사용하는 경우도 있고, i18n text가 잘못 등록 된 경우도 있을 수 있다.

typescript를 사용하는데 타입이 제대로 추론 되지 않는 다는 점에 있어서 위와 같은 문제점이 있고 또 다른 문제를 야기 할 수 있다.

이번 article에서는 i18n text의 format 별로 타입을 정의하는 방법에 대해서 이야기 해 볼 예정이다. i18n을 예로 들었지만 기본적으로는 typescript [Template Literal Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html)과 관련된 이야기이다.

:::info 사전지식
- typescript 4.1+
- Template Literal Types에 대한 관심
- i18 system 사용 경험 (optional)
:::

<!--truncate-->
## 어떤 것을 이야기 할 것인지

## 사전 지식

## 어떤 상황에서 필요한지

## 목표

### 줄바꿈 
### Values