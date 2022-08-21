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
- typescript 4.1+
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

```tsx
import tFunction from 'utils';

1. tFunction('lineBreak') 
// Hello <br /> I am FE developer
2. tFunction('oneValue', [tFunction('unit', [1000])])
// This product is $1000.
3. tFunction('twoValue', [tFunction('unit', [500]), 3])
// This product is $500 and it will be delivered after 3 days
4. tFunction('linkText', [<a href="/more">{tFunction('link')}</a>])
// <a href="/more">click</a> to show more information 
```
1번 케이스를 보자.

1번은 `<br />`을 포함하고 있기 때문에 일반 string으로 추론되면 안된다. 따라서 i18n text에 `\n` 같은 줄바꿈이 있다면 `ReactElement`로 타입이 추론되어야 한다.

2, 3번은 `values({0}, {1})`가 들어가 있지만 추가로 들어간 value 역시 string 혹은 number이다. 따라서 `string`으로 추론되어도 된다.

마지막 4번은 2, 3번과는 조금 다르다. values로 a tag가 포함되었고 이를 그려주기 위해서는 `ReactElement`로 타입이 추론되어야한다.

### Recap of Goal
따라서 목표를 정리하자면 다음과 같다.
- i18n key에 따라서 `tFunction`의 return 타입이 추론되어야한다.
- `tFunction`의 return 타입은 i18n key에 매칭되는 i18n value에서 가지고 있는 포맷에 따라 달라진다.
  - i18n value에서 `\n` 줄바꿈 키워드를 가지고 있다면 `ReactElement`로 추론한다.
  - i18n value에서 `{}` 변수 키워드를 가지고 있고, 변수로 string과 number 같은 값이 들어온다면 string으로 추론한다.
  - i18n value에서 `{}` 변수 키워드를 가지고 있고, 변수로 string과 number 가 아닌 값이 들어온다면 ReactElement으로 추론한다.
- 추가로, 해당 i18n value가 `{}` 변수 키워드를 가지고 있는지 여부, 몇개를 가지고 있는지 여부에 따라 `tFunciton`의 2번째 parameter에 타입을 체크했으면 좋겠다.

## Literal Type


### 줄바꿈 
### Values 개수 확인하기
### Values로 들어오는 타입 확인하기
### Values를 객체로 받기
## JSON을 import하는 방식
## Recap