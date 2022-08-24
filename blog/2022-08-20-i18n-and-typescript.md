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

## Intro
먼저 i18n을 어떤식으로 활용하고 있었는지 소개하자면 다음과 같다.

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
import tFunction from 'utils';

tFunction('simple-example') // This is example text
tFunction('values-example', [15]) // I need to show 15 value
tFunction('line-break-example') // Hello <br /> I am FE developer
```
두번째로 `tFunction`를 사용해서 key를 집어 넣어서 key에 맞는 string을 가져오며, 케이스에 따라서는 `values-example`과 같이 변수를 넣어 Text별로 맞는 value를 포함한 string을 리턴하는 경우도 있다.
마지막 `line-break-example`에서는 `\n` 줄바꿈 문자를 인식하여 `<br/>` 태그로 변환해서 React에서 줄바꿈을 할 수 있도록 사용하고 있다. 

:::caution
본 article은 i18n을 적용하기 위한 방법으로 `tFunction`이라는 함수를 가져다 쓴다. 
JS로직이 아닌, Type 레벨에서의 내용을 주로 다루기 때문에 실제 내부 로직이 어떻게 되는지는 다루지 않을 예정이다. 
[i18next.t](https://www.i18next.com/overview/api#t)와 같은 함수와 같은 역할을 한다고 보면 될 것이다.
:::

여기서, `tFunction`에서 return 된 값에 대해서는 어떤 식으로 나오는지 알 수 있다. 그렇다면 각 return 된 값의 type은 어떻게 될까?
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

tFunction('values-example', [15]) 
// I need to show 15 value
// string

tFunction('values-example', [<a href="/about">more</a>]) 
// I need to show <a href="/about">more</a> value
// ReactElement
```
위와 같이 같은 `values-example`을 사용하더라도 values로 어떤 값이 오느냐에 따라서 타입이 달라져야한다. `a tag` 또한 `<br/>`과 마찬가지로 string이 아니라 ReactElement인 컴포넌트로 리턴해야 하기 때문이다. 

자, i18n 리턴 값이 상황에 따라 string, ReactElement 달라진다는 것을 알았다. 이런 타입핑이 안될때 어떤 경우에 문제가 발생할까?

```tsx
<input 
  type='input' 
  placeholder={tFunction('line-break-example')} // type error  
/>
```
여러가지 경우가 있겠지만, 대표적으로는 HTML tag를 사용할 떄 string으로 정의 된 attribute에 string이 아닌 i18n 값이 포함 될 수 있다. 이러면, placeholder에 xlt value 대신 `[object Object]`가 보이게 된다.

물론, placeholder에 a tag가 들어가거나 \n 같은 줄바꿈이 들어가는 케이스가 명백히 이상하다. 하지만 i18n key를 잘못 사용하는 경우도 있고, i18n text가 잘못 등록 된 경우도 있을 수 있다.

typescript를 사용하는데 타입이 제대로 추론 되지 않는 다는 점에 있어서 위와 같은 문제점이 있고 또 다른 문제를 야기 할 수 있다.

이번 article에서는 i18n text의 format 별로 타입을 정의하는 방법에 대해서 이야기 해 볼 예정이다. i18n을 예로 들었지만 기본적으로는 typescript [Template Literal Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html)과 관련된 이야기이다.

:::info 사전지식
- typescript 4.1+ 에 대한 전반적인 지식
- Template Literal Types에 대한 관심
- i18 system 사용 경험 (optional)
:::

<!--truncate-->

## Goal
i18n을 사용하면서 줄바꿈, 변수 등을 대응하기 위해서는 룰을 정해야한다. 프로젝트마다 다르겠지만, 내가 경험했던 프로젝트는 모두 i18n text를 입력하는 주체가 개발자가 아니었기 때문이다.
따라서, 줄을 바꾸고 싶을때는 `\n`을 집어넣는다. 상황에 따라 달라지는 값을 끼워넣고 싶다면 `{}`를 사용한다 와 같은 rule 말이다.

우리가 사용하고 있는 i18n rule에 대해서 먼저 설명을 하고, rule에 대해서 type을 어떻게 정할지 이야기 해 볼 예정이다.

### I18n Rule

#### 줄바꿈
i18n text에서 줄을 바꿔서 보여주고 싶을때는 줄을 바꿀 부분에서 `\n`를 넣어준다.

```json
// i18n text json
{
  "lineBreak": "Hello. \n I am FE developer"
}

// displayed text
Hello
I am FE developer
```

#### 변수
i18n text에서 정적인 텍스트가 아니라 상황에 따라 다른 Text, 즉 개발 코드의 변수를 넣어주고 싶다면 `{}`를 감싸서 사용한다.
하나의 i18n text에 여러개의 변수를 넣을 수 있기 떄문에 `{}`안에 string을 0부터 시작하여 1씩 늘려간다.
```json
// i18n text json
{
  "oneValue": "This product is {0}.",
  "unit": "${0}",
  "twoValue": "This product is {0} and it will be delivered after {1} days"
}
```
```tsx
import tFunction from 'utils';

tFunction('oneValue', [tFunction('unit', [1000])])
// This product is $1000.

tFunction('twoValue', [tFunction('unit', [500]), 3])
// This product is $500 and it will be delivered after 3 days
```

#### 링크
만약 i18n text에 링크를 포함하고 싶을때도 변수와 같은 방식을 사용한다. `{}`를 감싸서 사용하고, link에 보여줄 text는 별도의 i18n text로 만들어서 사용한다.  
```json
// i18n text json
{
  "link": "click",
  "linkText": "{0} to show more information"
}
```
```tsx
import tFunction from 'utils';

tFunction('linkText', [<a href="/more">{tFunction('link')}</a>])
// <a href="/more">click</a> to show more information 
```

### I18n Return Type
그렇다면 위 케이스들에 대해서 `tFunction`은 어떤 타입으로 return 되는 것이 이상적일까?

```tsx showLineNumbers
import tFunction from 'utils';

tFunction('lineBreak') 
// Hello <br /> I am FE developer
tFunction('oneValue', [tFunction('unit', [1000])])
// This product is $1000.
tFunction('twoValue', [tFunction('unit', [500]), 3])
// This product is $500 and it will be delivered after 3 days
tFunction('linkText', [<a href="/more">{tFunction('link')}</a>])
// <a href="/more">click</a> to show more information 
```
L3 케이스를 보자.

L3은 `<br />`을 포함하고 있기 때문에 일반 string으로 추론되면 안된다. 따라서 i18n text에 `\n` 같은 줄바꿈이 있다면 `ReactElement`로 타입이 추론되어야 한다.

L5, L7는 `values({0}, {1})`가 들어가 있지만 추가로 들어간 value 역시 string 혹은 number이다. 따라서 `string`으로 추론되어도 된다.

마지막 L9는 L5, L7과는 조금 다르다. values로 a tag가 포함되었고 이를 그려주기 위해서는 `ReactElement`로 타입이 추론되어야한다.

### Recap of Goal
따라서 목표를 정리하자면 다음과 같다.
- i18n key에 따라서 `tFunction`의 return 타입이 추론되어야한다.
- `tFunction`의 return 타입은 i18n key에 매칭되는 i18n value에서 가지고 있는 포맷에 따라 달라진다.
  - i18n value에서 `\n` 줄바꿈 키워드를 가지고 있다면 `ReactElement`로 추론한다.
  - i18n value에서 `{}` 변수 키워드를 가지고 있고, 변수로 string과 number 같은 값이 들어온다면 string으로 추론한다.
  - i18n value에서 `{}` 변수 키워드를 가지고 있고, 변수로 string과 number 가 아닌 값이 들어온다면 ReactElement으로 추론한다.
- 추가로, 해당 i18n value가 `{}` 변수 키워드를 가지고 있는지 여부, 몇개를 가지고 있는지 여부에 따라 `tFunciton`의 2번째 parameter에 타입을 체크했으면 좋겠다.

## Type 정의
자, 이제 우리는 위 조건에 맞추어서 `tFunction`의 return type을 채워 나갈 예정이다.
아래 코드 예시를 보자. ([playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAJQKYEMDG8BmUIjgcilQ3wG4AoctCAOwGd5gBGADhoCk7a4BeOAb3Jw4AIjqgwAGyQiAXKIASSSZIhwA6tEkATEQBohoycBpIAQkRQBrOYuWqAdHAA6NOAEk4KPADEAonDaSABuyhBgSFD6hiK0SABqKJIArjLyIgAqABbAdHBgONrJGHC5AgAMAL4O0cIiyTTAMLYiACT8VbWiMADuEIkpaaLZZQUQRSVlHZVeNNql8D3AKnAARkiBysChRPMomDCRAkwz2igAnnRdIsY0Nuloxmg2BnW3VhlIAB7N6dNwMDUdCyEB6cBA0A2Jkw0BAKBgwFoInIMxQeWo9BgFHIMHOEQ8rA4XDcfFxEQgmFKhM4tAoZI27kJAGkkOdeHArKyKQS2DSaNj6XAMj4GhhESS4AAKTnneSMtgs856ODBJKpOgAfnkKBo5wAlLwAHxwBhQEwAc0oGIYAJFNDFtHkwtFCO4fGlrLlzNZytVgzo2t1Bp4xuYvOJAG0ZQBdUhwK20G3icDSdkwO0OmiS-DJqRIfB6uNURPwW7mSxWNMZ11Z-BliyoKwFijW+BxAapKsu8XZ9tq-PKiPp7u0bMNJr4ZUAVnK5T10cLxcxAL6HY2pOrPfwvX6-cncCHm9H+HHMH3EZn5QXyoAzAuWyW4O9Pj8u-aa9nn98z4OADwoOAsiITAeBEAB6FBVggZJmkNfhh3fLd3gLSpfwgw0F3IIA))

```tsx showLineNumbers
import React from 'react';

const i18nJson = {
  "simple": "Hello World",
  "lineBreak": "Hello. \n I am FE developer",
  "oneValue": "This product is {0}.",
  "unit": "${0}",
  "twoValue": "This product is {0} and it will be delivered after {1} days",
  "link": "click",
  "linkText": "{0} to show more information"
} as const;

type I18nJson = typeof i18nJson;
type I18nKey = keyof I18nJson;

type TFunction = (key: I18nKey, values?: any) => string

const tFunction: TFunction = (key: I18nKey, values: any) => i18nJson[key]; 

const simple = tFunction('simple'); // string
const lineBreak = tFunction('lineBreak'); // string
const oneValue = tFunction('oneValue', [tFunction('unit', 500)]); // string
const twoValue = tFunction('twoValue', [tFunction('unit', [500]), 3]); // string
const linkText = tFunction('linkText', [<a href="/about">{tFunction('link')}</a>]) // string
```
이전까지 예제로 사용했던 i18n text 예제들이 모두 `i18nJson`에 포함되어 있고, 이는 `I18nJson`과 `I18nKey`로 각각의 타입으로 추론된다.
이는, `TFunction` 함수 타입을 정의하고, 이를 `tFunction`에 사용한다. 현재는 모두 string 타입으로 리턴하고 있지만, 우리의 목표는 이를 케이스에 따라 각각
다른 타입으로 추론되는 것을 목표로 한다.
즉, 현재는 L20-L24 모두 string으로 타입이 추론되지만 이 글의 마지막에는 각 key에 따른 text의 형식에 맞춰 string과 ReactElement로 타입이 나뉘어지는 것을 목표로 한다.

### 줄바꿈
먼저 줄바꿈, `\n`이 i18n text에 포함 될 경우 string 대신 ReactElement으로 리턴하는 방법에 대해서 알아본다.
그를 위해서는 [Template Literal Type](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)에 대한 이해가 필요하다.

#### Template Literal Type
Typescript의 문자열에는 string 타입이 있고, literal type이 있다. 그리고 더 나아가서 literal type을 조합해서 또 다른 타입을 만드는 `Template Literal Type`이 있다.
예제로 보면 다음과 같다.
```tsx showLineNumbers
let str1 = 'example' // string
const str2 = 'example' // 'example'

type StrPrefix = 'one' | 'two'
type StrPostfix = 'type' | 'sample'

type TemplateStr = `${StrPostfix}_${StrPostfix}` // 'one_type' | 'two_type' | 'one_sample' | 'two_sample'
```
L1의 `str1`은 `let`으로 선언되어서 literal type으로 추론되지 않고 string 타입으로 추론된다. 왜냐하면 `str1` 변수는 다른 값으로 재할당이 가능하기 떄문이다.
반면, L2의 `str2`는 `const`로 선언되어 `'example'`인 literal type으로 추론된다.

L4-L5에서 선언된 `StrPrefix`와 `StrPostfix`를 합쳐 L7에서 `TemplateStr`는 4개의 literal type을 가지는 Union 타입으로 추론된다.

이 원리를 이용해서 i18n text에 있는 `\n` 텍스트를 확인하고 별도의 타입으로 추론할 예정이다.

#### 줄바꿈 타입 정의 ([playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAJQKYEMDGMA0cDejUYCiANkiEgHbwC+cAZlBCHAORQEwsDcAUD2hAoBneMACMADgoApIYLgBeXDzhwARENBhSagFzqAEkmLEIcAOrRiAEzWYV64sApIAQuxQBrPYeOmAdHAAOhRwAJJwKMwAYoRw1kgAbsYQYEhQdg5qgkgAaijEAK5IPmoAKgAWwEJwYIzWhRhw1bgADNT+mapqhRTAMKUAJDjtXeowAO4Q+UUl+uVVNXUQDU0tI7QoFNbN8BPAJnAARkjxxsDJ7DsodDDpuGK01igAnkJjak4U3vNoTmjeezdL6eMpIAAeA3mGzgMDMQgqEAmcBA0FOzjo0BAKBgwEEah4mxqAmEMF4PBgLzS4UkMjkoSUlLSEDozVpskEvCZpzCtIA0kgXoo4J5BSyaVIORRydy4AAZZxuDyeaJYnHCgAGwxEUGcAHNqCFtTBdRQDRryRSqacytFehg8Qy4AAeAVCiF3bY1XlSN2YAB8AApRS99H64IkCsUhAB+fRbF4ASkU-oldMEAG03QBdOAeyjWGoKlzuVAqtXwGP4dAwEhkSjwfQ6-XkkkiWF2igOwT6W323HyJTBwX6H0UcOR2ZCeMUJMptmS+kZkO5lA1BNcOB8NvwTTgUjCmCd7sUQMsPfaJAsROb-iCdtfJVlw-HgenliP0tea+8HdwHIzMUL79o6Z4AVGV7YBmR4gYIZ69P0LDYAArK0rSJtmN53qSsJTIBpyMq+oEsJM0wQUhcDQURcEsAhnBQahrSYdgADMmG-ve8AgmCkLAV2b5ntxHoURmzooHAFTsHQChqAA9CgRwQIUAz+jgMH8cRILXtQzryf6mFAA))
```tsx {11-15} showLineNumbers
import React, { ReactElement } from 'react';

const i18nJson = {
  "simple": "Hello World",
  "lineBreak": "Hello. \n I am FE developer",
} as const;

type I18nJson = typeof i18nJson;
type I18nKey = keyof I18nJson;

type LineBreakFormat = `${string}\n${string}`;

type TFunction = <Key extends I18nKey,>(key: Key, values?: any) => I18nJson[Key] extends LineBreakFormat ? ReactElement : string;

const tFunction: TFunction = (key: I18nKey, values: any) => i18nJson[key] as any; 

const simple = tFunction('simple'); // string
const lineBreak = tFunction('lineBreak'); // ReactElement
```
L11을 보면 Template Literal String을 사용해서 `LineBreakFormat` 타입을 별도로 만든다. `${string}\n${string}`라고 설정을 하면 string으로 감싸진 `\n` 문자열이 있을때는 
`LineBreakFormat`으로 추론된다.

우리는 `TFunction`을 호출시 RunTime에 들어오는 key의 literal type을 보고 return type을 추론해야한다. type 영역에서 `I18nKey`를 그대로 사용하면 key 입력 값에 따라 return type을 달리 할 수 없다.
여기서 [Function type inference](https://www.typescriptlang.org/docs/handbook/2/functions.html#inference)를 사용하여 아래와 같이 변경한다.
```tsx
// Before
type TFunction = (key: I18nKey, values?: any) => string

// After
type TFunction = <Key extends I18nKey,>(key: Key, values?: any) => string;
```
위와 같은 방식으로 `Key`를 Generic으로 추출하고, `TFunction`을 호출할때 Generic을 명시적으로 선언하지 않으면, key로 들어오는 literal type을 사용할 수 있게 된다.

마지막으로 Key에 대한 I18n text가 `LineBreakFormat`인지 판단하여 ReactElement와 string을 분기하면 된다.
```tsx
// Before
type TFunction = <Key extends I18nKey,>(key: Key, values?: any) => string;

// After
type TFunction = <Key extends I18nKey,>(key: Key, values?: any) => I18nJson[Key] extends LineBreakFormat ? ReactElement : string;
```
typescript에서 extends는 interface에서 사용할때는 상속의 의미이지만, [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)로 활용할 수도 있다.
따라서, i18n Text, `I18nJson[Key]`가 `LineBreakFormat`이면 ReactElement로 리턴하고, 아니라면 string 타입으로 리턴한다. 

여기서, `I18nJson[Key]`의 Key는 RunTime에 사용된 Literal Type 이므로 Key로 `simple`이 들어온다면 `I18nJson['simple']`에 대한 타입으로 추론하여 `'Hello World'` literal type에 대해서 Conditional Type을 진행하게 된다. 
마찬가지로 Key로 `lineBreak`를 사용한다면 `I18nJson['lineBreak']`의 타입인 `'Hello. \n I am FE developer'`로 타입 비교를 진행하기 때문에 `LineBreakFormat`의 비교문이 의미를 가지게 된다.

그 덕분에 L17-L18에서 각각 string과 ReactElement 타입으로 다르게 리턴 타입이 진행된다.

### 변수로 들어오는 타입 확인하기
다음으로 확인해 볼 것은 `TFunction`의 2번째 parameter 배열에 number와 string만 있는 경우 string을 리턴하고, 이외의 ReactElement와 같은 값이 포함되어 있다면 ReactElement를 리턴하게 한다.
예제로 볼 코드는 다음과 같다.
```tsx showLineNumbers
import React from 'react';

const i18nJson = {
  "oneValue": "This product is {0}.",
  "twoValue": "This product is {0} and it will be delivered after {1} days",
} as const;

type I18nJson = typeof i18nJson;
type I18nKey = keyof I18nJson;

type TFunction = (key: I18nKey, values?: any) => string

const tFunction: TFunction = (key: I18nKey, values: any) => i18nJson[key] as any; 

const oneValue = tFunction('oneValue', [100]);
const twoValue = tFunction('twoValue', [100, '200']);
const twoValueWithReactElement = tFunction('twoValue', [100, <a>Hello</a>]);
```
기존 playground 코드에서 필요한 부분만 남겨두었다. ([playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAJQKYEMDG8BmUIjgcilQ3wG4AoctCAOwGd5gBGADhoCk7a4BeOAb3Jw4AIlpIAaigA2AVyQiAXKIAqAC2B04YHABNZGOJoEAGAL4A6EQBohomAHcIUuQuUj1xnRH2Hj-czgUGl0jeAdgaWk4ACMkOF0kaWAANyQiUJRMGHSBJjMElABPOhtyApQtanoYCnIYIrB4gElWDi4aXjgGpohMIzbOWgoelraAaSQiroBrKb64VrYhmjrRuBUAMVkaDGBuPgAKOaLlJZpJous4FJl5OgB+ZWCigEpeAD44BihgGgBzSjVBjdba7GD7GjKLY7PYHODHKZnCZTa63Vx0Z40N6fAbLDoAbROAF1SHAgbQQeIXPIujAwXCaId8NS7kh8NcCUwTCZia8KMD4I5nGy6QyIbRmcKaezOdyTNcAEw8vkCylCpwygDqwBgamQ6BgAFFpEgQEgaPA+PTYRKmfhpWyOXAuTzrgAeFAfAASSWkEHdAHovaryEA))
우리의 목표는 L15, L16은 두번째 인자로 number, string 로만 이루어진 배열이 들어오기 때문에 string으로 리턴하고, L17은 `a tag`를 변수로 넣기 때문에 ReactElement로 리턴하는 것이다.

해결방법은 간단하다. values가 `(string | number)[]` 타입인지 아닌지 판단하기만 하면 된다.
```tsx
type TFunction = <Params extends any[],>(key: I18nKey, values?: Params) => Params extends (string | number)[] ? string : ReactElement
```
위 코드에서 `values`의 타입을 [type inference](https://www.typescriptlang.org/docs/handbook/2/functions.html#inference)를 사용하기 위해서 Generic type으로 추출하고 
`tFunction` 호출시에 아무런 Generic을 사용하지 않는다. 그렇다면 우리는 `Params`의 타입으로 condition type을 사용할 수 있다.

`Params`가 number, string으로만 이루어진 배열이라면 자동으로 string으로 타입 추론이 되고, 다른 값(ReactElement)가 포함되어있다면 ReactElement로 리턴된다.
[playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAJQKYEMDG8BmUIjgcilQ3wG4AoctCAOwGd5gBGADhoCk7a4BeOAb3Jw4AIlpIAaigA2AVyQiAXKIAqAC2B04YHABNZGOJoEAGAL4A6EQBohomAHcIUuQuUj1xnRH2Hj-czgUGl0jeAdgaWk4ACMkOF0kaWAANyQiUJRMGHSBJjMElABPOhtyApQtanoYCnIYIrB4gElWDi4aXjgGpohMIzbOWgoelraAaSQiroBrKb64VrYhmjrRuBUAMVkaDGBuPgAeAAUUKBQQLSQADxyQrWCigG0AXWsAPgAKOaLlJZpJkVrHAUjJ5HQAPzKU7nS4ASl47zgMIuV1uSHucE+DCgwBoAHM4AAfOA0WQgOJQOGvOAQuA4vGE5TIdAwACi0iQIAxMEo1QY3W2uxg+xoyi2Oz2ByxPz+EymwNBrjoykeCJ4SOYyw6Tx+L1IcD5tAF4hc8i6MCFUpon3wprBSHwwKeTBMJhecIo-PgjmcDotVpFtFtvrNjudrpMwIATG6PV7jT6nGGAOrAGBqFkYDlcnkByVBm34UMOp1wF1u4GHFDvAASSWkEEOAHoa-HyEA)에서 확인해보면 다음과 같이 추론된다.
```tsx
const oneValue = tFunction('oneValue', [100]); // string
const twoValue = tFunction('twoValue', [100, 200]); // string
const twoValueWithReactElement = tFunction('twoValue', [100, <a>Hello</a>]); // ReactElement
```
이로써 변수에 number, string이 아닌 값이 들어가면 ReactElement로 추론할 방법을 찾았다.

그런데, 변수가 포함된 i18n을 사용한다면 다음과 같은 케이스도 있을 것 같다.
```tsx
const i18nJson = {
  "normal": "Hello World",
  "oneValue": "This product is {0}.",
  "twoValue": "This product is {0} and it will be delivered after {1} days",
} as const;

const oneValue = tFunction('oneValue'); // 변수가 사용되어야 하지만 빈 값을 넣은 경우.
const twoValue = tFunction('twoValue', [100]); // 변수가 2개 들어가야하지만 1개만 들어간 경우.
const normal = tFunction('normal', [100]); // 변수가 없어야하는데 사용되고 있는 경우.
```
즉, 변수의 개수가 맞지 않거나 사용해야하는데 사용하지 않거나, 사용하지 않아야하는데 사용하는 경우에 대한 것이다.
이를 위해서는 조금 더 복잡한 타입 선언이 필요하게 되는데, 다음 문단을 이어서 보자.

### 변수 개수 확인하기
자, 이제 우리는 i18n text에 `{}`가 감싸진 문자열이 몇개가 되는지 찾아야한다. 이전에 줄바꿈에서 사용한대로 [Template Literal Type](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)을 
사용할테지만, 그것만으로는 부족하다.

#### [Recursive Conditional Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#recursive-conditional-types)
우리는 `{}`로 감싸진 문자열을 찾아내고 다시 `{}`로 감싸진 문자열이 있는지 확인하는 것이 필요하다. 이를 위해 쓰이는게 Recursive 방법이다.
```tsx
type ValuesArray<I18nText extends string> = I18nText extends `${string}{${string}}${string}` ? [any, ...ValuesArray<I18nText>] : []; 
// This is not working!
```
바로 위와 같은 방식으로 사용한다. (물론 위쪽 코드는 틀린 코드이다.) `ValuesArray`를 선언하고 타입 추론을 위해 `I18nText`로 i18n text를 넘겨준다고 생각한다.
그리곤, I18nText에 `{}` 형식의 literal type이 존재한다면, 배열을 하나 만들고 다시 `ValuesArray`를 수행하는 것이다.

물론, 지금 이 코드는 정상동작하지 않을 것이다. Recursive의 input, 즉 I18nText로 다시 온전한 I18nText를 넣고 있기 때문이다. 우리는 `{}`가 포함된 string 중 남은 오른쪽 string을 추출해서 recursive의 input으로 넣어야한다.
이를 예시로 설명하자면 `Hello {0} World {1} Thank {2} you` 라는 i18n text가 있을때 `ValuesArray`로 `[any, ...ValuesArray<?>]`로 추론을 했을때 ?에는 남은 문자열인 `  World {1} Thank {2} you`가 채워져야하고,
`[any, any, ...ValuesArray<?>]`로 `{1}`까지 확인을 했다면 ` Thank {2} you` 문자열이 '?' 안으로 들어가야한다. 이를 위해서 사용하는 것은 [infer](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types) 키워드이다.

#### [Inferring Within Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)
`Infer`를 사용하면 conditional type에서 사용하는 Generic을 가져다 리턴 타입으로 사용할 수 있다.
즉, 다음과 같이 된다.
```tsx
type ValuesFormat<Suffix extends string> = `${string}{${string}}${Suffix}`;
type ValuesArray<I18nText extends string> = I18nText extends ValuesFormat<infer Rest> ? [any, ...ValuesArray<Rest>] : [];
```
`ValuesFormat`은 단순 `{}`를 포함하는 문자열이 아닌 `Suffix`라는 Generic을 `}` 뒤에 포함하는 타입이다. 이는 단독으로 쓰이면 의미가 없지만, 아래의 `ValuesArray`에서 infer와 쓰이면 의미가 달라진다.
이전 예제와 같이 `ValuesArray`는 `{}`가 있는지 확인을 하고 배열을 채운다. 그러고는 `infer Rest`를 사용하는데 `Rest`는 바로 `ValuesFormat`의 첫번째 Generic인 Suffix를 의미하게 되고 Rest를 다음 recursive에 사용하면 우리가 원하는 바가 완성된다.
```tsx
type Example = 'Hello {0} World {1} Thank {2} you';

type ValuesFormat<Suffix extends string> = `${string}{${string}}${Suffix}`;
type ValuesArray<I18nText extends string> = I18nText extends ValuesFormat<infer Rest> ? [any, ...ValuesArray<Rest>] : [];

type Result = ValuesArray<Example> // [any, any, any];
```
[playground](https://www.typescriptlang.org/play?#code/C4TwDgpgBAogHgQwLZgDbQLxQOQAkKqoD2UA3gAwC+UA6kQE6oAmZAjNQCoAWCAdgNZkATNRBEArtgDcAKBmhIUAGoJU4iAGcAYgyQJgAHgDK4gGamAlnCgQ4wCLyYaoG4PQu8A5gD4oWAAYAJKSu7l6UpMGhHp6UlMEm5laU-rIK0CpqmgCC9PQIIAYAkqwAHLwctsA2dg5OLm4xvlgl5ZV2NfaOzpnq2rr6Bh6mEPRQAEqawL4A-FAA2nwgADRQAHQbvTl5BQaTrt4AulAAXAuHsvLg0PviqNVYWxq5+YXwyGgQvgD03wtLqwBUCWFxkQA)

자, 이제 처음 예제에 `ValuesArray`를 적용시켜보자.
```tsx {17,23,25} showLineNumbers
import React, { ReactElement } from 'react';

const i18nJson = {
  "normal": "Hello World",
  "oneValue": "This product is {0}.",
  "twoValue": "This product is {0} and it will be delivered after {1} days",
} as const;

type I18nJson = typeof i18nJson;
type I18nKey = keyof I18nJson;

type ValuesType = string | number | ReactElement;
type ValuesFormat<Suffix extends string> = `${string}{${string}}${Suffix}`;
type ValuesArray<I18nText extends string> = I18nText extends ValuesFormat<infer Rest> ? [ValuesType, ...ValuesArray<Rest>] : [];


type TFunction = <Key extends I18nKey, Params extends ValuesArray<I18nJson[Key]>>(key: Key, values?: Params) => string

const tFunction: TFunction = (key: I18nKey, values: any) => i18nJson[key] as any; 

const oneValue = tFunction('oneValue'); // Error?
const twoValue = tFunction('twoValue', [100]); // Type Error! 
// Argument of type '[number]' is not assignable to parameter of type '[ValuesType, ValuesType]'.
const normal = tFunction('normal', [100]); // Type Error!
// Type 'number' is not assignable to type 'undefined'.
```
[playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAJQKYEMDGMA0cDejUYCiANkiEgHbwC+cAZlBCHAORQEwsDcAUD2hAoBneMACMADgoApIYLgBeXDzhwARBWggUxNQC51ACSTFiEOAHVoxACZrMK9YKQA1HQFck+9QBUAFsBCcGCMNu4YcIG4AAzUAHT2jmowAO4QbsSe3mr+USEQYRFROLFwKBQ2kfApwKZwAEZIcDYmwABuSOyVKHQwnbhitDYoAJ5CibQoQQLCMLw8MCNgTQCSkjJyFIpwi8sQdJHrsoK8u6vrANJII9sA1tf7cGtSxxTzZ3AZnkI+S01KIigwAoAHM4AAfOAUdwgRpQCH4dAwEhkShzBZ-T4eJBCABiWhQMAAPABldx0OjAAAecCQVL6FSCgOBIIAfNsAAYAEhwzNB1BwPL5IOo1B5ZIp1OoHNOmK+OIAglAoKMic8KD46fAtZQbEyYEDQeylOrNfTafTdUF5XiCcTgXR+sgROyAPxwADaNt+y2wcX9NqVKpGROdMFZAF04AYPRH5hjlnAfLj3BQMMB5EoiVcbjrGU9LtdsAAFFAqkBBPN6rGZRXK1Xq14enMR1msgAU9xGBhz2Da2KEroMpfLQgAlIp2cK+DMRDsU2mYBmKAZk6n05m4J3rgZ1b24P3a0IDOURhOFOzxC9Nh6u1GpmUKCMuHAZ4I5855dsYAuNxR2ywn7YiwY4vgA9GBcCEMq0Cuvw77wKk6TYt+v5LoIAFIfKLDYB6YjRNEEagXAEFJpi0GMFAACEr6kUqIIwmicCPB8LAetCsKdBGLCREEmjwFMQjACCFAoPUpA7OYYBlig5B9PCLGYmx3p-NgKnLNxcTwbMUIEsQqHruh-4sJoUDaMQOGevhhHEaRPpNBR0BUTwdlKRxcI8VE-FlEIQkiWJEkwOYrGpi0lIUEgNgsHEQA)

L17의 `TFunction`에서 `Parmas`에 `ValuesArray`를 적용시켰다. `ValuesArray`의 Generic으로는 `I18nJson[Key]`를 넣어서 Key를 타입추론을 통해 동적으로 받아 i18n text가 Generic으로 들어갈 수 있도록 한다.
그렇다면, Params는 각각 length가 고정된 `ValuesType` 배열로 추론될 것이다.

따라서, L22와 L24의 타입 체크에서 에러가 발생하게 되고 에러의 원인은 적절한 Array length를 맞추지 않았기 때문이다.
하지만 L21에서는 변수를 넣지 않았다고 에러를 발생시키지 않는데, 이는 TFunction의 values에 붙은 `?` 키워드로 인하여 발생한다.

조금만 더 완성도를 높여보자.

#### [Rest Parameters](https://www.typescriptlang.org/docs/handbook/2/functions.html#rest-parameters-and-arguments) 



### Values를 객체로 받기
## JSON을 import하는 방식
## Recap